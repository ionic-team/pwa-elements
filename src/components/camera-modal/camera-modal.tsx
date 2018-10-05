import { Event, EventEmitter, Component, Method } from '@stencil/core';

import { Modal } from '@ionic/core/dist/esm/es2017';

@Component({
  tag: 'ion-pwa-camera-modal',
  shadow: true
})
export class CameraModalPWA {
  @Event() onPhoto: EventEmitter;

  _modal: Modal;

  @Method()
  async present() {
    var modalController: any = document.querySelector('ion-modal-controller');

    if (!modalController) {
      modalController = document.createElement('ion-modal-controller');
      document.body.appendChild(modalController)
    }

    await modalController.componentOnReady();

    const camera = document.createElement('ion-pwa-camera');

    camera.addEventListener('onPhoto', async (e: any) => {
      const photo = e.detail;
      this.onPhoto.emit(photo);
    })

    const modal = await modalController.create({
      component: camera
    });

    this._modal = modal;

    modal.present();
  }

  @Method()
  async dismiss() {
    this._modal && this._modal.dismiss();
  }

  render() {
    return (<div></div>);
  }
}
