import { h, Event, EventEmitter, Component, Listen, Element } from '@stencil/core';

@Component({
  tag: 'pwa-camera-modal-instance',
  styleUrl: 'camera-modal-instance.css',
  shadow: true
})
export class PWACameraModalInstance {
  @Element() el: HTMLPwaCameraModalInstanceElement;

  @Event() onPhoto: EventEmitter;

  async handlePhoto(photo: any) {
    this.onPhoto.emit(photo);
  }

  handleBackdropClick(e: MouseEvent) {
    if (e.target !== this.el) {
      this.onPhoto.emit(null);
    }
  }

  handleComponentClick(e: MouseEvent) {
    e.stopPropagation();
  }

  @Listen('keyup', { target: 'body' })
  handleBackdropKeyUp(e: KeyboardEvent) {
    if (e.key === "Escape") {
      this.onPhoto.emit(null);
    }
  }

  render() {
    return (
      <div class="wrapper" onClick={e => this.handleBackdropClick(e)}>
        <div class="content">
          <pwa-camera
            onClick={e => this.handleComponentClick(e)}
            onPhoto={(photo) => this.handlePhoto(photo)} />
        </div>
      </div>
    );
  }
}
