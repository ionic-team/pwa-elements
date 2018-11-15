import { newE2EPage } from '@stencil/core/testing';

describe('PWA Camera', () => {
  it('should render', async () => {
    const page = await newE2EPage({ html: '<ion-pwa-camera></ion-pwa-camera>' });

    const camera = await page.find('ion-pwa-camera');
    expect(camera).not.toBeNull();
  });
});
