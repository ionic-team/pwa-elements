import { flush, render } from '@stencil/core/testing';
import { CameraModal } from './camera-modal';

describe('camera-modal', () => {
  it('should build', () => {
    expect(new CameraModal()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;
    beforeEach(async () => {
      element = await render({
        components: [CameraModal],
        html: '<ion-camera-modal></ion-camera-modal>'
      });
    });
  });
});
