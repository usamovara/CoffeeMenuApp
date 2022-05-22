
var map = {};
var preload;
var loader;
var manifest;
var w = 226; // Item width
var h = 170; // Item height

function init() {
	$("#loadAnotherBtn").click(loadAnother);
	$("#loadAllBtn").click(loadAll);
	$("#reloadBtn").click(reload);

	reload();
}

// Reset everything
function reload() {
	// If there is an open preload queue, close it.
	if (preload != null) {
		preload.close();
	}

	// Reset the UI
	$("#reloadBtn").css("display", "none");
	$(".box").remove();
	$("#mainProgress .progress").width(0);

	$("#loadAnotherBtn").attr("disabled", null);
	$("#loadAllBtn").attr("disabled", null);

	// Push each item into our manifest
	manifest = [
		"image0.jpg",
		"image1.jpg",
		"image2.jpg",
		"image3.jpg",
		"Autumn.png",
		"BlueBird.png",
		"Nepal.jpg",
		"Texas.jpg"
	];

	// Create a preloader. There is no manifest added to it up-front, we will add items on-demand.
	preload = new createjs.LoadQueue(true, "../_assets/art/");

	// Use this instead to use tag loading
	//preload = new createjs.LoadQueue(false);

	preload.on("fileload", handleFileLoad);
	preload.on("progress", handleOverallProgress);
	preload.on("fileprogress", handleFileProgress);
	preload.on("error", handleFileError);
	preload.setMaxConnections(5);
}

function stop() {
	if (preload != null) {
		preload.close();
	}
}

function loadAll() {
	while (manifest.length > 0) {
		loadAnother();
	}
}

function loadAnother() {
	// Get the next manifest item, and load it
	var item = manifest.shift();
	preload.loadFile(item);

	// If we have no more items, disable the UI.
	if (manifest.length == 0) {
		$("#loadAnotherBtn").attr("disabled", "disabled");
		$("#loadAllBtn").attr("disabled", "disabled");
		$("#reloadBtn").css("display", "inline");
	}

	// Create a new loader display item
	var div = $("#template").clone();
	div.attr("id", ""); // Wipe out the ID
	div.addClass("box")
	$("#container").append(div);
	map[item] = div; // Store a reference to each item by its src
}

// File complete handler
function handleFileLoad(event) {
	var div = map[event.item.id];
	div.addClass("complete");

	// Get a reference to the loaded image (<img/>)
	var img = event.result;

	// Resize it to fit inside the item
	var r = img.width / img.height;
	var ir = w / h
	if (r > ir) {
		img.width = w;
		img.height = w / r;
	} else {
		img.height = h;
		img.width = h;
	}
	div.append(img); // Add it to the DOM
}

// File progress handler
function handleFileProgress(event) {
	var div = map[event.item.id]; // Lookup the related item
	div.children("DIV").width(event.progress * div.width()); // Set the width the progress.
}

// Overall progress handler
function handleOverallProgress(event) {
	$("#mainProgress > .progress").width(preload.progress * $("#mainProgress").width());
}

// An error happened on a file
function handleFileError(event) {
	var div = map[event.item.id];
	div.addClass("error");
}
