/*! Built with http://stenciljs.com */
const { h, Context } = window.mycomponent;

class CameraModal {
    componentDidLoad() {
    }
    render() {
        return (h("div", null,
            h("ion-modal-controller", null)));
    }
    static get is() { return "ion-camera-modal"; }
    static get encapsulation() { return "shadow"; }
    static get style() { return ""; }
}

export { CameraModal as IonCameraModal };
