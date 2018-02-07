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
    componentDidUnload() {
        this.stopStream();
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
    handleCancelPhoto(_e) {
        this.photo = null;
    }
    handleAcceptPhoto(_e) {
        this.onPhoto.emit(this.photo);
    }
    render() {
        return (h("div", { class: "camera-wrapper" },
            h("div", { class: "camera-header" }, this.hasMultipleCameras && (h("div", { class: "rotate", onClick: (e) => this.handleRotateClick(e) }))),
            this.photo && (h("div", { class: "accept" },
                h("div", { class: "accept-image", style: { backgroundImage: `url(${this.photoSrc})` } }))),
            h("div", { class: "camera-video", style: { display: this.photo ? 'none' : '' } },
                h("video", { ref: (el) => this.videoElement = el, autoplay: true })),
            h("div", { class: "camera-footer" }, !this.photo ? (h("div", { class: "shutter", onClick: (e) => this.handleShutterClick(e) },
                h("div", { class: "shutter-ring" },
                    h("div", { class: "shutter-button" })))) : (h("section", { class: "items" },
                h("div", { class: "item", onClick: e => this.handleCancelPhoto(e) }, "Cancel"),
                h("div", { class: "item", onClick: e => this.handleAcceptPhoto(e) }, "Use"))))));
    }
    static get is() { return "ion-camera"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return { "isServer": { "context": "isServer" }, "photo": { "state": true }, "photoSrc": { "state": true } }; }
    static get events() { return [{ "name": "onPhoto", "method": "onPhoto", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "\@charset \"UTF-8\";\n:host {\n  font-family: -apple-system, BlinkMacSystemFont, “Segoe UI”, “Roboto”, “Droid Sans”, “Helvetica Neue”, sans-serif;\n  display: block;\n  width: 100%;\n  height: 100%;\n}\n\n:host .rotate {\n  position: absolute;\n  right: 16px;\n  top: 16px;\n  width: 32px;\n  height: 32px;\n  color: white;\n  background: url(\"/assets/rotate-camera.png\") no-repeat transparent;\n  background-size: 32px 32px;\n}\n\n:host .camera-wrapper {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n}\n\n:host .camera-header {\n  color: white;\n  background-color: black;\n  height: 64px;\n}\n\n:host .camera-footer {\n  color: white;\n  background-color: black;\n  height: 128px;\n}\n\n:host .camera-footer .items {\n  display: flex;\n  width: 100%;\n  height: 100%;\n  align-items: center;\n  justify-content: center;\n}\n\n:host .camera-footer .items .item {\n  flex: 1;\n  text-align: center;\n}\n\n:host .camera-video {\n  flex: 1;\n}\n\n:host video {\n  width: 100%;\n  height: 100%;\n  z-index: -1;\n  object-fit: cover;\n}\n\n:host .shutter {\n  position: absolute;\n  left: 50%;\n  bottom: 32px;\n  width: 64px;\n  height: 64px;\n  margin-top: -32px;\n  margin-left: -32px;\n  border-radius: 100%;\n  background-color: #c6cdd8;\n  padding: 6px;\n}\n\n:host .shutter:active .shutter-button {\n  background-color: 9da9bb;\n}\n\n:host .shutter-ring {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background-color: black;\n  width: 100%;\n  height: 100%;\n  border-radius: 100%;\n}\n\n:host .shutter-button {\n  background-color: white;\n  border-radius: 100%;\n  width: calc(100% - 6px);\n  height: calc(100% - 6px);\n}\n\n:host .accept {\n  flex: 1;\n}\n\n:host .accept .accept-image {\n  width: 100%;\n  height: 100%;\n  background-position: center center;\n  background-size: cover;\n  background-repeat: no-repeat;\n}"; }
}

export { Camera as IonCamera };
