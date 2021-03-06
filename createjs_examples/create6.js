
var img;

function init() {
	//wait for the image to load
	img = new Image();
	img.onload = handleImageLoad;
	img.src = "../_assets/art/flowers.jpg";
}

function handleImageLoad() {
	//find canvas and load images, wait for last image to load
	var canvas = document.getElementById("testCanvas");

	// create a new stage and point it at our canvas:
	stage = new createjs.Stage(canvas);

	var bmp = new createjs.Bitmap(img).set({scaleX: 0.5, scaleY: 0.5});
	stage.addChild(bmp);

	var colorMatrix = new createjs.ColorMatrix();
	colorMatrix.adjustSaturation(-100);
	colorMatrix.adjustContrast(50);
	var blackAndWhiteFilter = new createjs.ColorMatrixFilter(colorMatrix);
	bmp = bmp.clone();
	// filters are only displayed when the display object is cached
	// later, you can call updateCache() to update changes to your filters
	bmp.filters = [blackAndWhiteFilter];
	bmp.cache(0, 0, img.width, img.height);
	bmp.x = 480;
	stage.addChild(bmp);

	var blurFilter = new createjs.BlurFilter(64, 0, 1);
	bmp = bmp.clone();
	bmp.filters = [blurFilter];
	bmp.cache(0, 0, img.width, img.height);
	bmp.y = 200;
	stage.addChild(bmp);

	var removeRedFilter = new createjs.ColorFilter(0.25, 0.75, 1, 1); // red, green, blue, alpha
	bmp = bmp.clone();
	bmp.filters = [removeRedFilter];
	bmp.cache(0, 0, img.width, img.height);
	bmp.x = 0;
	stage.addChild(bmp);

	var frame = new createjs.Shape();
	frame.graphics.setStrokeStyle(10).beginStroke("#000")
			.moveTo(480, 0).lineTo(480, 400)
			.moveTo(0, 200).lineTo(960, 200);
	frame.compositeOperation = "destination-out"; // punch the frame out.
	stage.addChild(frame);

	// draw to the canvas:
	stage.update();
}

