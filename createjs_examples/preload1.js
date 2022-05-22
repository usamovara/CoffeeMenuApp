
var preload;

function init() {
	// Create a new queue.
	//preload = new createjs.LoadQueue(true, "assets/");

	// Use this instead to favor XHR loading
	preload = new createjs.LoadQueue(true);

	createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin]);  // need this so it doesn't default to Web Audio
	preload.installPlugin(createjs.Sound);

	preload.on("fileload", handleFileLoaded);
	preload.on("error", handleError);
}

function loadManifest() {
	preload.loadManifest({src: "static/MediaGridManifest.json", callback: "loadMediaGrid", type: "manifest"}, true, "../_assets/");
}

function stop() {
	if (preload != null) {
		preload.close();
	}
}

// Load a single asset.
function loadAsset(target) {
	var div = document.getElementById(target.id);
	div.innerHTML = "<label>Loading...</label>";

	var type = target.attributes.getNamedItem("type");

	var item = {
		src: target.id,
		id: target.id
	};

	if (!type) {
		preload.loadManifest({path: "../_assets/", manifest: [item]});
	} else {
		item.type = type.value;
		item.callback = "maps";
		preload.loadFile(item, true);
	}
}

// Once each file is loaded, show it. Each ID corresponds to the related DIV.
function handleFileLoaded(event) {
	var item = event.item;
	var id = item.id;
	var result = event.result;

	var div = document.getElementById(id);
	if (div == null) {
		console.log("Could not find DIV:", id, event);
		return;
	}
	switch (item.type) {
		case createjs.Types.CSS:
			(document.head || document.getElementsByTagName("head")[0]).appendChild(result);
			div.innerHTML = "<label>CSS is complete :)</label>";
			break;

		case createjs.Types.IMAGE:
			div.innerHTML = "";
			result.width = div.clientWidth;
			result.height = div.clientHeight;
			div.appendChild(result);
			break;

		case createjs.Types.JAVASCRIPT:
			document.body.appendChild(result);
			div.innerHTML = "<label>Javascript is complete :)</label>";
			break;

		case createjs.Types.JSON:
		case createjs.Types.XML:
			div.innerHTML = "<label>" +
					item.type +
					" loaded: <br /><xmp>" +
					(event.rawResult ? event.rawResult : '') +
					"</xmp></label>";
			break;
		case createjs.Types.JSONP:
			div.innerHTML = "<label>JSONP is complete :)</label>";
			break;
		case createjs.Types.SOUND:
			document.body.appendChild(result);
			result.play();
			div.innerHTML = "<label>Sound is complete :)</label>";
			break;

		case createjs.Types.SVG:
			div.innerHTML = "";
			div.appendChild(result);
			break
	}
	div.style.backgroundColor = "#222222";
}

// A file failed to load.
function handleError(event) {
	var item = event.data;
	var div = document.getElementById(item.id);
	if (div != null) {
		div.innerHTML = "<label>Error " + (item.id == "NoFileHere.png"?":)":":(")+"</label>";
		div.className = "gridBox error";
	}
}
