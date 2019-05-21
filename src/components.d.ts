/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface PwaCamera {
    'facingMode': string;
    'onPhoto': (e: any) => void;
  }
  interface PwaCameraModal {
    'dismiss': () => Promise<void>;
    'present': () => Promise<void>;
  }
  interface PwaCameraModalInstance {}
  interface PwaToast {
    'duration': number;
    'message': string;
  }
}

declare namespace LocalJSX {
  interface PwaCamera extends JSXBase.HTMLAttributes {
    'facingMode'?: string;
    'onPhoto'?: (e: any) => void;
  }
  interface PwaCameraModal extends JSXBase.HTMLAttributes {
    'onOnPhoto'?: (event: CustomEvent<any>) => void;
  }
  interface PwaCameraModalInstance extends JSXBase.HTMLAttributes {
    'onOnPhoto'?: (event: CustomEvent<any>) => void;
  }
  interface PwaToast extends JSXBase.HTMLAttributes {
    'duration'?: number;
    'message'?: string;
  }

  interface IntrinsicElements {
    'pwa-camera': PwaCamera;
    'pwa-camera-modal': PwaCameraModal;
    'pwa-camera-modal-instance': PwaCameraModalInstance;
    'pwa-toast': PwaToast;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements extends LocalJSX.IntrinsicElements {}
  }
}


declare global {



  interface HTMLPwaCameraElement extends Components.PwaCamera, HTMLStencilElement {}
  var HTMLPwaCameraElement: {
    prototype: HTMLPwaCameraElement;
    new (): HTMLPwaCameraElement;
  };

  interface HTMLPwaCameraModalElement extends Components.PwaCameraModal, HTMLStencilElement {}
  var HTMLPwaCameraModalElement: {
    prototype: HTMLPwaCameraModalElement;
    new (): HTMLPwaCameraModalElement;
  };

  interface HTMLPwaCameraModalInstanceElement extends Components.PwaCameraModalInstance, HTMLStencilElement {}
  var HTMLPwaCameraModalInstanceElement: {
    prototype: HTMLPwaCameraModalInstanceElement;
    new (): HTMLPwaCameraModalInstanceElement;
  };

  interface HTMLPwaToastElement extends Components.PwaToast, HTMLStencilElement {}
  var HTMLPwaToastElement: {
    prototype: HTMLPwaToastElement;
    new (): HTMLPwaToastElement;
  };

  interface HTMLElementTagNameMap {
    'pwa-camera': HTMLPwaCameraElement;
    'pwa-camera-modal': HTMLPwaCameraModalElement;
    'pwa-camera-modal-instance': HTMLPwaCameraModalInstanceElement;
    'pwa-toast': HTMLPwaToastElement;
  }

  interface ElementTagNameMap extends HTMLElementTagNameMap {}
}

