import { h, Component, Element, Prop, State, Build, forceUpdate } from '@stencil/core';

import { FlashMode } from '../../definitions';

import './imagecapture';

declare var window: any;

@Component({
  tag: 'pwa-camera',
  styleUrl: 'camera.css',
  assetsDirs: ['icons'],
  shadow: true
})
export class CameraPWA {
  @Element() el;

  @Prop() facingMode: string = 'user';

  @Prop() handlePhoto: (photo: Blob) => void;
  @Prop() hidePicker: boolean = false;
  @Prop() handleNoDeviceError: (e?: any) => void;
  @Prop() noDevicesText = 'No camera found';
  @Prop() noDevicesButtonText = 'Choose image';

  @State() photo: any;
  @State() photoSrc: any;
  @State() showShutterOverlay = false;
  @State() flashIndex = 0;
  @State() hasCamera: boolean | null = null;
  @State() rotation = 0;
  @State() deviceError: any | null = null;

  // The orientation of the current photo
  photoOrientation: number;

  exifData: any;

  offscreenCanvas: HTMLCanvasElement;

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
    if (Build.isServer) {
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

  disconnectedCallback() {
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
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind == 'videoinput')

      this.hasCamera = !!videoDevices.length;
      this.hasMultipleCameras = videoDevices.length > 1;
    } catch(e) {
      this.deviceError = e;
    }
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
      this.deviceError = e;
      this.handleNoDeviceError && this.handleNoDeviceError(e);
    }
  }

  async initStream(stream: MediaStream) {
    this.stream = stream;
    this.videoElement.srcObject = stream;

    if (this.hasImageCapture()) {
      this.imageCapture = new window.ImageCapture(stream.getVideoTracks()[0]);
      await this.initPhotoCapabilities(this.imageCapture);
    } else {
      this.deviceError = 'No image capture';
      this.handleNoDeviceError && this.handleNoDeviceError();
    }

    // Always re-render
    forceUpdate(this.el);
  }

  async initPhotoCapabilities(imageCapture: any) {
    const c = await imageCapture.getPhotoCapabilities();

    if (c.fillLightMode && c.fillLightMode.length > 1) {
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
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
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
    this.stopStream();
  }

  async promptAccept(photo: any) {
    this.photo = photo;

    const orientation = await this.getOrientation(photo);

    console.debug('Got orientation', orientation);

    this.photoOrientation = orientation;

    if (orientation) {
      switch (orientation) {
        case 1:
        case 2:
          this.rotation = 0;
          break;
        case 3:
        case 4:
          this.rotation = 180;
          break;
        case 5:
        case 6:
          this.rotation = 90;
          break;
        case 7:
        case 8:
          this.rotation = 270;
          break;
      }
    }

    this.photoSrc = URL.createObjectURL(photo);
  }

  private getOrientation(file): Promise<number> {
    return new Promise(resolve => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const view = new DataView((event.target as any).result as ArrayBuffer);

        if (view.getUint16(0, false) !== 0xFFD8) { return resolve(-2); }

        const length = view.byteLength;
        let offset = 2;

        while (offset < length) {
          const marker = view.getUint16(offset, false);
          offset += 2;

          if (marker === 0xFFE1) {
            if (view.getUint32(offset += 2, false) !== 0x45786966) {
              return resolve(-1);
            }
            const little = view.getUint16(offset += 6, false) === 0x4949;
            offset += view.getUint32(offset + 4, little);
            const tags = view.getUint16(offset, little);
            offset += 2;

            for (let i = 0; i < tags; i++) {
              if (view.getUint16(offset + (i * 12), little) === 0x0112) {
                return resolve(view.getUint16(offset + (i * 12) + 8, little));
              }
            }
          } else if ((marker & 0xFF00) !== 0xFF00) { break; } else { offset += view.getUint16(offset, false); }
        }
        return resolve(-1);
      };

      reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
    });
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
      if (c.facingMode) {
        facingMode = c.facingMode[0];
      }
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
    console.debug('New flash mode: ', mode);
    this.flashMode = mode;
  }

  cycleFlash() {
    if (this.flashModes.length > 0) {
      this.flashIndex = (this.flashIndex + 1) % this.flashModes.length;
      this.setFlashMode(this.flashModes[this.flashIndex]);
    }
  }

  async flashScreen() {
    return new Promise<void>((resolve, _reject) => {
      this.showShutterOverlay = true;
      setTimeout(() => {
        this.showShutterOverlay = false;
        resolve();
      }, 100);
    });
  }

  handlePickFile = (_e: Event) => {
  }

  handleShutterClick = (_e: Event) => {
    console.debug('shutter click');
    this.capture();
  }

  handleRotateClick = (_e: Event) => {
    this.rotate();
  }

  handleClose = (_e: Event) => {
    this.handlePhoto && this.handlePhoto(null);
  }

  handleFlashClick = (_e: Event) => {
    this.cycleFlash();
  }

  handleCancelPhoto = (_e: Event) => {
    const track = this.stream && this.stream.getTracks()[0];
    let c = track && track.getConstraints();
    this.photo = null;
    this.photoSrc = null;

    if (c) {
      this.initCamera({
        video: {
          facingMode: c.facingMode
        }
      });
    } else {
      this.initCamera();
    }
  }

  handleAcceptPhoto = (_e: Event) => {
    this.handlePhoto && this.handlePhoto(this.photo);
  }

  handleFileInputChange = async (e: InputEvent) => {
    const input = e.target as HTMLInputElement;
    const file = input.files[0];

    try {
      const orientation = await this.getOrientation(file);
      console.debug('Got orientation', orientation);
      this.photoOrientation = orientation;
    } catch (e) {
    }

    this.handlePhoto && this.handlePhoto(file);
  }

  handleVideoMetadata = (e: Event) => {
    console.debug('Video metadata', e);
  }

  iconExit() {
    return `data:image/svg+xml,%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'%3E%3Cg id='Icon_5_'%3E%3Cg%3E%3Cpath fill='%23FFFFFF' d='M402.2,134L378,109.8c-1.6-1.6-4.1-1.6-5.7,0L258.8,223.4c-1.6,1.6-4.1,1.6-5.7,0L139.6,109.8 c-1.6-1.6-4.1-1.6-5.7,0L109.8,134c-1.6,1.6-1.6,4.1,0,5.7l113.5,113.5c1.6,1.6,1.6,4.1,0,5.7L109.8,372.4c-1.6,1.6-1.6,4.1,0,5.7 l24.1,24.1c1.6,1.6,4.1,1.6,5.7,0l113.5-113.5c1.6-1.6,4.1-1.6,5.7,0l113.5,113.5c1.6,1.6,4.1,1.6,5.7,0l24.1-24.1 c1.6-1.6,1.6-4.1,0-5.7L288.6,258.8c-1.6-1.6-1.6-4.1,0-5.7l113.5-113.5C403.7,138.1,403.7,135.5,402.2,134z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;
  }

  iconPhotos() {
    return (
      <svg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'><path d='M450.29,112H142c-34,0-62,27.51-62,61.33V418.67C80,452.49,108,480,142,480H450c34,0,62-26.18,62-60V173.33C512,139.51,484.32,112,450.29,112Zm-77.15,61.34a46,46,0,1,1-46.28,46A46.19,46.19,0,0,1,373.14,173.33Zm-231.55,276c-17,0-29.86-13.75-29.86-30.66V353.85l90.46-80.79a46.54,46.54,0,0,1,63.44,1.83L328.27,337l-113,112.33ZM480,418.67a30.67,30.67,0,0,1-30.71,30.66H259L376.08,333a46.24,46.24,0,0,1,59.44-.16L480,370.59Z'/><path d='M384,32H64A64,64,0,0,0,0,96V352a64.11,64.11,0,0,0,48,62V152a72,72,0,0,1,72-72H446A64.11,64.11,0,0,0,384,32Z'/></svg>
    );
  }

  iconConfirm() {
    return `data:image/svg+xml,%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'%3E%3Ccircle fill='%232CD865' cx='256' cy='256' r='256'/%3E%3Cg id='Icon_1_'%3E%3Cg%3E%3Cg%3E%3Cpath fill='%23FFFFFF' d='M208,301.4l-55.4-55.5c-1.5-1.5-4-1.6-5.6-0.1l-23.4,22.3c-1.6,1.6-1.7,4.1-0.1,5.7l81.6,81.4 c3.1,3.1,8.2,3.1,11.3,0l171.8-171.7c1.6-1.6,1.6-4.2-0.1-5.7l-23.4-22.3c-1.6-1.5-4.1-1.5-5.6,0.1L213.7,301.4 C212.1,303,209.6,303,208,301.4z'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;
  }

  iconReverseCamera() {
    return `data:image/svg+xml,%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'%3E%3Cg%3E%3Cpath fill='%23FFFFFF' d='M352,0H160C72,0,0,72,0,160v192c0,88,72,160,160,160h192c88,0,160-72,160-160V160C512,72,440,0,352,0z M356.7,365.8l-3.7,3.3c-27,23.2-61.4,35.9-96.8,35.9c-72.4,0-135.8-54.7-147-125.6c-0.3-1.9-2-3.3-3.9-3.3H64 c-3.3,0-5.2-3.8-3.2-6.4l61.1-81.4c1.6-2.1,4.7-2.1,6.4-0.1l63.3,81.4c2,2.6,0.2,6.5-3.2,6.5h-40.6c-2.5,0-4.5,2.4-3.9,4.8 c11.5,51.5,59.2,90.6,112.4,90.6c26.4,0,51.8-9.7,73.7-27.9l3.1-2.5c1.6-1.3,3.9-1.1,5.3,0.3l18.5,18.6 C358.5,361.6,358.4,364.3,356.7,365.8z M451.4,245.6l-61,83.5c-1.6,2.2-4.8,2.2-6.4,0.1l-63.3-83.3c-2-2.6-0.1-6.4,3.2-6.4h40.8 c2.5,0,4.4-2.3,3.9-4.8c-5.1-24.2-17.8-46.5-36.5-63.7c-21.2-19.4-48.2-30.1-76-30.1c-26.5,0-52.6,9.7-73.7,27.3l-3.1,2.5 c-1.6,1.3-3.9,1.2-5.4-0.3l-18.5-18.5c-1.6-1.6-1.5-4.3,0.2-5.9l3.5-3.1c27-23.2,61.4-35.9,96.8-35.9c38,0,73.9,13.7,101.2,38.7 c23.2,21.1,40.3,55.2,45.7,90.1c0.3,1.9,1.9,3.4,3.9,3.4h41.3C451.4,239.2,453.3,243,451.4,245.6z'/%3E%3C/g%3E%3C/svg%3E`;
  }

  iconRetake() {
    return `data:image/svg+xml,%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'%3E%3Ccircle fill='%23727A87' cx='256' cy='256' r='256'/%3E%3Cg id='Icon_5_'%3E%3Cg%3E%3Cpath fill='%23FFFFFF' d='M394.2,142L370,117.8c-1.6-1.6-4.1-1.6-5.7,0L258.8,223.4c-1.6,1.6-4.1,1.6-5.7,0L147.6,117.8 c-1.6-1.6-4.1-1.6-5.7,0L117.8,142c-1.6,1.6-1.6,4.1,0,5.7l105.5,105.5c1.6,1.6,1.6,4.1,0,5.7L117.8,364.4c-1.6,1.6-1.6,4.1,0,5.7 l24.1,24.1c1.6,1.6,4.1,1.6,5.7,0l105.5-105.5c1.6-1.6,4.1-1.6,5.7,0l105.5,105.5c1.6,1.6,4.1,1.6,5.7,0l24.1-24.1 c1.6-1.6,1.6-4.1,0-5.7L288.6,258.8c-1.6-1.6-1.6-4.1,0-5.7l105.5-105.5C395.7,146.1,395.7,143.5,394.2,142z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;
  }

  iconFlashOff() {
    return `data:image/svg+xml,%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 512 512' style='enable-background:new 0 0 512 512;' xml:space='preserve'%3E%3Cstyle type='text/css'%3E .st0%7Bfill:%23FFFFFF;%7D%0A%3C/style%3E%3Cg%3E%3Cpath class='st0' d='M498,483.7L42.3,28L14,56.4l149.8,149.8L91,293.8c-2.5,3-0.1,7.2,3.9,7.2h143.9c1.6,0,2.7,1.3,2.4,2.7 L197.6,507c-1,4.4,5.8,6.9,8.9,3.2l118.6-142.8L469.6,512L498,483.7z'/%3E%3Cpath class='st0' d='M449,218.2c2.5-3,0.1-7.2-3.9-7.2H301.2c-1.6,0-2.7-1.3-2.4-2.7L342.4,5c1-4.4-5.8-6.9-8.9-3.2L214.9,144.6 l161.3,161.3L449,218.2z'/%3E%3C/g%3E%3C/svg%3E`;
  }

  iconFlashOn() {
    return `data:image/svg+xml,%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 512 512' style='enable-background:new 0 0 512 512;' xml:space='preserve'%3E%3Cstyle type='text/css'%3E .st0%7Bfill:%23FFFFFF;%7D%0A%3C/style%3E%3Cpath class='st0' d='M287.2,211c-1.6,0-2.7-1.3-2.4-2.7L328.4,5c1-4.4-5.8-6.9-8.9-3.2L77,293.8c-2.5,3-0.1,7.2,3.9,7.2h143.9 c1.6,0,2.7,1.3,2.4,2.7L183.6,507c-1,4.4,5.8,6.9,8.9,3.2l242.5-292c2.5-3,0.1-7.2-3.9-7.2L287.2,211L287.2,211z'/%3E%3C/svg%3E`;
  }

  iconFlashAuto() {
    return `data:image/svg+xml,%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 512 512' style='enable-background:new 0 0 512 512;' xml:space='preserve'%3E%3Cstyle type='text/css'%3E .st0%7Bfill:%23FFFFFF;%7D%0A%3C/style%3E%3Cpath class='st0' d='M287.2,211c-1.6,0-2.7-1.3-2.4-2.7L328.4,5c1-4.4-5.8-6.9-8.9-3.2L77,293.8c-2.5,3-0.1,7.2,3.9,7.2h143.9 c1.6,0,2.7,1.3,2.4,2.7L183.6,507c-1,4.4,5.8,6.9,8.9,3.2l242.5-292c2.5-3,0.1-7.2-3.9-7.2L287.2,211L287.2,211z'/%3E%3Cg%3E%3Cpath class='st0' d='M321.3,186l74-186H438l74,186h-43.5l-11.9-32.5h-80.9l-12,32.5H321.3z M415.8,47.9l-27.2,70.7h54.9l-27.2-70.7 H415.8z'/%3E%3C/g%3E%3C/svg%3E`;
  }


  render() {
    // const acceptStyles = { transform: `rotate(${-this.rotation}deg)` };
    const acceptStyles = {};

    return (
      <div class="camera-wrapper">
        <div class="camera-header">
          <section class="items">
            <div class="item close" onClick={e => this.handleClose(e)}>
              <img src={this.iconExit()} />
            </div>
            <div class="item flash" onClick={e => this.handleFlashClick(e)}>
              {this.flashModes.length > 0 && (
              <div>
                {this.flashMode == 'off' ? <img src={this.iconFlashOff()} /> : ''}
                {this.flashMode == 'auto' ? <img src={this.iconFlashAuto()} /> : ''}
                {this.flashMode == 'flash' ? <img src={this.iconFlashOn()} /> : ''}
              </div>
              )}
            </div>
          </section>
        </div>

        {(this.hasCamera === false || !!this.deviceError) && (
          <div class="no-device">
            <h2>{this.noDevicesText}</h2>

            <label htmlFor="_pwa-elements-camera-input">
              {this.noDevicesButtonText}
            </label>
            <input
              type="file"
              id="_pwa-elements-camera-input"
              onChange={this.handleFileInputChange}
              accept="image/*"
              class="select-file-button" />
          </div>
        )}
        {/* Show the taken photo for the Accept UI*/}
        {this.photoSrc ? (
        <div class="accept">
          <div
            class="accept-image"
            style={{
              backgroundImage: `url(${this.photoSrc})`,
              ...acceptStyles
            }} />
        </div>
        ) : (
          <div class="camera-video">
            {this.showShutterOverlay && (
            <div class="shutter-overlay">
            </div>
            )}
            {this.hasImageCapture() ? (
            <video
              ref={(el: HTMLVideoElement) => this.videoElement = el}
              onLoadedMetaData={this.handleVideoMetadata}
              autoplay
              playsinline />
            ) : (
            <canvas ref={(el: HTMLCanvasElement) => this.canvasElement = el} width="100%" height="100%"></canvas>
            )}
            <canvas class="offscreen-image-render" ref={e => this.offscreenCanvas = e} width="100%" height="100%" />
          </div>
        )}

        {this.hasCamera && (
        <div class="camera-footer">
          {!this.photo ? ([
          !this.hidePicker && (<div class="pick-image" onClick={this.handlePickFile}>
            <label htmlFor="_pwa-elements-file-pick">
              {this.iconPhotos()}
            </label>
            <input
              type="file"
              id="_pwa-elements-file-pick"
              onChange={this.handleFileInputChange}
              accept="image/*"
              class="pick-image-button" />
          </div>),
          <div class="shutter" onClick={this.handleShutterClick}>
            <div class="shutter-button"></div>
          </div>,
          <div class="rotate" onClick={this.handleRotateClick}>
            <img src={this.iconReverseCamera()} />
          </div>,
          ]) : (
          <section class="items">
            <div class="item accept-cancel" onClick={e => this.handleCancelPhoto(e)}>
              <img src={this.iconRetake()} />
            </div>
            <div class="item accept-use" onClick={e => this.handleAcceptPhoto(e)}>
              <img src={this.iconConfirm()} />
            </div>
          </section>
          )}
        </div>
        )}
      </div>
    );
  }
}
