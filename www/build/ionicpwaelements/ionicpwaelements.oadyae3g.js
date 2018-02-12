/*! Built with http://stenciljs.com */
(function(Context,appNamespace,hydratedCssClass,publicPath){"use strict";
var s=document.querySelector("script[data-namespace='ionicpwaelements']");if(s){publicPath=s.getAttribute('data-path');}
(function(publicPath){
    /** @ionic/core global **/

    function isCordova() {
        const win = window;
        return !!(win['cordova'] || win['PhoneGap'] || win['phonegap']);
    }

    const IPAD = 'ipad';
    const IPHONE = 'iphone';
    const IOS = 'ios';
    const WINDOWS_PHONE = ['windows phone'];
    // order from most specifc to least specific
    const PLATFORM_CONFIGS = [
        {
            name: IPAD,
            isMatch: (url, userAgent) => isPlatformMatch(url, userAgent, IPAD, [IPAD], WINDOWS_PHONE)
        },
        {
            name: IPHONE,
            isMatch: (url, userAgent) => isPlatformMatch(url, userAgent, IPHONE, [IPHONE], WINDOWS_PHONE)
        },
        {
            name: IOS,
            settings: {
                mode: IOS,
                tabsHighlight: false,
                statusbarPadding: isCordova(),
            },
            isMatch: (url, userAgent) => isPlatformMatch(url, userAgent, IOS, [IPHONE, IPAD, 'ipod'], WINDOWS_PHONE)
        },
        {
            name: 'android',
            settings: {
                activator: 'ripple',
                mode: 'md',
            },
            isMatch: (url, userAgent) => isPlatformMatch(url, userAgent, 'android', ['android', 'silk'], WINDOWS_PHONE)
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
        let validPlatforms = platforms.filter(p => p.isMatch && p.isMatch(url, userAgent));
        if (!validPlatforms.length) {
            validPlatforms = platforms.filter(p => p.name === defaultPlatform);
        }
        return validPlatforms;
    }
    function isPlatformMatch(url, userAgent, platformName, userAgentAtLeastHas, userAgentMustNotHave) {
        const queryValue = queryParam(url, 'ionicplatform');
        if (queryValue) {
            return queryValue === platformName;
        }
        if (userAgent) {
            userAgent = userAgent.toLowerCase();
            for (let i = 0; i < userAgentAtLeastHas.length; i++) {
                if (userAgent.indexOf(userAgentAtLeastHas[i]) > -1) {
                    for (let j = 0; j < userAgentMustNotHave.length; j++) {
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
        const regex = new RegExp('[\\?&]' + key + '=([^&#]*)');
        const results = regex.exec(url);
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
            const queryValue = queryParam(window.location.href, `ionic${key}`);
            if (isDef(queryValue)) {
                return configObj[key] = (queryValue === 'true' ? true : queryValue === 'false' ? false : queryValue);
            }
            if (isDef(configObj[key])) {
                return configObj[key];
            }
            let settings = null;
            for (let i = 0; i < platforms.length; i++) {
                settings = platforms[i]['settings'];
                if (settings && isDef(settings[key])) {
                    return settings[key];
                }
            }
            return fallback !== undefined ? fallback : null;
        }
        function getBoolean(key, fallback) {
            const val = get(key);
            if (val === null) {
                return fallback !== undefined ? fallback : false;
            }
            if (typeof val === 'string') {
                return val === 'true';
            }
            return !!val;
        }
        function getNumber(key, fallback) {
            const val = parseFloat(get(key));
            return isNaN(val) ? (fallback !== undefined ? fallback : NaN) : val;
        }
        return {
            get: get,
            getBoolean: getBoolean,
            getNumber: getNumber
        };
    }

    function createDomControllerClient(win, now, rafPending) {
        const readCBs = [];
        const writeCBs = [];
        const raf = (cb) => win.requestAnimationFrame(cb);
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
            read: (cb) => {
                readCBs.push(cb);
                if (!rafPending) {
                    rafPending = true;
                    raf(rafFlush);
                }
            },
            write: (cb) => {
                writeCBs.push(cb);
                if (!rafPending) {
                    rafPending = true;
                    raf(rafFlush);
                }
            },
            raf: raf
        };
    }

    const Ionic = window.Ionic = window.Ionic || {};
    // add dom controller, used to coordinate DOM reads and write in order to avoid
    // layout thrashing
    if (!Context.dom) {
        const now = () => window.performance.now();
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
(function(n,t,e,o,i){"use strict";function c(n,t,e,o,i,c){let l=t.n+(e||E),f=t[l];if(f||(f=t[l=t.n+E]),f){let e=n.t;if(n.e)if(1===t.encapsulation)e=o.shadowRoot;else for(;o=n.o(o);)if(o.host&&o.host.shadowRoot){e=o.host.shadowRoot;break}const i=e.i=e.i||{};if(!i[l]){c=f.content.cloneNode(!0);const t=e.querySelectorAll("[data-styles]");n.c(e,c,t.length&&t[t.length-1].nextSibling||e.l),i[l]=!0}}}function l(n){return{f:n[0],u:n[1],r:!!n[2],s:!!n[3],a:!!n[4]}}function f(n,t){if(T(t)){if(n===Boolean||3===n)return"false"!==t&&(""===t||!!t);if(n===Number||4===n)return parseFloat(t)}return t}function u(n,t,e){n.d&&((e=n.d.$activeLoading)&&((t=e.indexOf(n))>-1&&e.splice(t,1),!e.length&&n.d.$initLoad()),n.d=null)}function r(n,t,e){let o,i=!1,c=!1;for(var l=arguments.length;l-- >2;)L.push(arguments[l]);for(;L.length;)if((e=L.pop())&&void 0!==e.pop)for(l=e.length;l--;)L.push(e[l]);else"boolean"==typeof e&&(e=null),(c="function"!=typeof n)&&(null==e?e="":"number"==typeof e?e=String(e):"string"!=typeof e&&(c=!1)),c&&i?o[o.length-1].p+=e:void 0===o?o=[c?s(e):e]:o.push(c?s(e):e),i=c;const f=new B;if(f.m=n,f.v=o,t&&(f.b=t,f.y=t.g,f.w=t.ref,t.className&&(t.class=t.className),"object"==typeof t.class)){for(l in t.class)t.class[l]&&L.push(l);t.class=L.join(" "),L.length=0}return f}function s(n){const t=new B;return t.p=n,t}function a(n,t){t.C||(t.C=!0,n.j.add(()=>{t.C=!1,function n(t,e){if(!e.N){const o=!e.O;let i;if(o){const o=e.d;if(o&&!o.$rendered)return void(o.$onRender=o.$onRender||[]).push(()=>{n(t,e)});(function o(n,t,e){try{e=n.x(t).k,t.O=new e,function o(n,t,e,i,c,l){for(l in i.S=e,e.T=e.T||{},(c=Object.assign({color:{type:String}},t.properties)).mode={type:String},c)p(n,c[l],e,i,l)}(n,e,t,t.O),function i(n,t,e){t&&t.forEach(t=>{e[t.method]={emit:o=>{n.M(e.S,t.name,{bubbles:t.bubbles,composed:t.composed,cancelable:t.cancelable,detail:o})}}})}(n,e.events,t.O);try{(function c(n,t){const e=n.A;if(e){for(t=0;t<e.length;t+=2)n.O[e[t]](e[t+1]);n.A=null}})(t)}catch(e){n.P(e,2,t)}}catch(e){t.O={},n.P(e,7,t,!0)}})(t,e)}i&&i.then?i.then(()=>d(t,e,o)):d(t,e,o)}}(n,t)}))}function d(n,t,e){(function o(n,t,e,i){try{const o=t.O,c=e.k.host;if(o.render||o.hostData||c){n.B=!0;const c=o.render&&o.render();let l;n.B=!1;const f=t.L||new B;f.R=t,t.L=n.render(f,r(null,l,c),i,t.q,e.k.encapsulation)}n.D(n.H,e,o.mode,t),t.$rendered=!0,t.$onRender&&(t.$onRender.forEach(n=>n()),t.$onRender=null)}catch(e){n.B=!1,n.P(e,8,t,!0)}})(n,t,n.x(t),!e);try{e&&t.$initLoad()}catch(e){n.P(e,6,t,!0)}}function p(n,t,e,o,i){if(t.type||t.state){if(!t.state){if(t.attr&&(void 0===e.T[i]||""===e.T[i])){const o=n.H.z(e,t.attr);null!=o&&(e.T[i]=f(t.type,o))}e.hasOwnProperty(i)&&(void 0===e.T[i]&&(e.T[i]=e[i]),delete e[i])}o.hasOwnProperty(i)&&void 0===e.T[i]&&(e.T[i]=o[i]),t.watchCallbacks&&(e.T[R+i]=t.watchCallbacks.slice()),b(o,i,function c(n){return(n=this.S)&&n.T&&n.T[i]},function l(e,o){(o=this.S)&&(t.state||t.mutable)&&m(n,o,i,e)})}else if(t.elementRef)v(o,i,e);else if(t.method)v(e,i,o[i].bind(o));else if(t.context){const c=n.F(t.context);void 0!==c&&v(o,i,c.I&&c.I(e)||c)}}function m(n,t,e,o,i,c,l){o!==(i=t.T=t.T||{})[e]&&(i[e]=o,t.O&&(i[R+e],!n.B&&t.$rendered&&a(n,t)))}function v(n,t,e){Object.defineProperty(n,t,{configurable:!0,value:e})}function b(n,t,e,o){Object.defineProperty(n,t,{configurable:!0,get:e,set:o})}function h(n,t,e,o,i){const c=11===e.R.nodeType&&e.R.host?e.R.host:e.R,l=t&&t.b||k,f=e.b||k;for(i in l)f&&null!=f[i]||null==l[i]||y(n,c,i,l[i],void 0,o);for(i in f)i in l&&f[i]===("value"===i||"checked"===i?c[i]:l[i])||y(n,c,i,l[i],f[i],o)}function y(n,t,e,o,i,c,l,f){if("class"!==e||c)if("style"===e){for(l in o=o||k,i=i||k,o)i[l]||(t.style[l]="");for(l in i)i[l]!==o[l]&&(t.style[l]=i[l])}else if("o"!==e[0]||"n"!==e[1]||e in t)if("list"!==e&&"type"!==e&&!c&&(e in t||-1!==["object","function"].indexOf(typeof i)&&null!==i)){const o=n.x(t);o&&o.W&&o.W[e]?g(t,e,i):"ref"!==e&&(g(t,e,null==i?"":i),null!=i&&!1!==i||t.removeAttribute(e))}else null!=i&&(l=e!==(e=e.replace(/^xlink\:?/,"")),1!==q[e]||i&&"false"!==i?"function"!=typeof i&&(l?t.setAttributeNS(D,A(e),i):t.setAttribute(e,i)):l?t.removeAttributeNS(D,A(e)):t.removeAttribute(e));else e=A(e.substring(2)),i?i!==o&&n.H.G(t,e,i):n.H.J(t,e);else if(o!==i){const n=null==o||""===o?x:o.trim().split(/\s+/),e=null==i||""===i?x:i.trim().split(/\s+/);let c=null==t.className||""===t.className?x:t.className.trim().split(/\s+/);for(l=0,f=n.length;l<f;l++)-1===e.indexOf(n[l])&&(c=c.filter(t=>t!==n[l]));for(l=0,f=e.length;l<f;l++)-1===n.indexOf(e[l])&&(c=[...c,e[l]]);t.className=c.join(" ")}}function g(n,t,e){try{n[t]=e}catch(n){}}function $(n,t){function e(o,i,c){let l=0;if("function"==typeof o.m&&(o=o.m(Object.assign({},o.b,{K:o.v}))),!r&&"slot"===o.m){if(u){s&&t.Q(i,s+"-slot","");const e=o.b&&o.b.name;let c;if(c=T(e)?u.U&&u.U[e]:u.V,T(c)){for(n.X=!0;l<c.length;l++)t.Y(c[l]),t.Z(i,c[l]);n.X=!1}}return null}if(T(o.p))o.R=t._(o.p);else{const i=o.R=H||"svg"===o.m?t.nn("http://www.w3.org/2000/svg",o.m):t.tn(o.m);H="svg"===o.m||"foreignObject"!==o.m&&H,h(n,null,o,H),null!==s&&i.en!==s&&t.Q(i,i.en=s,"");const c=o.v;if(c){let n;for(;l<c.length;++l)(n=e(c[l],i))&&t.Z(i,n)}"svg"===o.m&&(H=!1)}return o.R}function o(n,o,i,c,l,f,u){const r=n.$defaultHolder&&t.o(n.$defaultHolder)||n;for(;c<=l;++c)u=i[c],T(u)&&(f=T(u.p)?t._(u.p):e(u,n),T(f)&&(u.R=f,t.c(r,f,o)))}function i(n,e,o){for(;e<=o;++e)T(n[e])&&t.Y(n[e].R)}function c(n,t){return n.m===t.m&&n.y===t.y}function l(n,t,e){const o={};let i,c,l;for(i=t;i<=e;++i)null!=(l=n[i])&&void 0!==(c=l.y)&&(o.on=i);return o}let f,u,r,s;return function a(d,p,m,v,b,y){return f=m,u=v,s="scoped"===b||"shadow"===b&&!t.e?"data-"+t.in(d.R):null,r="shadow"===b&&t.e,f||(r?d.R=t.cn(d.R,{mode:"open"}):s&&t.Q(d.R,s+"-host","")),function f(u,r){const s=r.R=u.R,a=u.v,d=r.v;if(H=r.R&&null!=r.R.parentElement&&void 0!==r.R.ln,H="svg"===r.m||"foreignObject"!==r.m&&H,M(r.p))"slot"!==r.m&&h(n,u,r,H),T(a)&&T(d)?function p(n,u,r){let s,a,d,p,m=0,v=0,b=u.length-1,h=u[0],y=u[b],g=r.length-1,$=r[0],w=r[g];for(;m<=b&&v<=g;)null==h?h=u[++m]:null==y?y=u[--b]:null==$?$=r[++v]:null==w?w=r[--g]:c(h,$)?(f(h,$),h=u[++m],$=r[++v]):c(y,w)?(f(y,w),y=u[--b],w=r[--g]):c(h,w)?(f(h,w),t.c(n,h.R,t.fn(y.R)),h=u[++m],w=r[--g]):c(y,$)?(f(y,$),t.c(n,y.R,h.R),y=u[--b],$=r[++v]):(M(s)&&(s=l(u,m,b)),a=s[$.y],M(a)?(p=e($,n),$=r[++v]):((d=u[a]).m!==$.m?p=e($,n):(f(d,$),u[a]=void 0,p=d.R),$=r[++v]),p&&t.c(h.R&&h.R.parentNode||n,p,h.R));m>b?o(n,null==r[g+1]?null:r[g+1].R,r,v,g):v>g&&i(u,m,b)}(s,a,d):T(d)?(T(u.p)&&t.un(s,""),o(s,null,d,0,d.length-1)):T(a)&&i(a,0,a.length-1);else if(s.q&&s.q.V){const n=s.q.V[0].parentElement;t.un(n,r.p),s.q.V=[n.childNodes[0]]}else u.p!==r.p&&t.un(s,r.p);"svg"===r.m&&H&&(H=!1)}(d,p),p}}function w(n,t){n&&(n.w&&n.w(t?null:n.R),n.v&&n.v.forEach(n=>{w(n,t)}))}function C(n,t,e,o,i){const c=n.rn(t);let l,f,u,r;if(i&&1===c){(f=n.z(t,O))&&(u=f.split("."))[0]===o&&((r=new B).m=n.in(r.R=t),e.v||(e.v=[]),e.v[u[1]]=r,e=r,i=""!==u[2]);for(let c=0;c<t.childNodes.length;c++)C(n,t.childNodes[c],e,o,i)}else 3===c&&(l=t.previousSibling)&&8===n.rn(l)&&"s"===(u=n.sn(l).split("."))[0]&&u[1]===o&&((r=s(n.sn(t))).R=t,e.v||(e.v=[]),e.v[u[2]]=r)}function j(n,t,e,o){return function(){const i=arguments;return function c(n,t,e){return new Promise(o=>{let i=t[e];i||(i=n.an.querySelector(e)),i||(i=t[e]=n.tn(e),n.Z(n.an,i)),i.componentOnReady(o)})}(n,t,e).then(n=>n[o].apply(n,i))}}const N="data-ssrv",O="data-ssrc",E="$",k={},x=[],S={enter:13,escape:27,space:32,tab:9,left:37,up:38,right:39,down:40},T=n=>void 0!==n&&null!==n,M=n=>void 0===n||null===n,A=n=>n.toLowerCase(),P=()=>{};class B{}const L=[],R="wc-",q={allowfullscreen:1,async:1,autofocus:1,autoplay:1,checked:1,controls:1,disabled:1,enabled:1,formnovalidate:1,hidden:1,multiple:1,noresize:1,readonly:1,required:1,selected:1,spellcheck:1},D="http://www.w3.org/1999/xlink";let H=!1;const z=n[o]=n[o]||{};{const o=function F(t,e,o,i,s,d){const p={html:{}},h={},y=function g(n,t){const e=new WeakMap,o={dn:t.documentElement,t:t.head,an:t.body,pn:!1,rn:n=>n.nodeType,tn:n=>t.createElement(n),nn:(n,e)=>t.createElementNS(n,e),_:n=>t.createTextNode(n),mn:n=>t.createComment(n),c:(n,t,e)=>n.insertBefore(t,e),Y:n=>n.remove(),Z:(n,t)=>n.appendChild(t),vn:n=>n.childNodes,o:n=>n.parentNode,fn:n=>n.nextSibling,in:n=>A(n.tagName),sn:n=>n.textContent,un:(n,t)=>n.textContent=t,z:(n,t)=>n.getAttribute(t),Q:(n,t,e)=>n.setAttribute(t,e),bn:(n,t,e,o)=>n.setAttributeNS(t,e,o),hn:(n,t)=>n.removeAttribute(t),yn:(e,i)=>"child"===i?e.firstElementChild:"parent"===i?o.gn(e):"body"===i?o.an:"document"===i?t:"window"===i?n:e,G:(n,t,i,c,l,f,u,r)=>{const s=t;let a=n,d=e.get(n);if(d&&d[s]&&d[s](),"string"==typeof f?a=o.yn(n,f):"object"==typeof f?a=f:(r=t.split(":")).length>1&&(a=o.yn(n,r[0]),t=r[1]),!a)return;let p=i;(r=t.split(".")).length>1&&(t=r[0],p=(n=>{n.keyCode===S[r[1]]&&i(n)})),u=o.pn?{capture:!!c,passive:!!l}:!!c,a.addEventListener(t,p,u),d||e.set(n,d={}),d[s]=(()=>{a&&a.removeEventListener(t,p,u),d[s]=null})},J:(n,t)=>{const o=e.get(n);o&&(t?o[t]&&o[t]():(Object.keys(o).forEach(n=>{o[n]&&o[n]()}),e.delete(n)))},cn:(n,t)=>n.attachShadow(t)};o.e=!!o.dn.attachShadow,o.$n=((t,e,o)=>t&&t.dispatchEvent(new n.CustomEvent(e,o)));try{n.addEventListener("e",null,Object.defineProperty({},"passive",{get:()=>o.pn=!0}))}catch(n){}return o.gn=((n,t)=>(t=o.o(n))&&11===o.rn(t)?t.host:t),o}(o,i);t.isServer=t.isPrerender=!(t.isClient=!0),t.window=o,t.location=o.location,t.document=i,t.publicPath=s,t.enableListener=((n,t,e,o,i)=>(function c(n,t,e,o,i,l){if(t){const c=t.S,f=n.x(c);if(f&&f.wn)if(o){const o=f.wn.find(n=>n.f===e);o&&n.H.G(c,e,n=>t[o.u](n),o.a,void 0===l?o.s:!!l,i)}else n.H.J(c,e)}})(k,n,t,e,o,i)),t.emit=((n,e,o)=>y.$n(n,t.eventNameFn?t.eventNameFn(e):e,o)),e.h=r,e.Context=t;const O=o.$definedCmps=o.$definedCmps||{},k={Cn:function x(n,e){e.mode||(e.mode=y.z(e,"mode")||t.mode),y.z(e,N)||function o(n,t){return n&&1===t.encapsulation}(y.e,n)||function i(n,t,e,o){let i,c,l;t.$defaultHolder||n.c(t,t.$defaultHolder=n.mn(""),e[0]);let f=0;for(;f<e.length;f++)o=e[f],1===n.rn(o)&&null!=(i=n.z(o,"slot"))?(l=l||{})[i]?l[i].push(o):l[i]=[o]:c?c.push(o):c=[o];t.q={V:c,U:l}}(y,e,e.childNodes),y.e||1!==n.encapsulation||(e.shadowRoot=e)},H:y,jn:function T(n,t){if(!O[n.n]){O[n.n]=!0,function e(n,t,o,i){o.connectedCallback=function(){(function e(n,t,o){o.$connected||(o.$connected=!0,o.N=null,function i(n,t){const e=n.x(t);e.wn&&e.wn.forEach(e=>{e.r||n.H.G(t,e.f,function o(n,t){return e=>{n.O?n.O[t](e):(n.A=n.A||[]).push(t,e)}}(t,e.u),e.a,e.s)})}(n,o),function c(n,t,e){for(e=t;e=n.H.gn(e);)if(n.Nn(e)){e.On||(t.d=e,(e.$activeLoading=e.$activeLoading||[]).push(t));break}}(n,o),n.j.add(()=>{n.Cn(t,o),n.loadBundle(t,o.mode,()=>a(n,o))},3))})(n,t,this)},o.attributeChangedCallback=function(n,e,o){(function i(n,t,e,o,c,l){if(o!==c&&n)for(l in e=A(e),n)if(n[l].En===e){t[l]=f(n[l].kn,c);break}})(t.W,this,n,e,o)},o.disconnectedCallback=function(){(function t(n,e){!n.X&&function o(n,t){for(;t;){if(!n.o(t))return 9!==n.rn(t);t=n.o(t)}}(n.H,e)&&(e.N=!0,u(e),w(e.L,!0),n.H.J(e),e.q&&(e.q=e.q.V=e.q.U=null),e.O&&(e.O.componentDidUnload&&e.O.componentDidUnload(),e.O=e.O.S=null),e.$activeLoading=e.$connected=e.$defaultHolder=e.xn=e.T=e.L=e.d=e.On=e.C=e.Sn=null)})(n,this)},o.componentOnReady=function(n,t){return n||(t=new Promise(t=>n=t)),function e(n,t){n.N||(n.On?t(n):(n.Tn=n.Tn||[]).push(t))}(this,n),t},o.$initLoad=function(){(function t(n,e,o){if(!e.On&&e.O&&!e.N&&(!e.$activeLoading||!e.$activeLoading.length)){e.$activeLoading=null,e.On=!0;try{w(e.L),e.Tn&&(e.Tn.forEach(n=>n(e)),e.Tn=null),e.O.componentDidLoad&&e.O.componentDidLoad()}catch(t){n.P(t,4,e)}e.classList.add(o),u(e)}})(n,this,i)},o.Mn=function(){a(n,this)},function c(n,t,e){t&&Object.keys(t).forEach(o=>{const i=t[o].An;1===i||2===i?b(e,o,function n(){return(this.T=this.T||{})[o]},function t(e){m(n,this,o,e)}):6===i&&v(e,o,P)})}(n,t.W,o)}(k,n,t.prototype,d);{const e=[];for(const t in n.W)n.W[t].En&&e.push(n.W[t].En);t.observedAttributes=e}o.customElements.define(n.n,t)}},M:t.emit,x:n=>p[y.in(n)],F:n=>t[n],isClient:!0,Nn:n=>!(!O[y.in(n)]&&!k.x(n)),loadBundle:function M(n,t,e){if(n.k)e();else{const o="string"==typeof n.Pn?n.Pn:n.Pn[t],i=s+o+(function o(n,t){return 2===t.encapsulation||1===t.encapsulation&&!n}(y.e,n)?".sc":"")+".js";import(i).then(t=>{try{n.k=t[(n=>A(n).split("-").map(n=>n.charAt(0).toUpperCase()+n.slice(1)).join(""))(n.n)],function o(n,t,e){const o=e.style;if(o){const i=e.is+(e.styleMode||E);if(!t[i]){const e=n.tn("template");t[i]=e,e.innerHTML=`<style>${o}</style>`,n.Z(n.t,e)}}}(y,n,n.k)}catch(t){n.k=class{}}e()}).catch(n=>void 0)}},P:(n,t,e)=>void 0,Bn:n=>(function t(n,e,o){return{create:j(n,e,o,"create"),componentOnReady:j(n,e,o,"componentOnReady")}})(y,h,n),j:function L(t,e,o){function i(){for(;s.length>0;)s.shift()();e=!1}function c(n){for(n=f(),i();a.length>0&&f()-n<40;)a.shift()();(o=a.length>0)&&u(l)}function l(n){for(i(),n=4+f();a.length>0&&f()<n;)a.shift()();(o=a.length>0)&&u(c)}const f=()=>t.performance.now(),u=t=>n.requestAnimationFrame(t),r=Promise.resolve(),s=[],a=[];return{add:(n,t)=>{3===t?(s.push(n),e||(e=!0,r.then(i))):(a.push(n),o||(o=!0,u(c)))}}}(o),Ln:n=>(n||[]).map(n=>(function t(n,e,o,i){const c={n:n[0],W:{color:{En:"color"}}};c.Pn=n[1];const f=n[3];if(f)for(o=0;o<f.length;o++)i=f[o],c.W[i[0]]={An:i[1],En:"string"==typeof i[2]?i[2]:i[2]?i[0]:0,kn:i[3]};return c.encapsulation=n[4],n[5]&&(c.wn=n[5].map(l)),e[c.n]=c})(n,p))};k.render=$(k,y);const R=y.dn;return R.$rendered=!0,R.$activeLoading=[],R.$initLoad=(()=>R.On=!0),function q(n,t){const e=t.querySelectorAll(`[${N}]`),o=e.length;let i,c,l,f,u,r;if(t.On=o>0)for(f=0;f<o;f++)for(i=e[f],c=n.z(i,N),(l=i.L=new B).m=n.in(l.R=i),u=0,r=i.childNodes.length;u<r;u++)C(n,i.childNodes[u],l,c,!0)}(y,R),k.D=c,k}(e,z,n,t,i,hydratedCssClass);o.Ln(z.components).forEach(n=>o.jn(n,class extends HTMLElement{}))}})(window,document,Context,appNamespace,publicPath);
})({},"ionicpwaelements","hydrated","/build/ionicpwaelements/");