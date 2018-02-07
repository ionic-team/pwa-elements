import { Component, Prop, State, Event, EventEmitter } from '@stencil/core';

declare var window:any;

@Component({
  tag: 'ion-camera',
  styleUrl: 'camera.scss',
  shadow: true
})
export class Camera {
  @Prop({ context: 'isServer' }) private isServer: boolean;

  @Event() onPhoto: EventEmitter;

  stream: MediaStream;
  imageCapture: any;
  videoElement: HTMLVideoElement;

  @State() photo: any;
  @State() photoSrc: any;

  hasMultipleCameras = false;

  async componentDidLoad() {
    if (this.isServer) {
      return;
    }

    // Figure out how many cameras we have
    await this.queryDevices();

    // Initialize the camera
    await this.initCamera();
  }

  /**
   * Query the list of connected devices and figure out how many video inputs we have.
   */
  async queryDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    this.hasMultipleCameras = devices.filter(d => d.kind == 'videoinput').length > 1;
  }

  async initCamera(constraints: MediaStreamConstraints = {}) {
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

  componentDidUnload() {
    this.stopStream();
  }

  hasImageCapture() {
    return 'ImageCapture' in window;
  }

  initStream(stream: MediaStream) {
    this.stream = stream;
    this.videoElement.srcObject = stream;

    if (this.hasImageCapture()) {
      this.imageCapture = new window.ImageCapture(stream.getVideoTracks()[0]);
      // console.log(stream.getTracks()[0].getCapabilities());
    } else {
      // TODO: DO SOMETHING ELSE HERE
    }
  }

  stopStream() {
    this.stream && this.stream.getTracks().forEach(track => track.stop());
  }

  async capture() {
    if (this.hasImageCapture()) {
      try {
        const photo = await this.imageCapture.takePhoto();

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

    const constraints = track.getConstraints();
    if (constraints.facingMode === 'environment') {
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

  flashScreen() {
    console.log('Flashing screen');
  }

  handleShutterClick(_e: Event) {
    console.log()
    this.capture();
  }

  handleRotateClick(_e: Event) {
    this.rotate();
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
          {this.hasMultipleCameras && (<div class="rotate" onClick={(e) => this.handleRotateClick(e)}></div>)}
        </div>

        {/* Show the taken photo for the Accept UI*/}
        {this.photo && (
        <div class="accept">
          <div class="accept-image" style={{backgroundImage: `url(${this.photoSrc})`}}></div>
        </div>
        )}

        {/* Only toggle visibility of the video feed to keep it responsive */}
        <div class="camera-video" style={{display: this.photo ? 'none' : ''}}>
          <video ref={(el: HTMLVideoElement) => this.videoElement = el} autoplay></video>
        </div>

        <div class="camera-footer">
          {!this.photo ? (
          <div class="shutter" onClick={(e) => this.handleShutterClick(e)}>
            <div class="shutter-button"></div>
          </div>
          ) : (
          <section class="items">
            <div class="item" onClick={e => this.handleCancelPhoto(e)}>
              Cancel
            </div>
            <div class="item" onClick={e => this.handleAcceptPhoto(e)}>
              Use
            </div>
          </section>
          )}
        </div>
      </div>
    );
  }
}
