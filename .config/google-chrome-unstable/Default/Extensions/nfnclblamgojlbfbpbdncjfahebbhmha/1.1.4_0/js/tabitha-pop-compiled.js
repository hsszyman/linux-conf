var noteDuration=3500,isRetrieve=!1,highTabs=50;function updateCounter(a){a=chrome.extension.getBackgroundPage().allTabsCount-a;$("#tabCount").html(a);ensureText(a)}
function ensureText(a){var b=1===a?"Tab Open":"Tabs Open";$("#tabsOpenText").html(b);b=document.getElementById("tabCount");a>=highTabs?($("#tabCount").css("color","#dd4b39"),b.title="What a mess! Don't worry, I'm here."):a>=highTabs/2?($("#tabCount").css("color","#e67e22"),b.title="Busy, busy, busy."):1===a?($("#tabCount").css("color","#43a541"),b.title="Well?"):($("#tabCount").css("color","#43a541"),b.title="All good.")}
function notifyUser(a){$(".notifier").html(a).slideDown();setTimeout(function(){$(".notifier").slideUp()},noteDuration)}function showTip(a){$(".tipNotifier").html(a).slideDown();setTimeout(function(){$(".tipNotifier").slideUp()},4E3)}function getAllTabs(a){chrome.tabs.query({currentWindow:!0},function(b){a(b)})}
function sortTabs(a){chrome.tabs.query({currentWindow:!0},function(b){b.sort(function(b,d){if("title"==a)var e=b[a].toLowerCase(),f=d[a].toLowerCase();else e=b[a],f=d[a];var g=1;"ascending"===chrome.extension.getBackgroundPage().sortStyle&&(g=-g);return e===f?0:e>f?g:-g});refreshContainer(b);b.forEach(function(a){chrome.tabs.move(a.id,{index:-1})})})}
function bindHighlight(a){$(function(){var b=[],c=$(a),d=c.find(".canHighlight"),e;c.on("click",".canHighlight",function(a){var c=$(this);if(a.shiftKey){if(0<b.length){if(c[0]==b[0])return b=c,d.removeClass("lastSelected highlighted"),c.addClass("lastSelected highlighted"),!1;a=0<c.nextAll(".lastSelected").length?"down":"up";e||(e=a);a="down"==a?c.nextUntil(b,".canHighlight"):b.nextUntil(c,".canHighlight");d.removeClass("highlighted");a.addClass("highlighted");b.addClass("highlighted")}else b=c,c.addClass("lastSelected"),
d.removeClass("highlighted");c.addClass("highlighted")}else a.ctrlKey?(d.removeClass("lastSelected"),b=c,c.hasClass("highlighted")?(c.removeClass("highlighted"),c.addClass("lastSelected")):(d.removeClass("lastSelected"),c.addClass("lastSelected highlighted"))):(d.removeClass("lastSelected highlighted"),c.addClass("lastSelected highlighted"),b=c)})})}function checkURL(a){return"undefined"===typeof a||/^chrome/.test(a)||/^about:blank/.test(a)?!0:!1}
function updateCounterAndNotify(a,b){updateCounter(a);notifyUser(b+a+(1===a?" tab.":" tabs."))}
function runProcess(a){var b=("restore"===a||"purge"===a?$("#retrieveContainer"):$("#tabContainer")).find(".highlighted"),c=b.length;$("#settings-menu").slideUp();if(!/^sort-/.test(a)&&"retrieve"!==a&&!c)return"combine"===a?getAllTabs(function(a){checkWindowOpen(a,"tabitha-comb")?a.forEach(function(a){/^chrome-extension:.*.tabitha-comb.html$/.test(a.url)&&chrome.tabs.update(a.id,{active:!0})}):(chrome.tabs.create({url:chrome.extension.getURL("tabitha-comb.html"),active:!1},function(a){document.getElementById("tabContainer").appendChild(pushTab({id:a.id,
url:a.url,title:"Combined Tabs - Tabitha",favIconUrl:a.favIconUrl,pinned:a.pinned}))}),updateCounter(-1))}):showTip("Select multiple tabs by holding CTRL (Mac: &#8984;) or SHIFT while you click!"),!1;1===c&&showTip("Select multiple tabs by holding CTRL (Mac: &#8984;) or SHIFT while you click!");if("sort-title"===a)sortTabs("title"),notifyUser("Sorted alphabetically.");else if("sort-age"===a)sortTabs("id"),notifyUser("Sorted by age.");else if("sort-url"===a)sortTabs("url"),notifyUser("Grouped by website.");
else if("bookmark"===a){var b=b.not(".noCombine"),d=0;b.each(function(a){a=$(this).attr("tab-title");var b=$(this).attr("tab-url");pushBookmark(a,b);d++});d?notifyUser("Bookmarked "+d+(1===d?" tab.":" tabs.")):notifyUser("Can't bookmark that<br> selection!")}else if("close"===a){var e=0;b.each(function(a){a=parseInt($(this).attr("tab-id"));chrome.tabs.remove(a);$(this).remove();e++});updateCounterAndNotify(e,"Closed ")}else if("bclose"===a){var b=b.not(".noCombine"),f=0;b.each(function(a){a=$(this).attr("tab-title");
var b=$(this).attr("tab-url"),c=parseInt($(this).attr("tab-id"));pushBookmark(a,b);chrome.tabs.remove(c);$(this).remove();f++});f&&updateCounterAndNotify(f,"Bookmarked &<br> closed ")}else if("restore"===a){a=$("#retrieveContainer").find(".highlighted");var g=0;a.each(function(a){g++;a=$(this).attr("tab-url");var b=parseInt($(this).attr("tab-id"));chrome.tabs.create({url:a,active:!1});chrome.runtime.sendMessage({command:"remove",id:b});$(this).remove()});a=$("#retrieveCount").html();$("#retrieveCount").html(a-
g);updateCounter(-g);notifyUser("Restored "+g+" tabs.")}else if("purge"===a){a=$("#retrieveContainer").find(".highlighted");var h=0;a.each(function(a){h++;a=parseInt($(this).attr("tab-id"));chrome.runtime.sendMessage({command:"remove",id:a});$(this).remove()});a=$("#retrieveCount").html();$("#retrieveCount").html(a-h);notifyUser("Purged "+h+" tabs.")}else if("reload"===a){a=$("#tabContainer").find(".highlighted:not(.noCombine)");var l=0;a.each(function(a){a=parseInt($(this).attr("tab-id"));l++;chrome.tabs.reload(a)});
l&&notifyUser("Reloaded "+(1===l?l+" tab.":l+" tabs."))}else if("pin"===a){var m=0;b.each(function(a){a=parseInt($(this).attr("tab-id"));var b="true"==$(this).attr("pinned");$(this).attr({pinned:!b});$(this).toggleClass("pinned");var c=$("#tabContainer").find(".pinned").length;b?pushToIndex(c+1,$(this)):(pushToIndex(c-1,$(this)),m++);chrome.tabs.update(a,{pinned:!b})});a=1===m?m+" tab.":m+" tabs.";var c=b.length-m,p=1===c?c+" tab.":c+" tabs.";0<c&&0<m?notifyUser("Pinned "+a+"<br>Unpinned "+p):0<m?
notifyUser("Pinned "+a):0<c&&notifyUser("Unpinned "+p)}else if("retrieve"===a)if(c=localStorage.getItem("retain"),c=JSON.parse(c),a=[],a=$.map(c,function(a,b){return a}),a.sort(function(a,b){var c=a.timeClosed,d=b.timeClosed;return c===d?0:c>d?-1:1}),c=a.length,0===c)notifyUser("Nothing to recover.");else{$("#tabContainer").html("");$("#retrieveContainer").html("");$("#retrieveCount").html(c);$(".back").css("display","block");switchMode();var q=document.getElementById("retrieveContainer");$.each(a,
function(a,b){if(!b||"undefined"===typeof b)return!0;var c=b.url,d=b.title,e=b.favicon,g=b.id,k=document.createElement("div");k.setAttribute("class","tabBox canHighlight");k.setAttribute("tab-id",g);k.setAttribute("tab-title",d);k.setAttribute("tab-url",c);k.setAttribute("title",d+"\n\n"+c);var f="",f=/[^\u0000-\u007F]/.test(d)?d.substring(0,25)+" &#8230":35<=d.length?d.substring(0,35)+" &#8230":d,d="default.png";"undefined"===typeof e||checkURL(c)||(d=e);f=f.replace(/[<>]/g,"");k.innerHTML="<img class='boxIcon' src='"+
d+"' width='16' height='16'>"+f;e=document.createElement("div");e.setAttribute("class","tabControls");var l=document.createElement("img");l.setAttribute("class","tabButton tabClose");l.setAttribute("src","glyph-close1.png");l.setAttribute("title","Permanently delete");$(l).hover(function(){$(this).attr("src","glyph-close1h.png")},function(){$(this).attr("src","glyph-close1.png")});var h=document.createElement("img");h.setAttribute("class","tabButton tabClose");h.setAttribute("src","glyph-recover.png");
h.setAttribute("title","Recover");$(h).hover(function(){$(this).attr("src","glyph-recoverh.png")},function(){$(this).attr("src","glyph-recover.png")});e.appendChild(l);e.appendChild(h);k.appendChild(e);$(function(){$(k).hover(function(){$(this).addClass("hovered");$(".tabControls",this).css("visibility","visible")},function(){$(this).removeClass("hovered");$(".tabControls",this).css("visibility","hidden")})});$(function(){$(l).on("click",function(a){chrome.runtime.sendMessage({command:"remove",id:g});
notifyUser("Purged 1 tab.");a=$("#retrieveCount").html();$("#retrieveCount").html(a-1);$(k).remove()});$(k).on("mouseup",function(a){2==a.which&&(chrome.runtime.sendMessage({command:"remove",id:g}),a=$("#retrieveCount").html(),$("#retrieveCount").html(a-1),$(k).remove())})});$(function(){$(h).on("click",function(a){chrome.runtime.sendMessage({command:"remove",id:g});chrome.tabs.create({url:c,active:!1});notifyUser("Recovered 1 tab.");a=$("#retrieveCount").html();$("#retrieveCount").html(a-1);updateCounter(-1);
$(k).remove()})});q.appendChild(k)});bindHighlight("#retrieveContainer")}else if("combine"===a){var b=b.not(".noCombine"),n=[];b.each(function(a){var c=parseInt($(this).attr("tab-id")),d=$(this).attr("tab-fav"),e=$(this).attr("tab-title"),g=$(this).attr("tab-url");n.push([d,e,g]);console.log(n);$(this).remove();setTimeout(function(){chrome.tabs.remove(c)},500);var f=b.length;a===f-1&&(a=JSON.parse(localStorage.getItem("combinedTabs")),a[new Date]={title:"Untitled",tabData:n},localStorage.setItem("combinedTabs",
JSON.stringify(a)),getAllTabs(function(a){checkWindowOpen(a,"tabitha-comb")?(chrome.runtime.sendMessage({command:"append"}),updateCounter(f)):(chrome.tabs.create({url:chrome.extension.getURL("tabitha-comb.html"),active:!1},function(a){document.getElementById("tabContainer").appendChild(pushTab({id:a.id,url:a.url,title:"Combined Tabs - Tabitha",favIconUrl:a.favIconUrl,pinned:a.pinned}))}),updateCounter(f-1))}),notifyUser("Combined "+f+" tabs."))})}return!0}
function refreshContainer(a){$("#tabContainer").html("");addTabs(a);bindHighlight("#tabContainer")}function switchMode(){var a=isRetrieve?"block":"none";$("#tabContainer").css("display",a);$("#tabInfoContainer").css("display",a);a=isRetrieve?"none":"block";$("#retrieveContainer").css("display",a);$("#retrieveInfo").css("display",a);isRetrieve=!isRetrieve}
function addTabs(a){for(var b=document.getElementById("tabContainer"),c=0;c<a.length;c++)b.appendChild(pushTab(a[c]));bindHighlight("#tabContainer")}
function pushTab(a){var b=document.createElement("div");b.setAttribute("tab-id",a.id);b.setAttribute("tab-title",a.title);b.setAttribute("tab-fav",a.favIconUrl);b.setAttribute("tab-url",a.url);b.setAttribute("pinned",a.pinned);$(b).addClass("tabBox canHighlight");a.pinned&&$(b).addClass("pinned");checkURL(a.url)&&$(b).addClass("noCombine");var c=a.title+"\n\n"+a.url;a.active&&($(b).addClass("activeTab"),$(b).css("color","#FFFFFF"),c="This tab is active.\n\n"+c);$(b).prop("title",c);c=a.title.replace(/[<>]/g,
"");/[^\u0000-\u007F]/.test(c)?c=c.substring(0,20)+" &#8230":35<=c.length&&(c=c.substring(0,35)+" &#8230");var d="default.png";"undefined"===typeof a.favIconUrl||/^chrome/.test(a.url)||(d=a.favIconUrl);if(/^chrome-extension:.*.comb.html$/.test(a.url)||/^chrome-extension:.*.tabitha-opt.html$/.test(a.url))d="tab16.png";b.innerHTML="<img class='boxIcon' src='"+d+"' width='16' height='16'>"+c;c=document.createElement("div");c.setAttribute("class","tabControls");var e=document.createElement("img");e.setAttribute("class",
"tabButton tabClose");e.setAttribute("src","glyph-close.png");e.setAttribute("title","Close");$(e).hover(function(){$(this).attr("src","glyph-closeh.png")},function(){$(this).attr("src","glyph-close.png")});var f=document.createElement("img");f.setAttribute("class","tabButton tabSelect");f.setAttribute("src","glyph-goto.png");f.setAttribute("title","Select");$(f).hover(function(){$(this).attr("src","glyph-gotoh.png")},function(){$(this).attr("src","glyph-goto.png")});var g=document.createElement("img");
g.setAttribute("class","tabButton tabPin");g.setAttribute("src","glyph-pin.png");g.setAttribute("title","Pin");$(g).hover(function(){$(this).attr("src","glyph-pinh.png")},function(){$(this).attr("src","glyph-pin.png")});var h=document.createElement("img");h.setAttribute("class","tabButton tabBookmark");h.setAttribute("src","glyph-book.png");h.setAttribute("title","Bookmark");$(h).hover(function(){$(this).attr("src","glyph-bookh.png")},function(){$(this).attr("src","glyph-book.png")});c.appendChild(e);
c.appendChild(h);c.appendChild(g);a.active||c.appendChild(f);b.appendChild(c);$(function(){$(b).hover(function(){$(this).addClass("hovered");$(".tabControls",this).css("visibility","visible")},function(){$(this).removeClass("hovered");$(".tabControls",this).css("visibility","hidden")})});$(function(){$(f).on("click",function(){chrome.tabs.update(a.id,{selected:!0})})});$(function(){$(g).on("click",function(){var c="true"==$(b).attr("pinned");$(b).attr({pinned:!c});$(b).toggleClass("pinned");chrome.tabs.update(a.id,
{pinned:!c});var d=$("#tabContainer").find(".pinned").length;c?pushToIndex(d+1,$(b)):pushToIndex(d-1,$(b))})});$(function(){$(h).on("click",function(){pushBookmark(a.title,a.url);notifyUser("Bookmarked 1 tab.")})});$(function(){$(e).on("click",function(c){chrome.tabs.remove(a.id);$(b).remove();updateCounter(1)});$(b).on("mouseup",function(c){2==c.which&&(chrome.tabs.remove(a.id),$(b).remove(),updateCounter(1))})});return b}
function pushToIndex(a,b){0===a?$("#tabContainer").prepend(b):$("#tabContainer > div:nth-child("+a+")").after(b)}function pushBookmark(a,b){var c=chrome.extension.getBackgroundPage().bookmarkDir;chrome.bookmarks.create({parentId:c,title:a,url:b})}function checkWindowOpen(a,b){for(var c=new RegExp("^chrome-extension:.*."+b+".html$"),d=0;d<a.length;d++)if(c.test(a[d].url))return!0;return!1}
function bindHover(){$(".settings-menu > .settings-list > li.menubtn").hover(function(){$(this).toggleClass("hovered")});$("#tools").hover(function(){$(this).attr("src","tab128h.png")},function(){$(this).attr("src","tab128.png")});$("#backicon").hover(function(){$(this).attr("src","glyph-backh.png")},function(){$(this).attr("src","glyph-back.png")});$("#refresh").hover(function(){$(this).attr("src","glyph-refreshh.png")},function(){$(this).attr("src","glyph-refresh.png")})}
$(document).ready(function(){updateCounter(0);getAllTabs(addTabs);bindHover();$(".settings-menu > .settings-list > li.menubtn").on("click",function(){runProcess($(this).attr("id"))});$("#tools").on("click",function(){isRetrieve?$("#retrieve-menu").is(":visible")?$("#retrieve-menu").slideUp():$("#retrieve-menu").slideDown():$("#main-menu").is(":visible")?$("#main-menu").slideUp():$("#main-menu").slideDown()});$("body").on("click",function(a){if($(a.target).is("#tools")||$(a.target).hasClass("hdivider"))return a.preventDefault(),
!1;$(".settings-menu").slideUp()});$(".tipNotifier").on("click",function(){$(".tipNotifier").slideUp()});$(".back").on("click",function(a){isRetrieve&&(getAllTabs(refreshContainer),switchMode(),bindHighlight("#retrieveContainer"),$(".settings-menu").slideUp())});$("#refresh").on("click",function(){getAllTabs(refreshContainer)});$(".settings-menu > .settings-list > #settings").on("click",function(){getAllTabs(function(a){checkWindowOpen(a,"tabitha-opt")?a.forEach(function(a){/^chrome-extension:.*.tabitha-opt.html$/.test(a.url)&&
chrome.tabs.update(a.id,{active:!0})}):(a=chrome.extension.getURL("tabitha-opt.html"),chrome.tabs.create({url:a,active:!0}))})});chrome.commands.onCommand.addListener(function(a){if("close"===a||"pin"===a||"combine"===a)runProcess(a);else return!1})});