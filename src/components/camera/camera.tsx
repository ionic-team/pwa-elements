import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'ion-camera',
  styleUrl: 'camera.scss',
  shadow: true
})
export class Camera {
  @Prop({ context: 'isServer' }) private isServer: boolean;

  stream: MediaStream;
  mediaRecorder: any;
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

      this.stream = stream;
      this.videoElement.srcObject = stream;
    } catch(e) {
      console.error(e);
    }
  }
  render() {
    return [
      <video ref={(el: HTMLVideoElement) => this.videoElement = el} autoplay></video>,
      <div class="shutter">
        <div class="shutter-ring">
          <div class="shutter-button"></div>
        </div>
      </div>
    ];
  }
}
