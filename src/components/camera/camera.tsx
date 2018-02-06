import { Component, Prop } from '@stencil/core';

declare var window:any;

@Component({
  tag: 'ion-camera',
  styleUrl: 'camera.scss',
  shadow: true
})
export class Camera {
  @Prop({ context: 'isServer' }) private isServer: boolean;

  stream: MediaStream;
  imageCapture: any;
  videoElement: HTMLVideoElement;

  async componentDidLoad() {
    if (this.isServer) {
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      this.initStream(stream);
    } catch(e) {
      console.error(e);
    }
  }

  hasImageCapture() {
    return 'ImageCapture' in window;
  }

  initStream(stream: MediaStream) {
    this.stream = stream;
    this.videoElement.srcObject = stream;

    if (this.hasImageCapture()) {
      this.imageCapture = new window.ImageCapture(stream.getVideoTracks()[0]);
      console.log('Built image capture', this.imageCapture);
    }
  }

  stopStream() {
    const track = this.stream && this.stream.getTracks()[0];
    if (!track) {
      return;
    }
    track.stop();
  }

  async capture() {
    if (this.hasImageCapture()) {
      try {
        const photo = await this.imageCapture.takePhoto();
        //const photo = await this.imageCapture.grabFrame();
        this.flashScreen();
        this.stopStream();
        console.log('Got photo', photo);
      } catch (e) {
        console.error('Unable to take photo!', e);
      }
    }
  }

  rotate() {
    this.stopStream();

    const track = this.stream && this.stream.getTracks()[0];
    if (!track) {
      return;
    }

    const constraints = track.getConstraints();
    if (constraints.facingMode === 'environment') {
      /*
      this.doCamera({
        video: { facingMode: 'user' }
      })
      */
    } else {
      /*
      this.doCamera({
        video: { facingMode: 'environment' }
      })
      */
    }

  }

  flashScreen() {
    console.log('Flashing screen');
  }

  handleShutterClick(_e: Event) {
    this.capture();
  }

  handleRotateClick(_e: Event) {
    this.rotate();
  }

  render() {
    return [
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
