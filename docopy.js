/* AlloSoft Clipboard Access
 * Chrome extension
 * http://www.allos.gr/asClickToCopy.html
 * Distributed with a CreativeCommons CC BY-SA license
 * http://creativecommons.org/licenses/by-sa/3.0/
 * June 2013
 */
console.log("Starting....");

	var port = chrome.runtime.connect();

	port.onMessage.addListener(function(res) {
		window.postMessage(res, "*");
	});

	window.addEventListener("message", function(event) {
		// We only accept messages from ourselves
		if (event.source != window)
			return;

                if (event.data.type && (event.data.type == "AS_CLIPBOARD_ACTION")) {
			if (event.data.action && event.data.content && event.data.action == "AS_TO_CLIPBOARD") {
				port.postMessage({action: 'copy', data: event.data});
			} else if (event.data.action && event.data.action == "AS_FROM_CLIPBOARD") {
				port.postMessage({action: 'paste', data: event.data});
			} else {
				return;
			}
		} else if (event.data.type && (event.data.type == "AS_CLIPBOARD_VERSION")) {
                        event.data.version = chrome.runtime.getManifest().version;
			event.data.type = "AS_CLIPBOARD_VERSION_RESPONSE";
			window.postMessage( event.data , "*");
		} else {
			return;
		}

	});
