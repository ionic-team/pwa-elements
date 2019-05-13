import { Component, Element, Prop, State } from '@stencil/core';

import { FlashMode } from '../../definitions';

import './imagecapture';

declare var window: any;

@Component({
  tag: 'pwa-camera',
  styleUrl: 'camera.css',
  assetsDir: 'icons',
  shadow: true
})
export class CameraPWA {
  @Element() el;

  @Prop({ context: 'isServer' }) private isServer: boolean;
  @Prop({ context: 'publicPath'}) private publicPath: string;

  @Prop() facingMode: string = 'user';

  // @Event() onPhoto: EventEmitter;
  @Prop() onPhoto: (e: any) => void;

  @State() photo: any;
  @State() photoSrc: any;
  @State() showShutterOverlay = false;
  @State() flashIndex = 0;

  @State() cameraError = false;
  @State() cameraErrorString;

  defaultConstraints: any;
  // Current stream
  stream: MediaStream;
  // Reference to our image capture object
  imageCapture: any;
  // Video element when using ImageCapture native API
  videoElement: HTMLVideoElement;
  // Canvas element for ImageCapture polyfill
  canvasElement: HTMLCanvasElement;
  // Whether the device has multiple cameras (front/back)
  hasMultipleCameras = false;
  // Whether the device has flash support
  hasFlash = false;
  // Flash modes for camera
  flashModes: FlashMode[] = [];
  // Current flash mode
  flashMode: FlashMode = 'off';

  async componentDidLoad() {
    if (this.isServer) {
      return;
    }

    this.defaultConstraints = {
      video: {
        facingMode: this.facingMode
      }
    };

    // Figure out how many cameras we have
    await this.queryDevices();

    // Initialize the camera
    await this.initCamera();
  }

  componentDidUnload() {
    this.stopStream();
    this.photoSrc && URL.revokeObjectURL(this.photoSrc);
  }

  hasImageCapture() {
    return 'ImageCapture' in window;
  }

  /**
   * Query the list of connected devices and figure out how many video inputs we have.
   */
  async queryDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    this.hasMultipleCameras = devices.filter(d => d.kind == 'videoinput').length > 1;
  }

  async initCamera(constraints?: MediaStreamConstraints) {
    if (!constraints) {
      constraints = this.defaultConstraints;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
        ...constraints
      });

      this.initStream(stream);
    } catch(e) {
      this.cameraError = true;
      this.cameraErrorString = this.buildError(e);
      console.error(e);
    }
  }

  buildError(e) {
    switch (e.name) {
      case "DevicesNotFoundError":
        return "No Camera found";
    }
    return "Unable to initialize Camera";
  }

  async initStream(stream: MediaStream) {
    this.stream = stream;
    this.videoElement.srcObject = stream;

    console.log(stream.getVideoTracks()[0]);

    if (this.hasImageCapture()) {
      this.imageCapture = new window.ImageCapture(stream.getVideoTracks()[0]);
      // console.log(stream.getTracks()[0].getCapabilities());
      await this.initPhotoCapabilities(this.imageCapture);
    } else {
      // TODO: DO SOMETHING ELSE HERE
    }

    // Always re-render
    this.el.forceUpdate();
  }

  async initPhotoCapabilities(imageCapture: any) {
    const c = await imageCapture.getPhotoCapabilities();

    if (c.fillLightMode.length > 1) {
      this.flashModes = c.fillLightMode.map(m => m);

      // Try to recall the current flash mode
      if (this.flashMode) {
        this.flashMode = this.flashModes[this.flashModes.indexOf(this.flashMode)] || 'off';
        this.flashIndex = this.flashModes.indexOf(this.flashMode) || 0;
      } else {
        this.flashIndex = 0;
      }
    }
  }

  stopStream() {
    this.stream && this.stream.getTracks().forEach(track => track.stop());
  }

  async capture() {
    if (this.hasImageCapture()) {
      try {
        const photo = await this.imageCapture.takePhoto({
          fillLightMode: this.flashModes.length > 1 ? this.flashMode : undefined
        });
        
        await this.flashScreen();

        this.promptAccept(photo);
      } catch (e) {
        console.error('Unable to take photo!', e);
      }
    }
  }

  async promptAccept(photo: any) {
    this.photo = photo;
    this.photoSrc = URL.createObjectURL(photo);
  }

  rotate() {
    this.stopStream();

    const track = this.stream && this.stream.getTracks()[0];
    if (!track) {
      return;
    }

    let c = track.getConstraints();
    let facingMode = c.facingMode;

    if (!facingMode) {
      let c = track.getCapabilities();
      facingMode = c.facingMode[0];
    }

    if (facingMode === 'environment') {
      this.initCamera({
        video: {
          facingMode: 'user'
        }
      });
    } else {
      this.initCamera({
        video: {
          facingMode: 'environment'
        }
      });
    }
  }

  setFlashMode(mode: FlashMode) {
    console.log('New flash mode: ', mode);
    this.flashMode = mode;
  }

  cycleFlash() {
    if (this.flashModes.length > 0) {
      this.flashIndex = (this.flashIndex + 1) % this.flashModes.length;
      this.setFlashMode(this.flashModes[this.flashIndex]);
    }
  }

  async flashScreen() {
    return new Promise((resolve, _reject) => {
      this.showShutterOverlay = true;
      setTimeout(() => {
        this.showShutterOverlay = false;
        resolve();
      }, 100);
    });
  }

  handleShutterClick(_e: Event) {
    console.log()
    this.capture();
  }

  handleRotateClick(_e: Event) {
    this.rotate();
  }

  handleClose(_e: Event) {
    this.onPhoto && this.onPhoto(null);
  }

  handleFlashClick(_e: Event) {
    this.cycleFlash();
  }

  handleCancelPhoto(_e: Event) {
    this.photo = null;
  }

  handleAcceptPhoto(_e: Event) {
    console.log('Accepting photoi', this.photo);
    this.onPhoto && this.onPhoto(this.photo);
  }

  render() {
    return (
      <div class="camera-wrapper">
        <div class="camera-header">
          <section class="items">
            <div class="item close" onClick={e => this.handleClose(e)}>
              <img src={`${this.publicPath}icons/exit.svg`} />
            </div>
            <div class="item flash" onClick={e => this.handleFlashClick(e)}>
              {this.flashModes.length > 0 && (
              <div>
                {this.flashMode == 'off' ? <img src={`${this.publicPath}icons/flash-off.svg`} /> : ''}
                {this.flashMode == 'auto' ? <img src={`${this.publicPath}icons/flash-auto.svg`} /> : ''}
                {this.flashMode == 'flash' ? <img src={`${this.publicPath}icons/flash-on.svg`} /> : ''}
              </div>
              )}
            </div>
          </section>
        </div>

        {/* Show the taken photo for the Accept UI*/}
        {this.photo && (
        <div class="accept">
          <div class="accept-image" style={{backgroundImage: `url(${this.photoSrc})`}}></div>
        </div>
        )}

        {/* Only toggle visibility of the video feed to keep it responsive */}
        <div class="camera-video" style={{display: this.photo ? 'none' : ''}}>
          {this.cameraError && (
          <div class="error">
            {this.cameraErrorString}
          </div>
          )}

          {this.showShutterOverlay && (
          <div class="shutter-overlay">
          </div>
          )}
          {this.hasImageCapture() ? (
          <video ref={(el: HTMLVideoElement) => this.videoElement = el} autoplay playsinline></video>
          ) : (
          <canvas ref={(el: HTMLCanvasElement) => this.canvasElement = el} width="100%" height="100%"></canvas>
          )}
        </div>

        <div class="camera-footer">
          {!this.photo ? ([
          <div class="shutter" onClick={(e) => this.handleShutterClick(e)}>
            <div class="shutter-button"></div>
          </div>,
          <div class="rotate" onClick={(e) => this.handleRotateClick(e)}>
            <img src={`${this.publicPath}icons/reverse-camera.svg`} />
          </div>,
          {/*this.hasMultipleCameras && (<div class="item rotate" onClick={(e) => this.handleRotateClick(e)}></div>)*/}
          ]) : (
          <section class="items">
            <div class="item accept-cancel" onClick={e => this.handleCancelPhoto(e)}>
              <img src={`${this.publicPath}icons/retake.svg`} />
            </div>
            <div class="item accept-use" onClick={e => this.handleAcceptPhoto(e)}>
              <img src={`${this.publicPath}icons/confirm.svg`} />
            </div>
          </section>
          )}
        </div>
      </div>
    );
  }
}
