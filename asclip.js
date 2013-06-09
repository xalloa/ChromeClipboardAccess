/* AlloSoft Clipboard Access
 * Chrome extension
 * http://www.allos.gr/asClickToCopy.html
 * Distributed with a CreativeCommons CC BY-SA license
 * http://creativecommons.org/licenses/by-sa/3.0/
 * June 2013
 */
var asClipboardXS = new function () {
	var self = this;

	self.version = 1.5;
	self.Compatible = false;
	self.pendingRequests = new Object();

	// Add responses handler
	window.addEventListener("message", function(event) {
		// We only accept messages from ourselves
		if (event.source != window)
			return;

		// We only accept messages with data
		if ( !event.data )
			return;

		var response = event.data;

		// We only accept Responses - to this handler the requests/actions also arrive
		if (response.type == "AS_CLIPBOARD_VERSION_RESPONSE") {
			console.log('Version info received');
			self.Compatible = ( response.version && response.version == self.version );
			if (!self.Compatible) {
				if (confirm('Allosoft Clipboard Access extension\n\nVersion incompatibility:\n\nasclip : ' + self.version+'\n\nextension : ' + response.version + '\n\nClick Ok to open the extensions home page so that you download the correct verion, or Cancel to ignore.')) {
					window.open('http://www.allos.gr/asClickToCopy.html','_blank');
				}
			}
		} else if (response.type != "AS_CLIPBOARD_RESPONSE") {
			return;
		}

		// Check to see if we know it, i.e. it has a handler
		if (response.key && self.pendingRequests[response.key]) {
			response.compatibilityCheck = self.Compatible;
			self.pendingRequests[response.key].callback( response );
			delete self.pendingRequests[response.key];
		}
	});

	// Version check
	self.check = function(cb) {
                var RO = { type: "AS_CLIPBOARD_VERSION" };
		RO.key = Math.floor((1 + Math.random()) * 0x100000000).toString(16).substring(1);
		window.postMessage( RO , "*" );

		// If there is a callback defined then store it for later use
		if (typeof(cb) == "function") {
console.log("A");
			RO.callback = cb;
			self.pendingRequests[RO.key] = RO;
		}
	}

	self.copy = function (data, cb) {
		// Build request object
		var RO = {
  			type: "AS_CLIPBOARD_ACTION",
  			action: "AS_TO_CLIPBOARD",
  			content: data
		};

		if (typeof(cb) == "function") {
			RO.key = Math.floor((1 + Math.random()) * 0x100000000).toString(16).substring(1);
		}

		// Send the message
		window.postMessage( RO , "*" );

		// If there is a callback defined then store it for later use
		if (typeof(cb) == "function") {
			RO.callback = cb;
			self.pendingRequests[RO.key] = RO;
		}

		return true;
	};

	self.paste = function (cb) {
		if (typeof(cb) != "function") {
			return false;
		}

		// Build request object
		var RO = {
  			type: "AS_CLIPBOARD_ACTION",
  			action: "AS_FROM_CLIPBOARD"
		};

		if (typeof(cb) == "function") {
			RO.key = Math.floor((1 + Math.random()) * 0x100000000).toString(16).substring(1);
		}

		// Send the message
		window.postMessage( RO , "*" );

		// If there is a callback defined then store it for later use
		if (typeof(cb) == "function") {
			RO.callback = cb;
			self.pendingRequests[RO.key] = RO;
		}

		return true;
	}
}