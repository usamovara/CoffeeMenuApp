
var stage;
var isDrawing;
var drawingCanvas;
var oldPt;
var oldMidPt;
var image;
var bitmap;
var maskFilter;
var cursor;
var text;
var blur;

function init() {
	examples.showDistractor();

	image = new Image();
	image.onload = handleComplete;
	image.src = "../_assets/art/flowers.jpg";

	stage = new createjs.Stage("testCanvas");
	text = new createjs.Text("Loading...", "20px Arial", "#FFF");
	text.set({x: stage.canvas.width / 2, y: stage.canvas.height - 40});
	text.textAlign = "center";
}

function handleComplete() {
	examples.hideDistractor();
	createjs.Touch.enable(stage);
	stage.enableMouseOver();

	stage.addEventListener("stagemousedown", handleMouseDown);
	stage.addEventListener("stagemouseup", handleMouseUp);
	stage.addEventListener("stagemousemove", handleMouseMove);
	drawingCanvas = new createjs.Shape();
	drawingCanvas.cache(0, 0, image.width, image.height);

	bitmap = new createjs.Bitmap(image);
	maskFilter = new createjs.AlphaMaskFilter(drawingCanvas.cacheCanvas);
	bitmap.filters = [maskFilter];
	bitmap.cache(0, 0, image.width, image.height);

	blur = new createjs.Bitmap(image);
	blur.filters = [new createjs.BlurFilter(24, 24, 2), new createjs.ColorMatrixFilter(new createjs.ColorMatrix(60))];
	blur.cache(0, 0, 960, 400);

	text.text = "Click and Drag to Reveal the Image.";

	stage.addChild(blur, text, bitmap);

	cursor = new createjs.Shape(new createjs.Graphics().beginFill("#FFFFFF").drawCircle(0, 0, 25));
	cursor.cursor = "pointer";

	stage.addChild(cursor);
}

function handleMouseDown(event) {
	oldPt = new createjs.Point(stage.mouseX, stage.mouseY);
	oldMidPt = oldPt;
	isDrawing = true;
}

function handleMouseMove(event) {
	cursor.x = stage.mouseX;
	cursor.y = stage.mouseY;

	if (!isDrawing) {
		stage.update();
		return;
	}

	var midPoint = new createjs.Point(oldPt.x + stage.mouseX >> 1, oldPt.y + stage.mouseY >> 1);

	drawingCanvas.graphics.clear()
			.setStrokeStyle(40, "round", "round")
			.beginStroke("rgba(0,0,0,0.2)")
			.moveTo(midPoint.x, midPoint.y)
			.curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);

	oldPt.x = stage.mouseX;
	oldPt.y = stage.mouseY;

	oldMidPt.x = midPoint.x;
	oldMidPt.y = midPoint.y;

	drawingCanvas.updateCache("source-over");
	bitmap.updateCache();

	stage.update();
}

function handleMouseUp(event) {
	isDrawing = false;
}

