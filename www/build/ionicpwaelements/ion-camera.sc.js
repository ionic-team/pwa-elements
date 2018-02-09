/*! Built with http://stenciljs.com */
const { h, Context } = window.ionicpwaelements;

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
            console.log('CAMERA PUBLIC PATH', this.publicPath);
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
        let c = track.getConstraints();
        let facingMode = c.facingMode;
        if (!facingMode) {
            c = track.getCapabilities();
            facingMode = c.facingMode[0];
        }
        if (facingMode === 'environment') {
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
                    h("div", { class: "item close", onClick: e => this.handleClose(e) },
                        h("img", { src: `${this.publicPath}icons/exit.svg` })),
                    h("div", { class: "item flash", onClick: e => this.handleFlashClick(e) },
                        h("img", { src: `${this.publicPath}icons/flash-on.svg` })))),
            this.photo && (h("div", { class: "accept" },
                h("div", { class: "accept-image", style: { backgroundImage: `url(${this.photoSrc})` } }))),
            h("div", { class: "camera-video", style: { display: this.photo ? 'none' : '' } },
                this.showShutterOverlay && (h("div", { class: "shutter-overlay" })),
                this.hasImageCapture() ? (h("video", { ref: (el) => this.videoElement = el, autoplay: true, playsinline: true })) : (h("canvas", { ref: (el) => this.canvasElement = el, width: "100%", height: "100%" }))),
            h("div", { class: "camera-footer" }, !this.photo ? ([
                h("div", { class: "shutter", onClick: (e) => this.handleShutterClick(e) },
                    h("div", { class: "shutter-button" })),
                h("div", { class: "rotate", onClick: (e) => this.handleRotateClick(e) },
                    h("img", { src: `${this.publicPath}icons/reverse-camera.svg` })),
                {}
            ]) : (h("section", { class: "items" },
                h("div", { class: "item accept-cancel", onClick: e => this.handleCancelPhoto(e) },
                    h("img", { src: `${this.publicPath}icons/retake.svg` })),
                h("div", { class: "item accept-use", onClick: e => this.handleAcceptPhoto(e) },
                    h("img", { src: `${this.publicPath}icons/confirm.svg` })))))));
    }
    static get is() { return "ion-camera"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return { "facingMode": { "type": String, "attr": "facing-mode" }, "flashIndex": { "state": true }, "isServer": { "context": "isServer" }, "photo": { "state": true }, "photoSrc": { "state": true }, "publicPath": { "context": "publicPath" }, "showShutterOverlay": { "state": true } }; }
    static get events() { return [{ "name": "onPhoto", "method": "onPhoto", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "\@charset \"UTF-8\";\n[data-ion-camera-host] {\n  font-family: -apple-system, BlinkMacSystemFont, “Segoe UI”, “Roboto”, “Droid Sans”, “Helvetica Neue”, sans-serif;\n  display: block;\n  width: 100%;\n  height: 100%;\n}\n\n[data-ion-camera-host]   .items[data-ion-camera] {\n  box-sizing: border-box;\n  display: flex;\n  width: 100%;\n  height: 100%;\n  align-items: center;\n  justify-content: center;\n}\n\n[data-ion-camera-host]   .items[data-ion-camera]   .item[data-ion-camera] {\n  flex: 1;\n  text-align: center;\n}\n\n[data-ion-camera-host]   .items[data-ion-camera]   .item[data-ion-camera]:first-child {\n  text-align: left;\n}\n\n[data-ion-camera-host]   .items[data-ion-camera]   .item[data-ion-camera]:last-child {\n  text-align: right;\n}\n\n[data-ion-camera-host]   .camera-wrapper[data-ion-camera] {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n}\n\n[data-ion-camera-host]   .camera-header[data-ion-camera] {\n  color: white;\n  background-color: black;\n  height: 4em;\n}\n\n[data-ion-camera-host]   .camera-header[data-ion-camera]   .items[data-ion-camera] {\n  padding: 1.5em;\n}\n\n[data-ion-camera-host]   .camera-footer[data-ion-camera] {\n  position: relative;\n  color: white;\n  background-color: black;\n  height: 9em;\n}\n\n[data-ion-camera-host]   .camera-footer[data-ion-camera]   .items[data-ion-camera] {\n  padding: 2em;\n}\n\n[data-ion-camera-host]   .camera-video[data-ion-camera] {\n  position: relative;\n  flex: 1;\n  overflow: hidden;\n  background-color: black;\n}\n\n[data-ion-camera-host]   video[data-ion-camera] {\n  width: 100%;\n  height: 100%;\n  max-height: 100%;\n  min-height: 100%;\n  z-index: -1;\n  object-fit: cover;\n  background-color: black;\n}\n\n[data-ion-camera-host]   .shutter[data-ion-camera] {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  width: 6em;\n  height: 6em;\n  margin-top: -3em;\n  margin-left: -3em;\n  border-radius: 100%;\n  background-color: #c6cdd8;\n  padding: 12px;\n  box-sizing: border-box;\n}\n\n[data-ion-camera-host]   .shutter[data-ion-camera]:active   .shutter-button[data-ion-camera] {\n  background-color: #9da9bb;\n}\n\n[data-ion-camera-host]   .shutter-button[data-ion-camera] {\n  background-color: white;\n  border-radius: 100%;\n  width: 100%;\n  height: 100%;\n}\n\n[data-ion-camera-host]   .rotate[data-ion-camera] {\n  display: flex;\n  align-items: center;\n  position: absolute;\n  right: 2em;\n  top: 0;\n  height: 100%;\n  width: 2.5em;\n  color: white;\n}\n\n[data-ion-camera-host]   .rotate[data-ion-camera]   img[data-ion-camera] {\n  width: 2.5em;\n  height: 2.5em;\n}\n\n[data-ion-camera-host]   .shutter-overlay[data-ion-camera] {\n  z-index: 5;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background-color: black;\n}\n\n[data-ion-camera-host]   .accept[data-ion-camera] {\n  background-color: black;\n  flex: 1;\n}\n\n[data-ion-camera-host]   .accept[data-ion-camera]   .accept-image[data-ion-camera] {\n  width: 100%;\n  height: 100%;\n  background-position: center center;\n  background-size: cover;\n  background-repeat: no-repeat;\n}\n\n[data-ion-camera-host]   .close[data-ion-camera]   img[data-ion-camera] {\n  width: 1.5em;\n  height: 1.5em;\n}\n\n[data-ion-camera-host]   .flash[data-ion-camera]   img[data-ion-camera] {\n  width: 1.5em;\n  height: 1.5em;\n}\n\n[data-ion-camera-host]   .accept-use[data-ion-camera]   img[data-ion-camera] {\n  width: 2.5em;\n  height: 2.5em;\n}\n\n[data-ion-camera-host]   .accept-cancel[data-ion-camera]   img[data-ion-camera] {\n  width: 2.5em;\n  height: 2.5em;\n}"; }
}

export { Camera as IonCamera };
