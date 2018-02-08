import { Component, Prop, State, Event, EventEmitter } from '@stencil/core';

import './imagecapture';

declare var window:any;

export interface MediaSettingsRange {
  min: number;
  max: number;
  step: number;
}

export interface PhotoCapabilities {
  redEyeReduction: "never" | "always" | "controllable";
  imageHeight: MediaSettingsRange;
  imageWidth: MediaSettingsRange;
  fillLightMode: string[];
}

export interface FlashMode {
  name: "auto" | "off" | "flash";
}

@Component({
  tag: 'ion-camera',
  styleUrl: 'camera.scss',
  shadow: true
})
export class Camera {
  @Prop({ context: 'isServer' }) private isServer: boolean;

  @Prop() facingMode: string = 'user';

  @Event() onPhoto: EventEmitter;
  @State() photo: any;
  @State() photoSrc: any;
  @State() showShutterOverlay = false;
  @State() flashIndex = 0;

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
    console.log('Initializing', constraints);
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
      console.error(e);
    }
  }

  async initStream(stream: MediaStream) {
    this.stream = stream;
    this.videoElement.srcObject = stream;

    if (this.hasImageCapture()) {
      this.imageCapture = new window.ImageCapture(stream.getVideoTracks()[0]);
      // console.log(stream.getTracks()[0].getCapabilities());
      this.initPhotoCapabilities(this.imageCapture);
    } else {
      // TODO: DO SOMETHING ELSE HERE
    }
  }

  async initPhotoCapabilities(imageCapture: any) {
    const c = await imageCapture.getPhotoCapabilities();

    if (c.fillLightMode.length) {
      this.flashModes = c.fillLightMode.map(m => m);
    }
  }

  stopStream() {
    this.stream && this.stream.getTracks().forEach(track => track.stop());
  }

  async capture() {
    if (this.hasImageCapture()) {
      try {
        const photo = await this.imageCapture.takePhoto();
        
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

    const c = track.getConstraints();

    if (c.facingMode === 'environment') {
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
  }

  cycleFlash() {
    this.flashIndex = this.flashIndex + 1 % this.flashModes.length;
    this.setFlashMode(this.flashModes[this.flashIndex]);
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
    this.onPhoto.emit(null);
  }

  handleFlashClick(_e: Event) {
    this.cycleFlash();
  }

  handleCancelPhoto(_e: Event) {
    this.photo = null;
  }

  handleAcceptPhoto(_e: Event) {
    this.onPhoto.emit(this.photo);
  }

  render() {
    return (
      <div class="camera-wrapper">
        <div class="camera-header">
          <section class="items">
            <div class="item close" onClick={e => this.handleClose(e)}>
            </div>
            <div class="item flash" onClick={e => this.handleFlashClick(e)}>
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
          </div>,
          {/*this.hasMultipleCameras && (<div class="item rotate" onClick={(e) => this.handleRotateClick(e)}></div>)*/}
          ]) : (
          <section class="items">
            <div class="item accept-cancel" onClick={e => this.handleCancelPhoto(e)}>
            </div>
            <div class="item accept-use" onClick={e => this.handleAcceptPhoto(e)}>
            </div>
          </section>
          )}
        </div>
      </div>
    );
  }
}
