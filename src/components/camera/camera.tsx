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

  async componentDidLoad() {
    if (this.isServer) {
      return;
    }

    await this.initCamera();
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

  canRotate() {
    if (!this.stream) {
      return false;
    }

  }

  handleShutterClick(_e: Event) {
    this.capture();
  }

  handleRotateClick(_e: Event) {
    this.rotate();
  }

  render() {
    return [
      <div class="accept">
      </div>,
      <div class="rotate" onClick={(e) => this.handleRotateClick(e)}>Rotate</div>,
      <video ref={(el: HTMLVideoElement) => this.videoElement = el} autoplay></video>,
      <div class="shutter" onClick={(e) => this.handleShutterClick(e)}>
        <div class="shutter-ring">
          <div class="shutter-button"></div>
        </div>
      </div>
    ];
  }
}
