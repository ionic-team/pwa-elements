/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/YYPcyY
 */

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.0.0-alpha.6/workbox-sw.js"
);

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "build/ionicpwaelements.js",
    "revision": "ed6ebcc3e3f54d69b71eee866cd9be27"
  },
  {
    "url": "build/ionicpwaelements/4u5blsul.es5.js",
    "revision": "01866829456f9c07067290f1907054f9"
  },
  {
    "url": "build/ionicpwaelements/4u5blsul.js",
    "revision": "a586afa5afd5c4f89b6ea9351001dab7"
  },
  {
    "url": "build/ionicpwaelements/4u5blsul.sc.es5.js",
    "revision": "01866829456f9c07067290f1907054f9"
  },
  {
    "url": "build/ionicpwaelements/4u5blsul.sc.js",
    "revision": "a586afa5afd5c4f89b6ea9351001dab7"
  },
  {
    "url": "build/ionicpwaelements/icons/confirm.svg",
    "revision": "6da8dfa1a282021f17a6311bbbe8f2d1"
  },
  {
    "url": "build/ionicpwaelements/icons/exit.svg",
    "revision": "2c71296bef3912ef70371b6c91a9c70d"
  },
  {
    "url": "build/ionicpwaelements/icons/flash-auto.svg",
    "revision": "9e07f17bafb609e80a6370469aa8b9bb"
  },
  {
    "url": "build/ionicpwaelements/icons/flash-off.svg",
    "revision": "112baea845987d1f9f05362b57add3a4"
  },
  {
    "url": "build/ionicpwaelements/icons/flash-on.svg",
    "revision": "34d6d8e774891afbef3b1caf54afed3c"
  },
  {
    "url": "build/ionicpwaelements/icons/retake.svg",
    "revision": "6608cd9f2eab45204a313d94359050b1"
  },
  {
    "url": "build/ionicpwaelements/icons/reverse-camera.svg",
    "revision": "26b8a79df441ad384b954261df97808c"
  },
  {
    "url": "build/ionicpwaelements/ionicpwaelements.948q8ii9.js",
    "revision": "1a78c853cfd6d581215fd7276e1a6d32"
  },
  {
    "url": "build/ionicpwaelements/ionicpwaelements.global.js",
    "revision": "f9d77486bff57801a513e7fb493ce25b"
  },
  {
    "url": "build/ionicpwaelements/ionicpwaelements.oadyae3g.js",
    "revision": "02c97637ea6fe9c9bd20f28b87c777e0"
  },
  {
    "url": "build/ionicpwaelements/ionicpwaelements.registry.json",
    "revision": "09417766c75c0fa72c865213a8d28298"
  },
  {
    "url": "build/ionicpwaelements/m8akctuw.es5.js",
    "revision": "1eb25150f5d441a7e3fe6b2cbbe901e5"
  },
  {
    "url": "build/ionicpwaelements/m8akctuw.js",
    "revision": "967e4d7e9ae3cd53ff01bf02cb9bab33"
  },
  {
    "url": "build/ionicpwaelements/z6gmr6xu.es5.js",
    "revision": "a1c036e6eafcb4c50687b511b5dfc2b6"
  },
  {
    "url": "build/ionicpwaelements/z6gmr6xu.js",
    "revision": "91ce9b56aefd9179c8fb41289bca844f"
  },
  {
    "url": "build/ionicpwaelements/z6gmr6xu.sc.es5.js",
    "revision": "4d5c4ed30680c8eba8c4215080ec748a"
  },
  {
    "url": "build/ionicpwaelements/z6gmr6xu.sc.js",
    "revision": "9c54359e735ba1859ae3a3ade8adc9ff"
  },
  {
    "url": "index.html",
    "revision": "f1e21ba3a32caed91f9685639a4c7109"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
