import { Component } from '@stencil/core';

@Component({
  tag: 'ion-camera-modal',
  styleUrl: 'camera-modal.scss',
  shadow: true
})
export class CameraModal {
  componentDidLoad() {
  }

  render() {
    return (
      <div>
        <ion-modal-controller></ion-modal-controller>
      </div>
    )
  }
}
