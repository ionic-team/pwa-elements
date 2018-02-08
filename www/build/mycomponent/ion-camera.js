/*! Built with http://stenciljs.com */
const { h, Context } = window.mycomponent;

/**
 * MediaStream ImageCapture polyfill
 *
 * @license
 * Copyright 2018 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let ImageCapture = window.ImageCapture;
if (typeof ImageCapture === 'undefined') {
    ImageCapture = class {
        /**
         * TODO https://www.w3.org/TR/image-capture/#constructors
         *
         * @param {MediaStreamTrack} videoStreamTrack - A MediaStreamTrack of the 'video' kind
         */
        constructor(videoStreamTrack) {
            if (videoStreamTrack.kind !== 'video')
                throw new DOMException('NotSupportedError');
            this._videoStreamTrack = videoStreamTrack;
            if (!('readyState' in this._videoStreamTrack)) {
                // Polyfill for Firefox
                this._videoStreamTrack.readyState = 'live';
            }
            // MediaStream constructor not available until Chrome 55 - https://www.chromestatus.com/feature/5912172546752512
            this._previewStream = new MediaStream([videoStreamTrack]);
            this.videoElement = document.createElement('video');
            this.videoElementPlaying = new Promise(resolve => {
                this.videoElement.addEventListener('playing', resolve);
            });
            if (HTMLMediaElement) {
                this.videoElement.srcObject = this._previewStream; // Safari 11 doesn't allow use of createObjectURL for MediaStream
            }
            else {
                this.videoElement.src = URL.createObjectURL(this._previewStream);
            }
            this.videoElement.muted = true;
            this.videoElement.setAttribute('playsinline', ''); // Required by Safari on iOS 11. See https://webkit.org/blog/6784
            this.videoElement.play();
            this.canvasElement = document.createElement('canvas');
            // TODO Firefox has https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
            this.canvas2dContext = this.canvasElement.getContext('2d');
        }
        /**
         * https://w3c.github.io/mediacapture-image/index.html#dom-imagecapture-videostreamtrack
         * @return {MediaStreamTrack} The MediaStreamTrack passed into the constructor
         */
        get videoStreamTrack() {
            return this._videoStreamTrack;
        }
        /**
         * Implements https://www.w3.org/TR/image-capture/#dom-imagecapture-getphotocapabilities
         * @return {Promise<PhotoCapabilities>} Fulfilled promise with
         * [PhotoCapabilities](https://www.w3.org/TR/image-capture/#idl-def-photocapabilities)
         * object on success, rejected promise on failure
         */
        getPhotoCapabilities() {
            return new Promise(function executorGPC(resolve, reject) {
                // TODO see https://github.com/w3c/mediacapture-image/issues/97
                const MediaSettingsRange = {
                    current: 0, min: 0, max: 0,
                };
                resolve({
                    exposureCompensation: MediaSettingsRange,
                    exposureMode: 'none',
                    fillLightMode: ['none'],
                    focusMode: 'none',
                    imageHeight: MediaSettingsRange,
                    imageWidth: MediaSettingsRange,
                    iso: MediaSettingsRange,
                    redEyeReduction: false,
                    whiteBalanceMode: 'none',
                    zoom: MediaSettingsRange,
                });
                reject(new DOMException('OperationError'));
            });
        }
        /**
         * Implements https://www.w3.org/TR/image-capture/#dom-imagecapture-setoptions
         * @param {Object} photoSettings - Photo settings dictionary, https://www.w3.org/TR/image-capture/#idl-def-photosettings
         * @return {Promise<void>} Fulfilled promise on success, rejected promise on failure
         */
        setOptions(_photoSettings = {}) {
            return new Promise(function executorSO(_resolve, _reject) {
                // TODO
            });
        }
        /**
         * TODO
         * Implements https://www.w3.org/TR/image-capture/#dom-imagecapture-takephoto
         * @return {Promise<Blob>} Fulfilled promise with [Blob](https://www.w3.org/TR/FileAPI/#blob)
         * argument on success; rejected promise on failure
         */
        takePhoto() {
            const self = this;
            return new Promise(function executorTP(resolve, reject) {
                // `If the readyState of the MediaStreamTrack provided in the constructor is not live,
                // return a promise rejected with a new DOMException whose name is "InvalidStateError".`
                if (self._videoStreamTrack.readyState !== 'live') {
                    return reject(new DOMException('InvalidStateError'));
                }
                self.videoElementPlaying.then(() => {
                    try {
                        self.canvasElement.width = self.videoElement.videoWidth;
                        self.canvasElement.height = self.videoElement.videoHeight;
                        self.canvas2dContext.drawImage(self.videoElement, 0, 0);
                        self.canvasElement.toBlob(resolve);
                    }
                    catch (error) {
                        reject(new DOMException('UnknownError'));
                    }
                });
            });
        }
        /**
         * Implements https://www.w3.org/TR/image-capture/#dom-imagecapture-grabframe
         * @return {Promise<ImageBitmap>} Fulfilled promise with
         * [ImageBitmap](https://www.w3.org/TR/html51/webappapis.html#webappapis-images)
         * argument on success; rejected promise on failure
         */
        grabFrame() {
            const self = this;
            return new Promise(function executorGF(resolve, reject) {
                // `If the readyState of the MediaStreamTrack provided in the constructor is not live,
                // return a promise rejected with a new DOMException whose name is "InvalidStateError".`
                if (self._videoStreamTrack.readyState !== 'live') {
                    return reject(new DOMException('InvalidStateError'));
                }
                self.videoElementPlaying.then(() => {
                    try {
                        self.canvasElement.width = self.videoElement.videoWidth;
                        self.canvasElement.height = self.videoElement.videoHeight;
                        self.canvas2dContext.drawImage(self.videoElement, 0, 0);
                        // TODO polyfill https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmapFactories/createImageBitmap for IE
                        resolve(window.createImageBitmap(self.canvasElement));
                    }
                    catch (error) {
                        reject(new DOMException('UnknownError'));
                    }
                });
            });
        }
    };
}
window.ImageCapture = ImageCapture;

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Camera {
    constructor() {
        this.facingMode = 'user';
        this.showShutterOverlay = false;
        this.flashIndex = 0;
        // Whether the device has multiple cameras (front/back)
        this.hasMultipleCameras = false;
        // Whether the device has flash support
        this.hasFlash = false;
        // Flash modes for camera
        this.flashModes = [];
    }
    componentDidLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isServer) {
                return;
            }
            this.defaultConstraints = {
                video: {
                    facingMode: this.facingMode
                }
            };
            // Figure out how many cameras we have
            yield this.queryDevices();
            // Initialize the camera
            yield this.initCamera();
        });
    }
    componentDidUnload() {
        this.stopStream();
        this.photoSrc && URL.revokeObjectURL(this.photoSrc);
    }
    hasImageCapture() {
        return 'ImageCapture' in window;
    }
    /**
     * Query the list of connected devices and figure out how many video inputs we have.
     */
    queryDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            const devices = yield navigator.mediaDevices.enumerateDevices();
            this.hasMultipleCameras = devices.filter(d => d.kind == 'videoinput').length > 1;
        });
    }
    initCamera(constraints) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Initializing', constraints);
            if (!constraints) {
                constraints = this.defaultConstraints;
            }
            try {
                const stream = yield navigator.mediaDevices.getUserMedia(Object.assign({ video: true, audio: false }, constraints));
                this.initStream(stream);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    initStream(stream) {
        return __awaiter(this, void 0, void 0, function* () {
            this.stream = stream;
            this.videoElement.srcObject = stream;
            if (this.hasImageCapture()) {
                this.imageCapture = new window.ImageCapture(stream.getVideoTracks()[0]);
                // console.log(stream.getTracks()[0].getCapabilities());
                this.initPhotoCapabilities(this.imageCapture);
            }
            else {
                // TODO: DO SOMETHING ELSE HERE
            }
        });
    }
    initPhotoCapabilities(imageCapture) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = yield imageCapture.getPhotoCapabilities();
            if (c.fillLightMode.length) {
                this.flashModes = c.fillLightMode.map(m => m);
            }
        });
    }
    stopStream() {
        this.stream && this.stream.getTracks().forEach(track => track.stop());
    }
    capture() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.hasImageCapture()) {
                try {
                    const photo = yield this.imageCapture.takePhoto();
                    yield this.flashScreen();
                    this.promptAccept(photo);
                }
                catch (e) {
                    console.error('Unable to take photo!', e);
                }
            }
        });
    }
    promptAccept(photo) {
        return __awaiter(this, void 0, void 0, function* () {
            this.photo = photo;
            this.photoSrc = URL.createObjectURL(photo);
        });
    }
    rotate() {
        this.stopStream();
        const track = this.stream && this.stream.getTracks()[0];
        if (!track) {
            return;
        }
        const c = track.getConstraints();
        if (c.facingMode === 'environment') {
            this.initCamera({
                video: {
                    facingMode: 'user'
                }
            });
        }
        else {
            this.initCamera({
                video: {
                    facingMode: 'environment'
                }
            });
        }
    }
    setFlashMode(mode) {
        console.log('New flash mode: ', mode);
    }
    cycleFlash() {
        this.flashIndex = this.flashIndex + 1 % this.flashModes.length;
        this.setFlashMode(this.flashModes[this.flashIndex]);
    }
    flashScreen() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, _reject) => {
                this.showShutterOverlay = true;
                setTimeout(() => {
                    this.showShutterOverlay = false;
                    resolve();
                }, 100);
            });
        });
    }
    handleShutterClick(_e) {
        console.log();
        this.capture();
    }
    handleRotateClick(_e) {
        this.rotate();
    }
    handleClose(_e) {
        this.onPhoto.emit(null);
    }
    handleFlashClick(_e) {
        this.cycleFlash();
    }
    handleCancelPhoto(_e) {
        this.photo = null;
    }
    handleAcceptPhoto(_e) {
        this.onPhoto.emit(this.photo);
    }
    render() {
        return (h("div", { class: "camera-wrapper" },
            h("div", { class: "camera-header" },
                h("section", { class: "items" },
                    h("div", { class: "item close", onClick: e => this.handleClose(e) }),
                    h("div", { class: "item flash", onClick: e => this.handleFlashClick(e) }))),
            this.photo && (h("div", { class: "accept" },
                h("div", { class: "accept-image", style: { backgroundImage: `url(${this.photoSrc})` } }))),
            h("div", { class: "camera-video", style: { display: this.photo ? 'none' : '' } },
                this.showShutterOverlay && (h("div", { class: "shutter-overlay" })),
                this.hasImageCapture() ? (h("video", { ref: (el) => this.videoElement = el, autoplay: true, playsinline: true })) : (h("canvas", { ref: (el) => this.canvasElement = el, width: "100%", height: "100%" }))),
            h("div", { class: "camera-footer" }, !this.photo ? ([
                h("div", { class: "shutter", onClick: (e) => this.handleShutterClick(e) },
                    h("div", { class: "shutter-button" })),
                h("div", { class: "rotate", onClick: (e) => this.handleRotateClick(e) }),
                {}
            ]) : (h("section", { class: "items" },
                h("div", { class: "item accept-cancel", onClick: e => this.handleCancelPhoto(e) }),
                h("div", { class: "item accept-use", onClick: e => this.handleAcceptPhoto(e) }))))));
    }
    static get is() { return "ion-camera"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return { "facingMode": { "type": String, "attr": "facing-mode" }, "flashIndex": { "state": true }, "isServer": { "context": "isServer" }, "photo": { "state": true }, "photoSrc": { "state": true }, "showShutterOverlay": { "state": true } }; }
    static get events() { return [{ "name": "onPhoto", "method": "onPhoto", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "\@charset \"UTF-8\";\n:host {\n  font-family: -apple-system, BlinkMacSystemFont, “Segoe UI”, “Roboto”, “Droid Sans”, “Helvetica Neue”, sans-serif;\n  display: block;\n  width: 100%;\n  height: 100%;\n}\n\n:host .items {\n  box-sizing: border-box;\n  display: flex;\n  width: 100%;\n  height: 100%;\n  align-items: center;\n  justify-content: center;\n}\n\n:host .items .item {\n  flex: 1;\n  text-align: center;\n}\n\n:host .items .item:first-child {\n  background-position-x: 0;\n}\n\n:host .items .item:last-child {\n  background-position-x: 100%;\n}\n\n:host .camera-wrapper {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n}\n\n:host .camera-header {\n  color: white;\n  background-color: black;\n  height: 4em;\n}\n\n:host .camera-header .items {\n  padding: 1.5em;\n}\n\n:host .camera-footer {\n  position: relative;\n  color: white;\n  background-color: black;\n  height: 9em;\n}\n\n:host .camera-footer .items {\n  padding: 2em;\n}\n\n:host .camera-video {\n  position: relative;\n  flex: 1;\n  overflow: hidden;\n  background-color: black;\n}\n\n:host video {\n  width: 100%;\n  height: 100%;\n  max-height: 100%;\n  min-height: 100%;\n  z-index: -1;\n  object-fit: cover;\n  background-color: black;\n}\n\n:host .shutter {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  width: 6em;\n  height: 6em;\n  margin-top: -3em;\n  margin-left: -3em;\n  border-radius: 100%;\n  background-color: #c6cdd8;\n  padding: 12px;\n  box-sizing: border-box;\n}\n\n:host .shutter:active .shutter-button {\n  background-color: #9da9bb;\n}\n\n:host .shutter-button {\n  background-color: white;\n  border-radius: 100%;\n  width: 100%;\n  height: 100%;\n}\n\n:host .rotate {\n  position: absolute;\n  right: 2em;\n  top: 0;\n  height: 100%;\n  width: 2.5em;\n  color: white;\n  background: url(\"/assets/reverse-camera.svg\") no-repeat transparent;\n  background-size: 2.5em;\n  background-position: center;\n}\n\n:host .shutter-overlay {\n  z-index: 5;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background-color: black;\n}\n\n:host .accept {\n  background-color: black;\n  flex: 1;\n}\n\n:host .accept .accept-image {\n  width: 100%;\n  height: 100%;\n  background-position: center center;\n  background-size: cover;\n  background-repeat: no-repeat;\n}\n\n:host .close {\n  width: 1.5em;\n  height: 1.5em;\n  background: url(\"/assets/exit.svg\") no-repeat transparent;\n  background-size: 1.5em;\n  background-position: center;\n}\n\n:host .flash {\n  width: 1.5em;\n  height: 1.5em;\n  background: url(\"/assets/flash-on.svg\") no-repeat transparent;\n  background-size: 1.5em;\n  background-position: center;\n}\n\n:host .accept-use {\n  width: 2.5em;\n  height: 2.5em;\n  background: url(\"/assets/confirm.svg\") no-repeat transparent;\n  background-size: 2.5em;\n  background-position: center;\n}\n\n:host .accept-cancel {\n  width: 2.5em;\n  height: 2.5em;\n  background: url(\"/assets/retake.svg\") no-repeat transparent;\n  background-size: 2.5em;\n  background-position: center;\n}"; }
}

export { Camera as IonCamera };
