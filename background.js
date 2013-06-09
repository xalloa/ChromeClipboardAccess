/* AlloSoft Clipboard Access
 * Chrome extension
 * http://www.allos.gr/asClickToCopy.html
 * Distributed with a CreativeCommons CC BY-SA license
 * http://creativecommons.org/licenses/by-sa/3.0/
 * June 2013
 */
chrome.runtime.onConnect.addListener(function(port){
	port.onMessage.addListener(function(req) {
		if (req.action == "copy") {                    // :: Set Clipboard data

			console.log("Got to copy: " + req.data.content);
			console.log(req.data);
			console.log(req.data.content);
			var cp = document.getElementById('cliproxy');
			cp.value = req.data.content;
			cp.focus();
			cp.selectionStart=0;
			cp.selectionEnd = req.data.content.length;

			req.data.res = document.execCommand('copy');

			req.data.type = "AS_CLIPBOARD_RESPONSE";
			port.postMessage( req.data );
		} else if (req.action == "paste") {
			console.log("Got to paste");
			console.log(req.data);

			var cp = document.getElementById('cliproxy');
			cp.value = '';
			cp.focus();
			cp.selectionStart = 0;
			cp.selectionEnd = 0;
			req.data.res = document.execCommand('paste');

			if (req.data.res) {
				req.data.content = cp.value;
			}

			req.data.type = "AS_CLIPBOARD_RESPONSE";
			port.postMessage( req.data );
		}
	});
});
