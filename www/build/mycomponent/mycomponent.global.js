/*! Built with http://stenciljs.com */
(function(appNamespace,publicPath){"use strict";
(function(publicPath){/** @ionic/core global **/
function isCordova() {
    var win = window;
    return !!(win['cordova'] || win['PhoneGap'] || win['phonegap']);
}
var IPAD = 'ipad';
var IPHONE = 'iphone';
var IOS = 'ios';
var WINDOWS_PHONE = ['windows phone'];
// order from most specifc to least specific
var PLATFORM_CONFIGS = [
    {
        name: IPAD,
        isMatch: function (url, userAgent) { return isPlatformMatch(url, userAgent, IPAD, [IPAD], WINDOWS_PHONE); }
    },
    {
        name: IPHONE,
        isMatch: function (url, userAgent) { return isPlatformMatch(url, userAgent, IPHONE, [IPHONE], WINDOWS_PHONE); }
    },
    {
        name: IOS,
        settings: {
            mode: IOS,
            tabsHighlight: false,
            statusbarPadding: isCordova(),
        },
        isMatch: function (url, userAgent) { return isPlatformMatch(url, userAgent, IOS, [IPHONE, IPAD, 'ipod'], WINDOWS_PHONE); }
    },
    {
        name: 'android',
        settings: {
            activator: 'ripple',
            mode: 'md',
        },
        isMatch: function (url, userAgent) { return isPlatformMatch(url, userAgent, 'android', ['android', 'silk'], WINDOWS_PHONE); }
    },
    {
        name: 'core',
        settings: {
            mode: 'md'
        }
    },
];
function detectPlatforms(url, userAgent, platforms, defaultPlatform) {
    // bracket notation to ensure they're not property renamed
    var validPlatforms = platforms.filter(function (p) { return p.isMatch && p.isMatch(url, userAgent); });
    if (!validPlatforms.length) {
        validPlatforms = platforms.filter(function (p) { return p.name === defaultPlatform; });
    }
    return validPlatforms;
}
function isPlatformMatch(url, userAgent, platformName, userAgentAtLeastHas, userAgentMustNotHave) {
    var queryValue = queryParam(url, 'ionicplatform');
    if (queryValue) {
        return queryValue === platformName;
    }
    if (userAgent) {
        userAgent = userAgent.toLowerCase();
        for (var i = 0; i < userAgentAtLeastHas.length; i++) {
            if (userAgent.indexOf(userAgentAtLeastHas[i]) > -1) {
                for (var j = 0; j < userAgentMustNotHave.length; j++) {
                    if (userAgent.indexOf(userAgentMustNotHave[j]) > -1) {
                        return false;
                    }
                }
                return true;
            }
        }
    }
    return false;
}
function queryParam(url, key) {
    key = key.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + key + '=([^&#]*)');
    var results = regex.exec(url);
    return results ? decodeURIComponent(results[1].replace(/\+/g, ' ')) : null;
}
function isDef(v) { return v !== undefined && v !== null; }
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
function createConfigController(configObj, platforms) {
    configObj = configObj || {};
    function get(key, fallback) {
        var queryValue = queryParam(window.location.href, "ionic" + key);
        if (isDef(queryValue)) {
            return configObj[key] = (queryValue === 'true' ? true : queryValue === 'false' ? false : queryValue);
        }
        if (isDef(configObj[key])) {
            return configObj[key];
        }
        var settings = null;
        for (var i = 0; i < platforms.length; i++) {
            settings = platforms[i]['settings'];
            if (settings && isDef(settings[key])) {
                return settings[key];
            }
        }
        return fallback !== undefined ? fallback : null;
    }
    function getBoolean(key, fallback) {
        var val = get(key);
        if (val === null) {
            return fallback !== undefined ? fallback : false;
        }
        if (typeof val === 'string') {
            return val === 'true';
        }
        return !!val;
    }
    function getNumber(key, fallback) {
        var val = parseFloat(get(key));
        return isNaN(val) ? (fallback !== undefined ? fallback : NaN) : val;
    }
    return {
        get: get,
        getBoolean: getBoolean,
        getNumber: getNumber
    };
}
function createDomControllerClient(win, now, rafPending) {
    var readCBs = [];
    var writeCBs = [];
    var raf = function (cb) { return win.requestAnimationFrame(cb); };
    function rafFlush(timeStamp, startTime, cb, err) {
        try {
            startTime = now();
            // ******** DOM READS ****************
            while (cb = readCBs.shift()) {
                cb(timeStamp);
            }
            // ******** DOM WRITES ****************
            while (cb = writeCBs.shift()) {
                cb(timeStamp);
                if ((now() - startTime) > 8) {
                    break;
                }
            }
        }
        catch (e) {
            err = e;
        }
        if (rafPending = (readCBs.length > 0 || writeCBs.length > 0)) {
            raf(rafFlush);
        }
        if (err) {
            console.error(err);
        }
    }
    return {
        read: function (cb) {
            readCBs.push(cb);
            if (!rafPending) {
                rafPending = true;
                raf(rafFlush);
            }
        },
        write: function (cb) {
            writeCBs.push(cb);
            if (!rafPending) {
                rafPending = true;
                raf(rafFlush);
            }
        },
        raf: raf
    };
}
var Ionic = window.Ionic = window.Ionic || {};
// add dom controller, used to coordinate DOM reads and write in order to avoid
// layout thrashing
if (!Context.dom) {
    var now = function () { return window.performance.now(); };
    Context.dom = createDomControllerClient(window, now);
}
// create the Ionic.config from raw config object (if it exists)
// and convert Ionic.config into a ConfigApi that has a get() fn
Ionic.config = Context.config = createConfigController(Ionic.config, detectPlatforms(window.location.href, window.navigator.userAgent, PLATFORM_CONFIGS, 'core'));
// first see if the mode was set as an attribute on <html>
// which could have been set by the user, or by prerendering
// otherwise get the mode via config settings, and fallback to md
Ionic.mode = Context.mode = document.documentElement.getAttribute('mode') || Context.config.get('mode', 'md');
// ensure we've got the mode attribute set on <html>
document.documentElement.setAttribute('mode', Ionic.mode);

})(publicPath);
})("mycomponent","/build/mycomponent/");