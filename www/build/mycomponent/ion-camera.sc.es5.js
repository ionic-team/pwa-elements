var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/*! Built with http://stenciljs.com */
mycomponent.loadBundle('ion-camera', ['exports'], function (exports) {
    var h = window.mycomponent.h;
    var Context = window.mycomponent.Context;
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
    var ImageCapture = window.ImageCapture;
    if (typeof ImageCapture === 'undefined') {
        ImageCapture = /** @class */ (function () {
            /**
             * TODO https://www.w3.org/TR/image-capture/#constructors
             *
             * @param {MediaStreamTrack} videoStreamTrack - A MediaStreamTrack of the 'video' kind
             */
            function class_1(videoStreamTrack) {
                var _this = this;
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
                this.videoElementPlaying = new Promise(function (resolve) {
                    _this.videoElement.addEventListener('playing', resolve);
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
            Object.defineProperty(class_1.prototype, "videoStreamTrack", {
                /**
                 * https://w3c.github.io/mediacapture-image/index.html#dom-imagecapture-videostreamtrack
                 * @return {MediaStreamTrack} The MediaStreamTrack passed into the constructor
                 */
                get: function () {
                    return this._videoStreamTrack;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Implements https://www.w3.org/TR/image-capture/#dom-imagecapture-getphotocapabilities
             * @return {Promise<PhotoCapabilities>} Fulfilled promise with
             * [PhotoCapabilities](https://www.w3.org/TR/image-capture/#idl-def-photocapabilities)
             * object on success, rejected promise on failure
             */
            class_1.prototype.getPhotoCapabilities = function () {
                return new Promise(function executorGPC(resolve, reject) {
                    // TODO see https://github.com/w3c/mediacapture-image/issues/97
                    var MediaSettingsRange = {
                        current: 0, min: 0, max: 0,
                    };
                    resolve({
                        exposureCompensation: MediaSettingsRange,
                        exposureMode: 'none',
                        fillLightMode: 'none',
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
            };
            /**
             * Implements https://www.w3.org/TR/image-capture/#dom-imagecapture-setoptions
             * @param {Object} photoSettings - Photo settings dictionary, https://www.w3.org/TR/image-capture/#idl-def-photosettings
             * @return {Promise<void>} Fulfilled promise on success, rejected promise on failure
             */
            class_1.prototype.setOptions = function (_photoSettings) {
                if (_photoSettings === void 0) { _photoSettings = {}; }
                return new Promise(function executorSO(_resolve, _reject) {
                    // TODO
                });
            };
            /**
             * TODO
             * Implements https://www.w3.org/TR/image-capture/#dom-imagecapture-takephoto
             * @return {Promise<Blob>} Fulfilled promise with [Blob](https://www.w3.org/TR/FileAPI/#blob)
             * argument on success; rejected promise on failure
             */
            class_1.prototype.takePhoto = function () {
                var self = this;
                return new Promise(function executorTP(resolve, reject) {
                    // `If the readyState of the MediaStreamTrack provided in the constructor is not live,
                    // return a promise rejected with a new DOMException whose name is "InvalidStateError".`
                    if (self._videoStreamTrack.readyState !== 'live') {
                        return reject(new DOMException('InvalidStateError'));
                    }
                    self.videoElementPlaying.then(function () {
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
            };
            /**
             * Implements https://www.w3.org/TR/image-capture/#dom-imagecapture-grabframe
             * @return {Promise<ImageBitmap>} Fulfilled promise with
             * [ImageBitmap](https://www.w3.org/TR/html51/webappapis.html#webappapis-images)
             * argument on success; rejected promise on failure
             */
            class_1.prototype.grabFrame = function () {
                var self = this;
                return new Promise(function executorGF(resolve, reject) {
                    // `If the readyState of the MediaStreamTrack provided in the constructor is not live,
                    // return a promise rejected with a new DOMException whose name is "InvalidStateError".`
                    if (self._videoStreamTrack.readyState !== 'live') {
                        return reject(new DOMException('InvalidStateError'));
                    }
                    self.videoElementPlaying.then(function () {
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
            };
            return class_1;
        }());
    }
    window.ImageCapture = ImageCapture;
    var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var Camera = /** @class */ (function () {
        function Camera() {
            this.showShutterOverlay = false;
            this.hasMultipleCameras = false;
            this.hasFlash = false;
        }
        Camera.prototype.componentDidLoad = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.isServer) {
                                return [2 /*return*/];
                            }
                            // Figure out how many cameras we have
                            return [4 /*yield*/, this.queryDevices()];
                        case 1:
                            // Figure out how many cameras we have
                            _a.sent();
                            // Initialize the camera
                            return [4 /*yield*/, this.initCamera()];
                        case 2:
                            // Initialize the camera
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        Camera.prototype.componentDidUnload = function () {
            this.stopStream();
        };
        /**
         * Query the list of connected devices and figure out how many video inputs we have.
         */
        Camera.prototype.queryDevices = function () {
            return __awaiter(this, void 0, void 0, function () {
                var devices;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, navigator.mediaDevices.enumerateDevices()];
                        case 1:
                            devices = _a.sent();
                            this.hasMultipleCameras = devices.filter(function (d) { return d.kind == 'videoinput'; }).length > 1;
                            return [2 /*return*/];
                    }
                });
            });
        };
        Camera.prototype.initCamera = function (constraints) {
            if (constraints === void 0) { constraints = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var stream, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, navigator.mediaDevices.getUserMedia(Object.assign({ video: true, audio: false }, constraints))];
                        case 1:
                            stream = _a.sent();
                            this.initStream(stream);
                            return [3 /*break*/, 3];
                        case 2:
                            e_1 = _a.sent();
                            console.error(e_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        Camera.prototype.hasImageCapture = function () {
            return 'ImageCapture' in window;
        };
        Camera.prototype.initStream = function (stream) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
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
                    return [2 /*return*/];
                });
            });
        };
        Camera.prototype.initPhotoCapabilities = function (imageCapture) {
            return __awaiter(this, void 0, void 0, function () {
                var c;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, imageCapture.getPhotoCapabilities()];
                        case 1:
                            c = _a.sent();
                            if (c.fillLightMode.length) {
                                this.flashModes = c.fillLightMode.map(function (m) { return m; });
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        Camera.prototype.stopStream = function () {
            this.stream && this.stream.getTracks().forEach(function (track) { return track.stop(); });
        };
        Camera.prototype.capture = function () {
            return __awaiter(this, void 0, void 0, function () {
                var photo, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.hasImageCapture()) return [3 /*break*/, 5];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, this.imageCapture.takePhoto()];
                        case 2:
                            photo = _a.sent();
                            return [4 /*yield*/, this.flashScreen()];
                        case 3:
                            _a.sent();
                            this.promptAccept(photo);
                            return [3 /*break*/, 5];
                        case 4:
                            e_2 = _a.sent();
                            console.error('Unable to take photo!', e_2);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        Camera.prototype.promptAccept = function (photo) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.photo = photo;
                    this.photoSrc = URL.createObjectURL(photo);
                    return [2 /*return*/];
                });
            });
        };
        Camera.prototype.rotate = function () {
            this.stopStream();
            var track = this.stream && this.stream.getTracks()[0];
            if (!track) {
                return;
            }
            var constraints = track.getConstraints();
            if (constraints.facingMode === 'environment') {
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
        };
        Camera.prototype.cycleFlash = function () {
        };
        Camera.prototype.flashScreen = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, _reject) {
                            _this.showShutterOverlay = true;
                            setTimeout(function () {
                                _this.showShutterOverlay = false;
                                resolve();
                            }, 100);
                        })];
                });
            });
        };
        Camera.prototype.handleShutterClick = function (_e) {
            console.log();
            this.capture();
        };
        Camera.prototype.handleRotateClick = function (_e) {
            this.rotate();
        };
        Camera.prototype.handleClose = function (_e) {
            this.onPhoto.emit(null);
        };
        Camera.prototype.handleFlashClick = function (_e) {
            this.cycleFlash();
        };
        Camera.prototype.handleCancelPhoto = function (_e) {
            this.photo = null;
        };
        Camera.prototype.handleAcceptPhoto = function (_e) {
            this.onPhoto.emit(this.photo);
        };
        Camera.prototype.render = function () {
            var _this = this;
            return (h("div", { class: "camera-wrapper" }, h("div", { class: "camera-header" }, h("section", { class: "items" }, h("div", { class: "item close", onClick: function (e) { return _this.handleClose(e); } }), h("div", { class: "item flash", onClick: function (e) { return _this.handleFlashClick(e); } }))), this.photo && (h("div", { class: "accept" }, h("div", { class: "accept-image", style: { backgroundImage: "url(" + this.photoSrc + ")" } }))), h("div", { class: "camera-video", style: { display: this.photo ? 'none' : '' } }, this.showShutterOverlay && (h("div", { class: "shutter-overlay" })), h("video", { ref: function (el) { return _this.videoElement = el; }, autoplay: true })), h("div", { class: "camera-footer" }, !this.photo ? ([
                h("div", { class: "shutter", onClick: function (e) { return _this.handleShutterClick(e); } }, h("div", { class: "shutter-button" })),
                h("div", { class: "rotate", onClick: function (e) { return _this.handleRotateClick(e); } }),
                {}
            ]) : (h("section", { class: "items" }, h("div", { class: "item", onClick: function (e) { return _this.handleCancelPhoto(e); } }, "Cancel"), h("div", { class: "item", onClick: function (e) { return _this.handleAcceptPhoto(e); } }, "Use"))))));
        };
        Object.defineProperty(Camera, "is", {
            get: function () { return "ion-camera"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera, "encapsulation", {
            get: function () { return "shadow"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera, "properties", {
            get: function () { return { "isServer": { "context": "isServer" }, "photo": { "state": true }, "photoSrc": { "state": true }, "showShutterOverlay": { "state": true } }; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera, "events", {
            get: function () { return [{ "name": "onPhoto", "method": "onPhoto", "bubbles": true, "cancelable": true, "composed": true }]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera, "style", {
            get: function () { return "\@charset \"UTF-8\";\n[data-ion-camera-host] {\n  font-family: -apple-system, BlinkMacSystemFont, “Segoe UI”, “Roboto”, “Droid Sans”, “Helvetica Neue”, sans-serif;\n  display: block;\n  width: 100%;\n  height: 100%;\n}\n\n[data-ion-camera-host]   .items[data-ion-camera] {\n  box-sizing: border-box;\n  display: flex;\n  width: 100%;\n  height: 100%;\n  align-items: center;\n  justify-content: center;\n}\n\n[data-ion-camera-host]   .items[data-ion-camera]   .item[data-ion-camera] {\n  flex: 1;\n  text-align: center;\n}\n\n[data-ion-camera-host]   .camera-wrapper[data-ion-camera] {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n}\n\n[data-ion-camera-host]   .camera-header[data-ion-camera] {\n  color: white;\n  background-color: black;\n  height: 4em;\n}\n\n[data-ion-camera-host]   .camera-header[data-ion-camera]   .items[data-ion-camera] {\n  padding: 0 1.5em 0 1.5em;\n}\n\n[data-ion-camera-host]   .camera-header[data-ion-camera]   .items[data-ion-camera]   .item[data-ion-camera]:first-child {\n  background-position-x: 0;\n}\n\n[data-ion-camera-host]   .camera-header[data-ion-camera]   .items[data-ion-camera]   .item[data-ion-camera]:last-child {\n  background-position-x: 100%;\n}\n\n[data-ion-camera-host]   .camera-footer[data-ion-camera] {\n  position: relative;\n  color: white;\n  background-color: black;\n  height: 9em;\n}\n\n[data-ion-camera-host]   .camera-video[data-ion-camera] {\n  position: relative;\n  flex: 1;\n}\n\n[data-ion-camera-host]   video[data-ion-camera] {\n  width: 100%;\n  height: 100%;\n  z-index: -1;\n  object-fit: cover;\n}\n\n[data-ion-camera-host]   .shutter[data-ion-camera] {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  width: 6em;\n  height: 6em;\n  margin-top: -3em;\n  margin-left: -3em;\n  border-radius: 100%;\n  background-color: #c6cdd8;\n  padding: 12px;\n  box-sizing: border-box;\n}\n\n[data-ion-camera-host]   .shutter[data-ion-camera]:active   .shutter-button[data-ion-camera] {\n  background-color: #9da9bb;\n}\n\n[data-ion-camera-host]   .shutter-button[data-ion-camera] {\n  background-color: white;\n  border-radius: 100%;\n  width: 100%;\n  height: 100%;\n}\n\n[data-ion-camera-host]   .rotate[data-ion-camera] {\n  position: absolute;\n  right: 1.5em;\n  top: 0;\n  height: 100%;\n  width: 3em;\n  color: white;\n  background: url(\"/assets/reverse-camera.svg\") no-repeat transparent;\n  background-size: 3em;\n  background-position: center;\n}\n\n[data-ion-camera-host]   .shutter-overlay[data-ion-camera] {\n  z-index: 5;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background-color: black;\n}\n\n[data-ion-camera-host]   .accept[data-ion-camera] {\n  background-color: black;\n  flex: 1;\n}\n\n[data-ion-camera-host]   .accept[data-ion-camera]   .accept-image[data-ion-camera] {\n  width: 100%;\n  height: 100%;\n  background-position: center center;\n  background-size: cover;\n  background-repeat: no-repeat;\n}\n\n[data-ion-camera-host]   .close[data-ion-camera] {\n  width: 1.5em;\n  height: 1.5em;\n  background: url(\"/assets/exit.svg\") no-repeat transparent;\n  background-size: 1.5em;\n  background-position: center;\n}\n\n[data-ion-camera-host]   .flash[data-ion-camera] {\n  width: 1.5em;\n  height: 1.5em;\n  background: url(\"/assets/flash-on.svg\") no-repeat transparent;\n  background-size: 1.5em;\n  background-position: center;\n}"; },
            enumerable: true,
            configurable: true
        });
        return Camera;
    }());
    exports.IonCamera = Camera;
    Object.defineProperty(exports, '__esModule', { value: true });
});
