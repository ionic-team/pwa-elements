import { newE2EPage } from '@stencil/core/testing';

describe('PWA Camera', () => {
  it('should render', async () => {
    const page = await newE2EPage({ html: '<pwa-camera></pwa-camera>' });

    const camera = await page.find('pwa-camera');
    expect(camera).not.toBeNull();

    const expectedElements = [
      '.camera-header',
      '.camera-header .item.close',
      '.camera-header .item.flash',
      '.camera-video',
      '.camera-footer',
      '.camera-footer .shutter',
      '.camera-footer .rotate',
    ];

    for (const selector of expectedElements) {
      const element = await page.find(`pwa-camera >>> ${selector}`);
      expect(await element.isVisible()).toBe(true);
    }
  });
});
