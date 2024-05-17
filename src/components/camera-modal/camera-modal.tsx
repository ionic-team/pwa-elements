import { h, Event, EventEmitter, Component, Method, Prop } from '@stencil/core';

@Component({
  tag: 'pwa-camera-modal',
  styleUrl: 'camera-modal.css',
  shadow: true
})
export class PWACameraModal {
  @Prop() facingMode: string = 'user';
  @Prop() hidePicker: boolean = false;

  @Event() onPhoto: EventEmitter;
  @Event() noDeviceError: EventEmitter;

  _modal: HTMLElement;

  @Method()
  async present() {
    const camera = document.createElement('pwa-camera-modal-instance');
    camera.facingMode = this.facingMode;
    camera.hidePicker = this.hidePicker;

    camera.addEventListener('onPhoto', async (e: any) => {
      if (!this._modal) {
        return;
      }
      const photo = e.detail;
      this.onPhoto.emit(photo);
    });

    camera.addEventListener('noDeviceError', async (e: any) => {
      this.noDeviceError.emit(e);
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
