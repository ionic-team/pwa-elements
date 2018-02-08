/*! Built with http://stenciljs.com */
const { h, Context } = window.mycomponent;

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
        this.hasMultipleCameras = false;
    }
    componentDidLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isServer) {
                return;
            }
            // Figure out how many cameras we have
            yield this.queryDevices();
            // Initialize the camera
            yield this.initCamera();
        });
    }
    componentDidUnload() {
        this.stopStream();
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
    initCamera(constraints = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stream = yield navigator.mediaDevices.getUserMedia(Object.assign({ video: true, audio: false }, constraints));
                this.initStream(stream);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    hasImageCapture() {
        return 'ImageCapture' in window;
    }
    initStream(stream) {
        this.stream = stream;
        this.videoElement.srcObject = stream;
        if (this.hasImageCapture()) {
            this.imageCapture = new window.ImageCapture(stream.getVideoTracks()[0]);
            // console.log(stream.getTracks()[0].getCapabilities());
        }
        else {
            // TODO: DO SOMETHING ELSE HERE
        }
    }
    stopStream() {
        this.stream && this.stream.getTracks().forEach(track => track.stop());
    }
    capture() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.hasImageCapture()) {
                try {
                    const photo = yield this.imageCapture.takePhoto();
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
        const constraints = track.getConstraints();
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
    }
    cycleFlash() {
    }
    flashScreen() {
        console.log('Flashing screen');
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
                h("video", { ref: (el) => this.videoElement = el, autoplay: true })),
            h("div", { class: "camera-footer" }, !this.photo ? ([
                h("div", { class: "shutter", onClick: (e) => this.handleShutterClick(e) },
                    h("div", { class: "shutter-button" })),
                h("div", { class: "rotate", onClick: (e) => this.handleRotateClick(e) }),
                {}
            ]) : (h("section", { class: "items" },
                h("div", { class: "item", onClick: e => this.handleCancelPhoto(e) }, "Cancel"),
                h("div", { class: "item", onClick: e => this.handleAcceptPhoto(e) }, "Use"))))));
    }
    static get is() { return "ion-camera"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return { "isServer": { "context": "isServer" }, "photo": { "state": true }, "photoSrc": { "state": true } }; }
    static get events() { return [{ "name": "onPhoto", "method": "onPhoto", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "\@charset \"UTF-8\";\n[data-ion-camera-host] {\n  font-family: -apple-system, BlinkMacSystemFont, “Segoe UI”, “Roboto”, “Droid Sans”, “Helvetica Neue”, sans-serif;\n  display: block;\n  width: 100%;\n  height: 100%;\n}\n\n[data-ion-camera-host]   .items[data-ion-camera] {\n  box-sizing: border-box;\n  display: flex;\n  width: 100%;\n  height: 100%;\n  align-items: center;\n  justify-content: center;\n}\n\n[data-ion-camera-host]   .items[data-ion-camera]   .item[data-ion-camera] {\n  flex: 1;\n  text-align: center;\n}\n\n[data-ion-camera-host]   .camera-wrapper[data-ion-camera] {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n}\n\n[data-ion-camera-host]   .camera-header[data-ion-camera] {\n  color: white;\n  background-color: black;\n  height: 5em;\n}\n\n[data-ion-camera-host]   .camera-header[data-ion-camera]   .items[data-ion-camera] {\n  padding: 0 1.5em 0 1.5em;\n}\n\n[data-ion-camera-host]   .camera-header[data-ion-camera]   .items[data-ion-camera]   .item[data-ion-camera]:first-child {\n  background-position-x: 0;\n}\n\n[data-ion-camera-host]   .camera-header[data-ion-camera]   .items[data-ion-camera]   .item[data-ion-camera]:last-child {\n  background-position-x: 100%;\n}\n\n[data-ion-camera-host]   .camera-footer[data-ion-camera] {\n  position: relative;\n  color: white;\n  background-color: black;\n  height: 9em;\n}\n\n[data-ion-camera-host]   .camera-video[data-ion-camera] {\n  flex: 1;\n}\n\n[data-ion-camera-host]   video[data-ion-camera] {\n  width: 100%;\n  height: 100%;\n  z-index: -1;\n  object-fit: cover;\n}\n\n[data-ion-camera-host]   .shutter[data-ion-camera] {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  width: 6em;\n  height: 6em;\n  margin-top: -3em;\n  margin-left: -3em;\n  border-radius: 100%;\n  background-color: #c6cdd8;\n  padding: 12px;\n  box-sizing: border-box;\n}\n\n[data-ion-camera-host]   .shutter[data-ion-camera]:active   .shutter-button[data-ion-camera] {\n  background-color: #9da9bb;\n}\n\n[data-ion-camera-host]   .shutter-button[data-ion-camera] {\n  background-color: white;\n  border-radius: 100%;\n  width: 100%;\n  height: 100%;\n}\n\n[data-ion-camera-host]   .rotate[data-ion-camera] {\n  position: absolute;\n  right: 1.5em;\n  top: 0;\n  height: 100%;\n  width: 3em;\n  color: white;\n  background: url(\"/assets/reverse-camera.svg\") no-repeat transparent;\n  background-size: 3em;\n  background-position: center;\n}\n\n[data-ion-camera-host]   .accept[data-ion-camera] {\n  flex: 1;\n}\n\n[data-ion-camera-host]   .accept[data-ion-camera]   .accept-image[data-ion-camera] {\n  width: 100%;\n  height: 100%;\n  background-position: center center;\n  background-size: cover;\n  background-repeat: no-repeat;\n}\n\n[data-ion-camera-host]   .close[data-ion-camera] {\n  width: 2em;\n  height: 2em;\n  background: url(\"/assets/exit.svg\") no-repeat transparent;\n  background-size: 2em;\n  background-position: center;\n}\n\n[data-ion-camera-host]   .flash[data-ion-camera] {\n  width: 2em;\n  height: 2em;\n  background: url(\"/assets/flash-on.svg\") no-repeat transparent;\n  background-size: 2em;\n  background-position: center;\n}"; }
}

export { Camera as IonCamera };
