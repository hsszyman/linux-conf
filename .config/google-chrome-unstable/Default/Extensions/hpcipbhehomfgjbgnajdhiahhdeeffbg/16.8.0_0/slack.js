var THIRTY_DAYS=2592e6;function inputKeydownHandler(e){var n=this.getElementsByTagName("div")[0].getElementsByTagName("p")[0].innerText.trim();return 13!=e.keyCode||""==n||(this.setAttribute("savedMsg",n),"/leap"!=n&&0!=n.indexOf("/leap "))||(this.getElementsByTagName("div")[0].getElementsByTagName("p")[0].innerText="",!1)}function inputKeyupHandler(e){var n=e.keyCode,t=this.getAttribute("savedMsg");if(t&&(t=t.toLowerCase()),13!=n||!t||"/leap"!=t&&0!=t.indexOf("/leap "))return!0;var r=-1!=t.indexOf(" broadcas"),i=-1!=t.indexOf(" scree");if(0==t.indexOf("/leap sto")||0==t.indexOf("/leap en"))return dispatch.trigger("stopSharing"),document.getElementById("msg_input").getElementsByTagName("div")[0].getElementsByTagName("p").innerText="",!1;var a=!0;return dispatch.on(["hideIntegrationBrowserShareStartingDialog","hideIntegrationScreenShareStartingDialog"],function(){a=!1,hideScreenleapExtensionDialog()}),dispatch.on(["startIntegrationBrowserShareSuccessful","startIntegrationScreenShareSuccessful"],function(e){a=!1,hideScreenleapExtensionDialog(),getInputParaElement().innerText="View my screen: "+e.viewerUrl,document.getElementById("msg_input").setAttribute("savedMsg",""),chrome.storage.sync.get(["slackScreenShareInstructionShownCount","slackScreenShareInstructionLastShownTimestamp"],function(e){var n=0,t=null;e.slackScreenShareInstructionShownCount&&(n=e.slackScreenShareInstructionShownCount),e.slackScreenShareInstructionLastShownTimestamp&&(t=e.slackScreenShareInstructionLastShownTimestamp),(n<3||t<(new Date).getTime()-THIRTY_DAYS)&&(showPromptDialog("Your screen is shared","screenleap-green","The share link has been inserted into your message and ready to share.<br><br>You can stop your screen share by clicking on the Screenleap icon next to the address bar and then clicking on the <b>Stop sharing</b> button.",null,{label:"OK",click:function(){hideScreenleapExtensionDialog()}}),chrome.storage.sync.set({slackScreenShareInstructionShownCount:++n,slackScreenShareInstructionLastShownTimestamp:(new Date).getTime()}))})}),dispatch.on(["startIntegrationBrowserShareUnsuccessful","startIntegrationScreenShareUnsuccessful"],function(e){a=!1,hideScreenleapExtensionDialog(),401==e.status?void 0!==e.event&&"captureDesktop"==e.event?showPromptDialog("Permission required","screenleap-red","You need to grant permission to share your desktop by selecting a window or screen.",null,null,{label:"OK",click:function(){hideScreenleapExtensionDialog()}}):showPromptDialog("Sign-in required","screenleap-red","You need to click on the Screenleap icon and sign into your account before you can share your screen.",null,null,{label:"OK",click:function(){hideScreenleapExtensionDialog()}}):dispatch.trigger("showShareFailed",e)}),dispatch.on("insertLinkForActiveIntegrationScreenShare",function(e){a=!1,hideScreenleapExtensionDialog(),getInputParaElement().innerText="View my screen: "+e.viewerUrl,document.getElementById("msg_input").setAttribute("savedMsg",""),showPromptDialog("Your screen is already being shared","screenleap-green","The share link has been re-inserted into your input field for you to share.",null,{label:"OK",click:function(){hideScreenleapExtensionDialog()}})}),dispatch.trigger(r?"startNewBroadcast":"startNewShare",{origin:"INTEGRATION",isCaptureEntireScreen:i}),setTimeout(function(){a&&showPromptDialog('Starting screen share...<img src="https://www.screenleap.com/img/indicator.gif" class="indicator" alt=""/>',"screenleap-green","This may take a few seconds. Thank you for your patience.",null,{label:"Cancel",click:function(){hideScreenleapExtensionDialog()}})},1e3),!1}function getInputParaElement(){return document.getElementById("msg_input").getElementsByTagName("div")[0].getElementsByTagName("p")[0]}function showSlackIntegrationBrokenPrompt(e){hideScreenleapExtensionDialog(),showPromptDialog("Slack Integration Broken","screenleap-red",e+" Slack integration needs to be updated for the Slack integration to work.",null,{label:"OK"})}document.getElementById("msg_input").addEventListener("keydown",inputKeydownHandler,!0),document.getElementById("msg_input").addEventListener("keyup",inputKeyupHandler,!0),dispatch.on("screenleapUserAuthenticated",function(){document.getElementById("msg_input")||showSlackIntegrationBrokenPrompt("Message input element with id msg_input is missing.");var e=document.getElementById("msg_input").getElementsByTagName("div");0==e.length&&showSlackIntegrationBrokenPrompt("Div child element of msg_input is missing."),0==e[0].getElementsByTagName("p").length&&showSlackIntegrationBrokenPrompt("P child element of msg_input's div element is missing.")});