/*! Built with http://stenciljs.com */
mycomponent.loadBundle('ion-camera-modal', ['exports'], function (exports) {
    var h = window.mycomponent.h;
    var Context = window.mycomponent.Context;
    var CameraModal = /** @class */ (function () {
        function CameraModal() {
        }
        CameraModal.prototype.componentDidLoad = function () {
        };
        CameraModal.prototype.render = function () {
            return (h("div", null, h("ion-modal-controller", null)));
        };
        Object.defineProperty(CameraModal, "is", {
            get: function () { return "ion-camera-modal"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CameraModal, "encapsulation", {
            get: function () { return "shadow"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CameraModal, "style", {
            get: function () { return ""; },
            enumerable: true,
            configurable: true
        });
        return CameraModal;
    }());
    exports.IonCameraModal = CameraModal;
    Object.defineProperty(exports, '__esModule', { value: true });
});
