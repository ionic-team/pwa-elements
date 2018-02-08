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


importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.0.0-alpha.3/workbox-sw.js");









/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "assets/confirm.svg",
    "revision": "6da8dfa1a282021f17a6311bbbe8f2d1"
  },
  {
    "url": "assets/exit.svg",
    "revision": "2c71296bef3912ef70371b6c91a9c70d"
  },
  {
    "url": "assets/flash-auto.svg",
    "revision": "9e07f17bafb609e80a6370469aa8b9bb"
  },
  {
    "url": "assets/flash-off.svg",
    "revision": "112baea845987d1f9f05362b57add3a4"
  },
  {
    "url": "assets/flash-on.svg",
    "revision": "34d6d8e774891afbef3b1caf54afed3c"
  },
  {
    "url": "assets/retake.svg",
    "revision": "6608cd9f2eab45204a313d94359050b1"
  },
  {
    "url": "assets/reverse-camera.svg",
    "revision": "26b8a79df441ad384b954261df97808c"
  },
  {
    "url": "build/ionicpwaelements.js",
    "revision": "020f1bc0093cf885e63c3835c870a3cb"
  },
  {
    "url": "build/ionicpwaelements/5hcbvy8f.es5.js",
    "revision": "649bb56d53bf08188617e208e36075b9"
  },
  {
    "url": "build/ionicpwaelements/5hcbvy8f.js",
    "revision": "df7cac847a1c06a22b80ddb6f68c8ef5"
  },
  {
    "url": "build/ionicpwaelements/5hcbvy8f.sc.es5.js",
    "revision": "efd83c33c34031dec470c65c9333ebf8"
  },
  {
    "url": "build/ionicpwaelements/5hcbvy8f.sc.js",
    "revision": "e6cfeffb5558def88c6609622df853d9"
  },
  {
    "url": "build/ionicpwaelements/ionicpwaelements.global.js",
    "revision": "f9d77486bff57801a513e7fb493ce25b"
  },
  {
    "url": "build/ionicpwaelements/ionicpwaelements.ma4keaqv.js",
    "revision": "da3e840759c4d484d9a0f17d85fb9cca"
  },
  {
    "url": "build/ionicpwaelements/ionicpwaelements.registry.json",
    "revision": "70dba36e1707b5ef7b527d1020d4e5b8"
  },
  {
    "url": "build/ionicpwaelements/ionicpwaelements.tqlpajzn.js",
    "revision": "35ec45c401b7e3420e3ea8acec55d0ad"
  },
  {
    "url": "build/ionicpwaelements/vafwjp34.es5.js",
    "revision": "13f1fe12d63b5ae189dfcb79181aa000"
  },
  {
    "url": "build/ionicpwaelements/vafwjp34.js",
    "revision": "4c02bc29ec6e2e61e242487ef778faec"
  },
  {
    "url": "build/ionicpwaelements/yagqibuq.es5.js",
    "revision": "9bae9ddc308807876a9aa0a0a1479875"
  },
  {
    "url": "build/ionicpwaelements/yagqibuq.js",
    "revision": "c6bc26d4ae995e454b7464ae0042e927"
  },
  {
    "url": "build/ionicpwaelements/yagqibuq.sc.es5.js",
    "revision": "9bae9ddc308807876a9aa0a0a1479875"
  },
  {
    "url": "build/ionicpwaelements/yagqibuq.sc.js",
    "revision": "c6bc26d4ae995e454b7464ae0042e927"
  },
  {
    "url": "build/ionicpwaelements/zodsuboy.es5.js",
    "revision": "1963c5c2d2668d221b122c32de843cf3"
  },
  {
    "url": "build/ionicpwaelements/zodsuboy.js",
    "revision": "bdcb21e335ca4f2f617b3d67ca44545c"
  },
  {
    "url": "index.html",
    "revision": "4cf1651eea6066b6d5263017b7085c4f"
  }
].concat(self.__precacheManifest || []);

if (Array.isArray(self.__precacheManifest)) {
  workbox.precaching.suppressWarnings();
  workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
}
