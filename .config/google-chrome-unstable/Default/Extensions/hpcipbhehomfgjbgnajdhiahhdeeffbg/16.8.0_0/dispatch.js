var dispatch={workers:[],extend:function(t,e){if(e)for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);return t},on:function(t,e,r){if("string"!=typeof t){for(var n=0;n<t.length;n++){var i=t[n];this.on(i,e,r)}return this}var a=this._callbacks||(this._callbacks={});return e?(a[t]={context:r,callback:e},void 0===this._listenerInitialized&&(chrome.runtime.onMessage.addListener(function(t,e,r){dispatch.processMessage(t,e,function(t,r){dispatch.trigger(e.tab,t,dispatch.extend({action:t},r))},a)}),this._listenerInitialized=!0),this):this},processMessage:function(t,e,r,n){for(var i in n)if(n.hasOwnProperty(i)&&i==t.action){var a=n[i];a.callback.apply(a.context||this,arguments);break}},trigger:function(t,e,r,n){t?"[object Array]"!==Object.prototype.toString.call(t)&&(t=[t]):t=[null];for(var i=0;i<t.length;i++){var a=t[i];if(!a||a==markupPageTab||a.url&&0!=a.url.indexOf("chrome")){if("undefined"!=typeof chrome){var o=navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);parseInt(o[2],10)>=41?chrome.tabs.sendMessage(a?a.id:null,this.extend({action:e},r),null,n):chrome.tabs.sendMessage(a?a.id:null,this.extend({action:e},r),n)}}else;}return this},triggerOnActiveTab:function(t,e){chrome.tabs.query({currentWindow:!0,active:!0,windowType:"normal"},function(r){0==r.length?chrome.tabs.query({active:!0,windowType:"normal"},function(r){dispatch.trigger(r,t,e)}):dispatch.trigger(r,t,e)})},triggerOnAllTabs:function(t,e){chrome.windows.getAll({populate:!0},function(r){for(var n=0;n<r.length;n++){var i=r[n];"normal"==i.type&&dispatch.trigger(i.tabs,t,e)}})}};