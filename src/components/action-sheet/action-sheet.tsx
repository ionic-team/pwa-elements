import '@ionic/core';
import { Component } from '@stencil/core';

@Component({
  tag: 'ion-pwa-action-sheet',
  shadow: true
})
export class ActionSheetPWA {

  render() {
    return (
      <div>
        <ion-modal-controller></ion-modal-controller>
      </div>
    );
  }
}
