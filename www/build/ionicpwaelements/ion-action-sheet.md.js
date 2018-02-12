/*! Built with http://stenciljs.com */
const { h, Context } = window.ionicpwaelements;

function isDef(v) { return v !== undefined && v !== null; }




function isString(v) { return typeof v === 'string'; }




/** @hidden */












/**
 * @hidden
 * Given a side, return if it should be on the right
 * based on the value of dir
 * @param side the side
 * @param isRTL whether the application dir is rtl
 * @param defaultRight whether the default side is right
 */

/** @hidden */










/**
 * @private
 */

function playAnimationAsync(animation) {
    return new Promise((resolve) => {
        animation.onFinish((ani) => {
            resolve(ani);
        });
        animation.play();
    });
}
function domControllerAsync(domControllerFunction, callback) {
    return new Promise((resolve) => {
        domControllerFunction(() => {
            if (!callback) {
                return resolve();
            }
            Promise.resolve(callback()).then((...args) => {
                resolve(args);
            });
        });
    });
}

/**
 * Create the mode and color classes for the component based on the classes passed in
 */
function createThemedClasses(mode, color, classes) {
    const classObj = {};
    return classes.split(' ')
        .reduce((classObj, classString) => {
        classObj[classString] = true;
        if (mode) {
            classObj[`${classString}-${mode}`] = true;
            if (color) {
                classObj[`${classString}-${color}`] = true;
                classObj[`${classString}-${mode}-${color}`] = true;
            }
        }
        return classObj;
    }, classObj);
}
/**
 * Get the classes from a class list and return them as an object
 */

/**
 * Get the classes based on the button type
 * e.g. alert-button, action-sheet-button
 */

function getClassMap(classes) {
    const map = {};
    if (classes) {
        classes
            .split(' ')
            .filter(c => c.trim() !== '')
            .forEach(c => map[c] = true);
    }
    return map;
}

/**
 * iOS Action Sheet Enter Animation
 */
function iosEnterAnimation(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.action-sheet-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.action-sheet-wrapper'));
    backdropAnimation.fromTo('opacity', 0.01, 0.4);
    wrapperAnimation.fromTo('translateY', '100%', '0%');
    const ani = baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(400)
        .add(backdropAnimation)
        .add(wrapperAnimation);
    return Promise.resolve(ani);
}

/**
 * iOS Action Sheet Leave Animation
 */
function iosLeaveAnimation(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.action-sheet-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.action-sheet-wrapper'));
    backdropAnimation.fromTo('opacity', 0.4, 0);
    wrapperAnimation.fromTo('translateY', '0%', '100%');
    const ani = baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(450)
        .add(backdropAnimation)
        .add(wrapperAnimation);
    return Promise.resolve(ani);
}

/**
 * MD Action Sheet Enter Animation
 */
function mdEnterAnimation(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.action-sheet-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.action-sheet-wrapper'));
    backdropAnimation.fromTo('opacity', 0.01, 0.26);
    wrapperAnimation.fromTo('translateY', '100%', '0%');
    const ani = baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(400)
        .add(backdropAnimation)
        .add(wrapperAnimation);
    return Promise.resolve(ani);
}

/**
 * MD Action Sheet Leave Animation
 */
function mdLeaveAnimation(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.action-sheet-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.action-sheet-wrapper'));
    backdropAnimation.fromTo('opacity', 0.26, 0);
    wrapperAnimation.fromTo('translateY', '0%', '100%');
    const ani = baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(450)
        .add(backdropAnimation)
        .add(wrapperAnimation);
    return Promise.resolve(ani);
}

class ActionSheet {
    constructor() {
        this.animation = null;
        /**
         * If true, the action-sheet will be dismissed when the backdrop is clicked.
         */
        this.enableBackdropDismiss = true;
        /**
         * If true, action-sheet will become translucent. Requires support for backdrop-filters.
         */
        this.translucent = false;
        /**
         * Enable action-sheet animations. If false, action-sheet will not animate in
         */
        this.willAnimate = true;
    }
    /**
     * Present the action-sheet after is has been created
     */
    present() {
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        this.ionActionSheetWillPresent.emit();
        this.el.style.zIndex = `${20000 + this.actionSheetId}`;
        // get the user's animation fn if one was provided
        const animationBuilder = this.enterAnimation || this.config.get('actionSheetEnter', this.mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);
        // build the animation and kick it off
        return this.animationCtrl.create(animationBuilder, this.el).then(animation => {
            this.animation = animation;
            // Check if prop animate is false or if the config for animate is defined/false
            if (!this.willAnimate || (isDef(this.config.get('willAnimate')) && this.config.get('willAnimate') === false)) {
                // if the duration is 0, it won't actually animate I don't think
                // TODO - validate this
                this.animation = animation.duration(0);
            }
            return playAnimationAsync(animation);
        }).then((animation) => {
            animation.destroy();
            this.ionActionSheetDidPresent.emit();
        });
    }
    /**
     * Dismiss the action-sheet
     */
    dismiss(data, role) {
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        this.ionActionSheetWillDismiss.emit({
            data,
            role
        });
        const animationBuilder = this.leaveAnimation || this.config.get('actionSheetLeave', this.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);
        return this.animationCtrl.create(animationBuilder, this.el).then(animation => {
            this.animation = animation;
            if (!this.willAnimate || (isDef(this.config.get('willAnimate')) && this.config.get('willAnimate') === false)) {
                this.animation = animation.duration(0);
            }
            return playAnimationAsync(animation);
        }).then((animation) => {
            animation.destroy();
            this.ionActionSheetDidDismiss.emit({
                data,
                role
            });
        }).then(() => {
            return domControllerAsync(this.dom.write, () => {
                this.el.parentNode.removeChild(this.el);
            });
        });
    }
    componentDidLoad() {
        this.ionActionSheetDidLoad.emit();
    }
    componentDidUnload() {
        this.ionActionSheetDidUnload.emit();
    }
    onDismiss(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        this.dismiss();
    }
    backdropClick() {
        if (this.enableBackdropDismiss) {
            this.dismiss();
        }
    }
    buttonClick(button) {
        let shouldDismiss = true;
        if (button.handler) {
            if (button.handler() === false) {
                shouldDismiss = false;
            }
        }
        if (shouldDismiss) {
            this.dismiss();
        }
    }
    hostData() {
        const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'action-sheet-translucent') : {};
        return {
            class: Object.assign({}, themedClasses, getClassMap(this.cssClass))
        };
    }
    render() {
        const allButtons = this.buttons.map(b => {
            if (typeof b === 'string') {
                b = { text: b };
            }
            if (!b.cssClass) {
                b.cssClass = '';
            }
            return b;
        });
        const cancelButton = allButtons.find(b => b.role === 'cancel');
        const buttons = allButtons.filter(b => b.role !== 'cancel');
        return [
            h("ion-backdrop", { onClick: this.backdropClick.bind(this), class: 'action-sheet-backdrop' }),
            h("div", { class: 'action-sheet-wrapper', role: 'dialog' },
                h("div", { class: 'action-sheet-container' },
                    h("div", { class: 'action-sheet-group' },
                        this.title
                            ? h("div", { class: 'action-sheet-title' },
                                this.title,
                                this.subTitle
                                    ? h("div", { class: 'action-sheet-sub-title' }, this.subTitle)
                                    : null)
                            : null,
                        buttons.map(b => h("button", { class: buttonClass(b), onClick: () => this.buttonClick(b) },
                            h("span", { class: 'button-inner' },
                                b.icon
                                    ? h("ion-icon", { name: b.icon, class: 'action-sheet-icon' })
                                    : null,
                                b.text)))),
                    cancelButton
                        ? h("div", { class: 'action-sheet-group action-sheet-group-cancel' },
                            h("button", { class: buttonClass(cancelButton), onClick: () => this.buttonClick(cancelButton) },
                                h("span", { class: 'button-inner' },
                                    cancelButton.icon
                                        ? h("ion-icon", { name: cancelButton.icon, class: 'action-sheet-icon' })
                                        : null,
                                    cancelButton.text)))
                        : null))
        ];
    }
    static get is() { return "ion-action-sheet"; }
    static get host() { return { "theme": "action-sheet" }; }
    static get properties() { return { "animationCtrl": { "connect": "ion-animation-controller" }, "buttons": { "type": "Any", "attr": "buttons" }, "config": { "context": "config" }, "cssClass": { "type": String, "attr": "css-class" }, "dismiss": { "method": true }, "dom": { "context": "dom" }, "el": { "elementRef": true }, "enableBackdropDismiss": { "type": Boolean, "attr": "enable-backdrop-dismiss" }, "enterAnimation": { "type": "Any", "attr": "enter-animation" }, "leaveAnimation": { "type": "Any", "attr": "leave-animation" }, "present": { "method": true }, "subTitle": { "type": String, "attr": "sub-title" }, "title": { "type": String, "attr": "title" }, "translucent": { "type": Boolean, "attr": "translucent" }, "willAnimate": { "type": Boolean, "attr": "will-animate" } }; }
    static get events() { return [{ "name": "ionActionSheetDidLoad", "method": "ionActionSheetDidLoad", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionActionSheetDidPresent", "method": "ionActionSheetDidPresent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionActionSheetWillPresent", "method": "ionActionSheetWillPresent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionActionSheetWillDismiss", "method": "ionActionSheetWillDismiss", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionActionSheetDidDismiss", "method": "ionActionSheetDidDismiss", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionActionSheetDidUnload", "method": "ionActionSheetDidUnload", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-action-sheet {\n  left: 0;\n  top: 0;\n  position: absolute;\n  z-index: 1000;\n  display: block;\n  width: 100%;\n  height: 100%;\n}\n\n.action-sheet-wrapper {\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  margin: auto;\n  transform: translate3d(0,  100%,  0);\n  position: absolute;\n  z-index: 10;\n  display: block;\n  width: 100%;\n  max-width: 500px;\n  pointer-events: none;\n}\n\n.action-sheet-button {\n  width: 100%;\n  border: 0;\n}\n\n.action-sheet-button:active, .action-sheet-button:focus {\n  outline: none;\n}\n\n.action-sheet-container {\n  display: flex;\n  flex-flow: column;\n  justify-content: flex-end;\n  height: 100%;\n  max-height: 100%;\n}\n\n.action-sheet-group {\n  overflow: scroll;\n  flex-shrink: 2;\n  pointer-events: all;\n}\n\n.action-sheet-group-cancel {\n  overflow: hidden;\n  flex-shrink: 0;\n}\n\n.action-sheet-md {\n  font-family: \"Roboto\", \"Helvetica Neue\", sans-serif;\n}\n\n.action-sheet-md .action-sheet-title {\n  padding: 11px 16px 17px;\n  text-align: left;\n  text-align: start;\n  font-size: 16px;\n  color: var(--ion-text-md-color-step-200, var(--ion-text-color-step-200, #666));\n}\n\n.action-sheet-md .action-sheet-sub-title {\n  padding: 16px 0 0;\n  font-size: 14px;\n}\n\n.action-sheet-md .action-sheet-group {\n  background: var(--ion-background-md-color-step-100, var(--ion-background-color-step-100, #f2f2f2));\n}\n\n.action-sheet-md .action-sheet-group:first-child {\n  padding-top: 8px;\n}\n\n.action-sheet-md .action-sheet-group:last-child {\n  padding-bottom: 8px;\n}\n\n.action-sheet-md .action-sheet-button {\n  padding: 0 16px;\n  text-align: left;\n  text-align: start;\n  position: relative;\n  overflow: hidden;\n  min-height: 48px;\n  font-size: 16px;\n  color: var(--ion-text-md-color-step-100, var(--ion-text-color-step-100, #222));\n  background: transparent;\n}\n\n.action-sheet-md .action-sheet-button.activated {\n  background: var(--ion-background-md-color-step-100, var(--ion-background-color-step-100, #f2f2f2));\n}\n\n.action-sheet-md .action-sheet-icon {\n  margin: 0 32px 0 0;\n  font-size: 24px;\n}\n\n.action-sheet-md .action-sheet-group .button-inner {\n  justify-content: flex-start;\n}\n\n.action-sheet-md .action-sheet-selected {\n  font-weight: bold;\n}"; }
    static get styleMode() { return "md"; }
}
function buttonClass(button) {
    const buttonClasses = Object.assign({ 'action-sheet-button': true }, getClassMap(button.cssClass));
    if (button.role) {
        buttonClasses[`action-sheet-${button.role}`] = true;
    }
    return buttonClasses;
}

let ids = 0;
const actionSheets = new Map();
class ActionSheetController {
    create(opts) {
        // create ionic's wrapping ion-actionSheet component
        const actionSheetElement = document.createElement('ion-action-sheet');
        // give this actionSheet a unique id
        actionSheetElement.actionSheetId = ids++;
        // convert the passed in actionSheet options into props
        // that get passed down into the new actionSheet
        Object.assign(actionSheetElement, opts);
        // append the actionSheet element to the document body
        const appRoot = document.querySelector('ion-app') || document.body;
        appRoot.appendChild(actionSheetElement);
        return actionSheetElement.componentOnReady();
    }
    dismiss(data, role, actionSheetId = -1) {
        actionSheetId = actionSheetId >= 0 ? actionSheetId : getHighestId();
        const actionSheet = actionSheets.get(actionSheetId);
        if (!actionSheet) {
            return Promise.reject('action-sheet does not exist');
        }
        return actionSheet.dismiss(data, role);
    }
    getTop() {
        return actionSheets.get(getHighestId());
    }
    actionSheetWillPresent(ev) {
        actionSheets.set(ev.target.actionSheetId, ev.target);
    }
    actionSheetWillDismiss(ev) {
        actionSheets.delete(ev.target.actionSheetId);
    }
    escapeKeyUp() {
        removeLastActionSheet();
    }
    static get is() { return "ion-action-sheet-controller"; }
    static get properties() { return { "create": { "method": true }, "dismiss": { "method": true }, "getTop": { "method": true } }; }
}
function getHighestId() {
    let minimum = -1;
    actionSheets.forEach((_actionSheet, id) => {
        if (id > minimum) {
            minimum = id;
        }
    });
    return minimum;
}
function removeLastActionSheet() {
    const toRemove = actionSheets.get(getHighestId());
    return toRemove ? toRemove.dismiss() : Promise.resolve();
}

class Icon {
    constructor() {
        /**
         * Specifies the label to use for accessibility. Defaults to the icon name.
         */
        this.ariaLabel = "";
        /**
         * Specifies which icon to use on `ios` mode.
         */
        this.ios = "";
        /**
         * Specifies which icon to use on `md` mode.
         */
        this.md = "";
        /**
         * Specifies which icon to use. The appropriate icon will be used based on the mode.
         * For more information, see [Ionicons](/docs/ionicons/).
         */
        this.name = "";
        this.svgContent = null;
    }
    get iconName() {
        let iconName = this.name.toLowerCase();
        // default to "md" if somehow the mode wasn't set
        const mode = this.mode || "md";
        // if an icon was passed in using the ios or md attributes
        // set the iconName to whatever was passed in
        if (this.ios && mode === "ios") {
            iconName = this.ios.toLowerCase();
        }
        else if (this.md && mode === "md") {
            iconName = this.md.toLowerCase();
            // this does not have one of the defaults
            // so lets auto add in the mode prefix for them
        }
        else if (iconName && !(/^md-|^ios-|^logo-/.test(iconName))) {
            iconName = mode + "-" + iconName;
        }
        // only allow alpha characters and dash
        const invalidChars = iconName.replace(/[a-z]|-|\d/g, "");
        if (invalidChars !== "") {
            console.error(`invalid characters in ion-icon name: ${invalidChars}`);
            return null;
        }
        return iconName;
    }
    hostData() {
        const attrs = {
            "role": "img"
        };
        if (this.ariaLabel) {
            // user provided label
            attrs["aria-label"] = this.ariaLabel;
        }
        else {
            // come up with the label based on the icon name
            const iconName = this.iconName;
            if (iconName) {
                attrs["aria-label"] = iconName
                    .replace("ios-", "")
                    .replace("md-", "")
                    .replace("-outline", "")
                    .replace(/\-/g, " ");
            }
        }
        return attrs;
    }
    render() {
        if (this.isServer) {
            return h("div", { class: "icon-inner" });
        }
        const iconName = this.iconName;
        if (!iconName) {
            // we don't have good data
            return h("div", { class: "icon-inner" });
        }
        const svgContent = svgContents[iconName];
        if (svgContent === this.svgContent) {
            // we've already loaded up this svg at one point
            // and the svg content we've loaded and assigned checks out
            // render this svg!!
            return h("div", { class: "icon-inner", innerHTML: svgContent });
        }
        // haven't loaded this svg yet
        // start the request
        loadSvgContent(iconName, this.publicPath, loadedSvgContent => {
            // we're finished loading the svg content!
            // set to this.svgContent so we do another render
            this.svgContent = loadedSvgContent;
        });
        // actively requesting the svg, so let's just render a div for now
        return h("div", { class: "icon-inner" });
    }
    static get is() { return "ion-icon"; }
    static get host() { return { "theme": "icon" }; }
    static get properties() { return { "ariaLabel": { "type": String }, "ios": { "type": String }, "isServer": { "context": "isServer" }, "md": { "type": String }, "mode": { "context": "mode" }, "name": { "type": String }, "publicPath": { "context": "publicPath" }, "svgContent": { "state": true } }; }
    static get style() { return "ion-icon {\n  display: inline-block;\n  font-size: inherit;\n}\n\nion-icon .icon-inner {\n  height: 1em;\n  width: 1em;\n}\n\nion-icon svg {\n  fill: currentColor;\n  stroke: currentColor;\n}"; }
}
function loadSvgContent(iconName, publicPath, callback) {
    // static since all IonIcons use this same function and pointing at global/shared data
    // passed in callback will have instance info
    // add to the list of callbacks to fiure when this url is finished loading
    (loadCallbacks[iconName] = loadCallbacks[iconName] || []).push(callback);
    if (activeRequests[iconName]) {
        // already requesting this icon, don't bother kicking off another
        return;
    }
    // add this icons to our list of active requests
    activeRequests[iconName] = true;
    // kick off the request for the external svg file
    // create a script element to add to the document.head
    var scriptElm = document.createElement("script");
    scriptElm.charset = "utf-8";
    scriptElm.async = true;
    scriptElm.src = `${publicPath}svg/${iconName}.js`;
    // create a fallback timeout if something goes wrong
    var tmrId = setTimeout(onScriptComplete, 120000);
    function onScriptComplete() {
        clearTimeout(tmrId);
        scriptElm.onerror = scriptElm.onload = null;
        scriptElm.parentNode.removeChild(scriptElm);
        // remove from our list of active requests
        delete activeRequests[iconName];
    }
    // add script completed listener to this script element
    scriptElm.onerror = scriptElm.onload = onScriptComplete;
    // inject a script tag in the head
    // kick off the actual request
    document.head.appendChild(scriptElm);
}
const activeRequests = {};
const loadCallbacks = [];
const svgContents = {};
// add a jsonp handler to the window
// as svg jsonp files are requested
// once they load they'll call this method
window.loadIonicon = function loadIonicon(svgContent, iconName) {
    // awesome, we've finished loading the svg file
    // remove this url from the active requests
    delete activeRequests[iconName];
    svgContents[iconName] = svgContent;
    // find any callbacks waiting on this icon
    const svgLoadCallbacks = loadCallbacks[iconName];
    if (svgLoadCallbacks) {
        // loop through all the callbacks that are waiting on the svg content
        svgLoadCallbacks.forEach(cb => {
            // fire off this callback which was provided by an instance
            cb(svgContent);
        });
        delete loadCallbacks[iconName];
    }
};

class DomFrameworkDelegate {
    attachViewToDom(parentElement, tagOrElement, data = {}, classesToAdd = []) {
        return new Promise((resolve) => {
            const usersElement = (isString(tagOrElement) ? document.createElement(tagOrElement) : tagOrElement);
            Object.assign(usersElement, data);
            if (classesToAdd.length) {
                for (const clazz of classesToAdd) {
                    usersElement.classList.add(clazz);
                }
            }
            parentElement.appendChild(usersElement);
            resolve({
                element: usersElement,
                data: data,
                component: tagOrElement
            });
        });
    }
    removeViewFromDom(parentElement, childElement) {
        parentElement.removeChild(childElement);
        return Promise.resolve();
    }
    shouldDeferToRouter(_elementOrComponentToMount) {
        return Promise.resolve(false);
    }
    routeToUrl(_elementOrComponentToMount) {
        return Promise.resolve('todo');
    }
}

/**
 * iOS Modal Enter Animation
 */
function iosEnterAnimation$1(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.modal-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.modal-wrapper'));
    wrapperAnimation.beforeStyles({ 'opacity': 1 })
        .fromTo('translateY', '100%', '0%');
    backdropAnimation.fromTo('opacity', 0.01, 0.4);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(0.36,0.66,0.04,1)')
        .duration(400)
        .beforeAddClass('show-modal')
        .add(backdropAnimation)
        .add(wrapperAnimation));
}
/**
 * Animations for modals
 */
// export function modalSlideIn(rootEl: HTMLElement) {
// }
// export class ModalSlideOut {
//   constructor(el: HTMLElement) {
//     let backdrop = new Animation(this.plt, el.querySelector('ion-backdrop'));
//     let wrapperEle = <HTMLElement>el.querySelector('.modal-wrapper');
//     let wrapperEleRect = wrapperEle.getBoundingClientRect();
//     let wrapper = new Animation(this.plt, wrapperEle);
//     // height of the screen - top of the container tells us how much to scoot it down
//     // so it's off-screen
//     wrapper.fromTo('translateY', '0px', `${this.plt.height() - wrapperEleRect.top}px`);
//     backdrop.fromTo('opacity', 0.4, 0.0);
//     this
//       .element(this.leavingView.pageRef())
//       .easing('ease-out')
//       .duration(250)
//       .add(backdrop)
//       .add(wrapper);
//   }
// }
// export class ModalMDSlideIn {
//   constructor(el: HTMLElement) {
//     const backdrop = new Animation(this.plt, el.querySelector('ion-backdrop'));
//     const wrapper = new Animation(this.plt, el.querySelector('.modal-wrapper'));
//     backdrop.fromTo('opacity', 0.01, 0.4);
//     wrapper.fromTo('translateY', '40px', '0px');
//     wrapper.fromTo('opacity', 0.01, 1);
//     const DURATION = 280;
//     const EASING = 'cubic-bezier(0.36,0.66,0.04,1)';
//     this.element(this.enteringView.pageRef()).easing(EASING).duration(DURATION)
//       .add(backdrop)
//       .add(wrapper);
//   }
// }
// export class ModalMDSlideOut {
//   constructor(el: HTMLElement) {
//     const backdrop = new Animation(this.plt, el.querySelector('ion-backdrop'));
//     const wrapper = new Animation(this.plt, el.querySelector('.modal-wrapper'));
//     backdrop.fromTo('opacity', 0.4, 0.0);
//     wrapper.fromTo('translateY', '0px', '40px');
//     wrapper.fromTo('opacity', 0.99, 0);
//     this
//       .element(this.leavingView.pageRef())
//       .duration(200)
//       .easing('cubic-bezier(0.47,0,0.745,0.715)')
//       .add(wrapper)
//       .add(backdrop);
//   }
// }

/**
 * iOS Modal Leave Animation
 */
function iosLeaveAnimation$1(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.modal-backdrop'));
    const wrapperAnimation = new Animation();
    const wrapperEl = baseEl.querySelector('.modal-wrapper');
    wrapperAnimation.addElement(wrapperEl);
    const wrapperElRect = wrapperEl.getBoundingClientRect();
    wrapperAnimation.beforeStyles({ 'opacity': 1 })
        .fromTo('translateY', '0%', `${window.innerHeight - wrapperElRect.top}px`);
    backdropAnimation.fromTo('opacity', 0.4, 0.0);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('ease-out')
        .duration(250)
        .add(backdropAnimation)
        .add(wrapperAnimation));
}

/**
 * Md Modal Enter Animation
 */
function mdEnterAnimation$1(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.modal-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.modal-wrapper'));
    wrapperAnimation
        .fromTo('opacity', 0.01, 1)
        .fromTo('translateY', '40px', '0px');
    backdropAnimation.fromTo('opacity', 0.01, 0.4);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(0.36,0.66,0.04,1)')
        .duration(280)
        .beforeAddClass('show-modal')
        .add(backdropAnimation)
        .add(wrapperAnimation));
}

/**
 * Md Modal Leave Animation
 */
function mdLeaveAnimation$1(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.modal-backdrop'));
    const wrapperAnimation = new Animation();
    const wrapperEl = baseEl.querySelector('.modal-wrapper');
    wrapperAnimation.addElement(wrapperEl);
    wrapperAnimation
        .fromTo('opacity', 0.99, 0)
        .fromTo('translateY', '0px', '40px');
    backdropAnimation.fromTo('opacity', 0.4, 0.0);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(0.47,0,0.745,0.715)')
        .duration(200)
        .add(backdropAnimation)
        .add(wrapperAnimation));
}

class Modal {
    constructor() {
        this.data = {};
        this.enableBackdropDismiss = true;
        this.showBackdrop = true;
        this.willAnimate = true;
    }
    present() {
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        this.ionModalWillPresent.emit();
        this.el.style.zIndex = `${20000 + this.modalId}`;
        // get the user's animation fn if one was provided
        const animationBuilder = this.enterAnimation || this.config.get('modalEnter', this.mode === 'ios' ? iosEnterAnimation$1 : mdEnterAnimation$1);
        const userComponentParent = this.el.querySelector(`.${USER_COMPONENT_MODAL_CONTAINER_CLASS}`);
        if (!this.delegate) {
            this.delegate = new DomFrameworkDelegate();
        }
        const cssClasses = [];
        if (this.cssClass && this.cssClass.length) {
            cssClasses.push(this.cssClass);
        }
        // add the modal by default to the data being passed
        this.data = this.data || {};
        this.data.modal = this.el;
        this.delegate.attachViewToDom(userComponentParent, this.component, this.data, cssClasses)
            .then((mountingData) => {
            this.usersComponentElement = mountingData.element;
        });
        return this.animationCtrl.create(animationBuilder, this.el)
            .then(animation => {
            this.animation = animation;
            if (!this.willAnimate)
                this.animation = animation.duration(0);
            return playAnimationAsync(animation);
        })
            .then((animation) => {
            animation.destroy();
            this.ionModalDidPresent.emit();
        });
    }
    dismiss(data, role) {
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        this.ionModalWillDismiss.emit({ data, role });
        if (!this.delegate) {
            this.delegate = new DomFrameworkDelegate();
        }
        // get the user's animation fn if one was provided
        const animationBuilder = this.leaveAnimation || this.config.get('modalLeave', this.mode === 'ios' ? iosLeaveAnimation$1 : mdLeaveAnimation$1);
        return this.animationCtrl.create(animationBuilder, this.el)
            .then(animation => {
            this.animation = animation;
            if (!this.willAnimate) {
                this.animation = animation.duration(0);
            }
            return playAnimationAsync(animation);
        })
            .then((animation) => {
            animation.destroy();
            this.ionModalDidDismiss.emit({ data, role });
        })
            .then(() => {
            return domControllerAsync(this.dom.write, () => {
                const userComponentParent = this.el.querySelector(`.${USER_COMPONENT_MODAL_CONTAINER_CLASS}`);
                this.delegate.removeViewFromDom(userComponentParent, this.usersComponentElement);
                this.el.parentNode.removeChild(this.el);
            });
        });
    }
    getUserComponentContainer() {
        return this.el.querySelector(`.${USER_COMPONENT_MODAL_CONTAINER_CLASS}`);
    }
    onDismiss(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        this.dismiss();
    }
    componentDidLoad() {
        this.ionModalDidLoad.emit();
    }
    componentDidUnload() {
        this.ionModalDidUnload.emit();
    }
    backdropClick() {
        if (this.enableBackdropDismiss) {
            // const opts: NavOptions = {
            //   minClickBlockDuration: 400
            // };
            this.dismiss();
        }
    }
    render() {
        const backdropClasses = createThemedClasses(this.mode, this.color, 'modal-backdrop'), dialogClasses = createThemedClasses(this.mode, this.color, 'modal-wrapper');
        return [
            h("div", { onClick: this.backdropClick.bind(this), class: Object.assign({}, backdropClasses, { 'hide-backdrop': !this.showBackdrop }) }),
            h("div", { role: 'dialog', class: dialogClasses })
        ];
    }
    static get is() { return "ion-modal"; }
    static get host() { return { "theme": "modal" }; }
    static get properties() { return { "animationCtrl": { "connect": "ion-animation-controller" }, "color": { "type": String, "attr": "color" }, "component": { "type": "Any", "attr": "component" }, "config": { "context": "config" }, "cssClass": { "type": String, "attr": "css-class" }, "data": { "type": "Any", "attr": "data" }, "delegate": { "type": "Any", "attr": "delegate", "mutable": true }, "dismiss": { "method": true }, "dom": { "context": "dom" }, "el": { "elementRef": true }, "enableBackdropDismiss": { "type": Boolean, "attr": "enable-backdrop-dismiss" }, "enterAnimation": { "type": "Any", "attr": "enter-animation" }, "getUserComponentContainer": { "method": true }, "leaveAnimation": { "type": "Any", "attr": "leave-animation" }, "modalId": { "type": Number, "attr": "modal-id" }, "mode": { "type": "Any", "attr": "mode" }, "present": { "method": true }, "showBackdrop": { "type": Boolean, "attr": "show-backdrop" }, "willAnimate": { "type": Boolean, "attr": "will-animate" } }; }
    static get events() { return [{ "name": "ionModalDidLoad", "method": "ionModalDidLoad", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionModalDidPresent", "method": "ionModalDidPresent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionModalWillPresent", "method": "ionModalWillPresent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionModalWillDismiss", "method": "ionModalWillDismiss", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionModalDidDismiss", "method": "ionModalDidDismiss", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionModalDidUnload", "method": "ionModalDidUnload", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-modal {\n  left: 0;\n  top: 0;\n  position: absolute;\n  display: block;\n  width: 100%;\n  height: 100%;\n  contain: strict;\n}\n\nion-modal-controller {\n  display: none;\n}\n\n.modal-backdrop {\n  left: 0;\n  top: 0;\n  position: absolute;\n  z-index: 2;\n  display: block;\n  width: 100%;\n  height: 100%;\n  opacity: .01;\n  transform: translateZ(0);\n}\n\n\@media not all and (min-width: 768px) and (min-height: 600px) {\n  .modal-backdrop {\n    visibility: hidden;\n  }\n}\n\n.modal-backdrop.backdrop-no-tappable {\n  cursor: auto;\n}\n\n.modal-backdrop.hide-backdrop {\n  visibility: hidden;\n}\n\n.modal-wrapper {\n  z-index: 10;\n  height: 100%;\n  contain: strict;\n}\n\n\@media only screen and (min-width: 768px) and (min-height: 600px) {\n  .modal-wrapper {\n    left: calc(50% - (600px/2));\n    top: calc(50% - (500px/2));\n    position: absolute;\n    width: 600px;\n    height: 500px;\n  }\n}\n\n\@media only screen and (min-width: 768px) and (min-height: 768px) {\n  .modal-wrapper {\n    left: calc(50% - (600px/2));\n    top: calc(50% - (600px/2));\n    position: absolute;\n    width: 600px;\n    height: 600px;\n  }\n}\n\n.modal-backdrop-md {\n  background-color: var(--ion-backdrop-md-color, var(--ion-backdrop-color, #000));\n}\n\n.modal-wrapper-md {\n  transform: translate3d(0,  40px,  0);\n  opacity: .01;\n}\n\n\@media only screen and (min-width: 768px) and (min-height: 600px) {\n  .modal-wrapper-md {\n    border-radius: 2px;\n    overflow: hidden;\n    box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);\n  }\n}"; }
    static get styleMode() { return "md"; }
}
const USER_COMPONENT_MODAL_CONTAINER_CLASS = 'modal-wrapper';

let ids$1 = 0;
const modals = new Map();
class ModalController {
    create(opts) {
        // create ionic's wrapping ion-modal component
        const modalElement = document.createElement('ion-modal');
        // give this modal a unique id
        modalElement.modalId = ids$1++;
        // convert the passed in modal options into props
        // that get passed down into the new modal
        Object.assign(modalElement, opts);
        // append the modal element to the document body
        const appRoot = document.querySelector('ion-app') || document.body;
        appRoot.appendChild(modalElement);
        return modalElement.componentOnReady();
    }
    dismiss(data, role, modalId = -1) {
        modalId = modalId >= 0 ? modalId : getHighestId$1();
        const modal = modals.get(modalId);
        if (!modal) {
            return Promise.reject('modal does not exist');
        }
        return modal.dismiss(data, role);
    }
    getTop() {
        return modals.get(getHighestId$1());
    }
    modalWillPresent(ev) {
        modals.set(ev.target.modalId, ev.target);
    }
    modalWillDismiss(ev) {
        modals.delete(ev.target.modalId);
    }
    escapeKeyUp() {
        removeLastModal();
    }
    static get is() { return "ion-modal-controller"; }
    static get properties() { return { "create": { "method": true }, "dismiss": { "method": true }, "getTop": { "method": true } }; }
}
function getHighestId$1() {
    let minimum = -1;
    modals.forEach((_modal, id) => {
        if (id > minimum) {
            minimum = id;
        }
    });
    return minimum;
}
function removeLastModal() {
    const toRemove = modals.get(getHighestId$1());
    return toRemove ? toRemove.dismiss() : Promise.resolve();
}

export { ActionSheet as IonActionSheet, ActionSheetController as IonActionSheetController, Icon as IonIcon, Modal as IonModal, ModalController as IonModalController };
