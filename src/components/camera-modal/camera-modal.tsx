import { Event, EventEmitter, Component, Method } from '@stencil/core';

@Component({
  tag: 'pwa-camera-modal',
  styleUrl: 'camera-modal.css',
  shadow: true
})
export class PWACameraModal {
  @Event() onPhoto: EventEmitter;

  _modal: HTMLElement;

  @Method()
  async present() {
    const camera = document.createElement('pwa-camera-modal-instance');

    camera.addEventListener('onPhoto', async (e: any) => {
      if (!this._modal) {
        return;
      }
      const photo = e.detail;
      this.onPhoto.emit(photo);
    });

    document.body.append(camera);

    this._modal = camera;
  }

  @Method()
  async dismiss() {
    if (!this._modal) { return; }
    this._modal && this._modal.parentNode.removeChild(this._modal);
    this._modal = null;
  }

  render() {
    return (<div></div>);
  }
}
