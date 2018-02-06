import { flush, render } from '@stencil/core/testing';
import { Camera } from './camera';

describe('camera', () => {
  it('should build', () => {
    expect(new Camera()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;
    beforeEach(async () => {
      element = await render({
        components: [Camera],
        html: '<ion-camera></ion-camera>'
      });
    });
  });
});
