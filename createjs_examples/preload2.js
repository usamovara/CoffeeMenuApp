
var loaderBar;
var stage;
var bar;
var imageContainer;
var currentImage;
var loaderWidth;
var loaderColor;
var borderPadding;
var preload;
var oldItem;

function init() {
	canvas = document.getElementById("myCanvas");
	stage = new createjs.Stage(canvas);
	stage.enableMouseOver(10);

	borderPadding = 10;

	var barHeight = 20;
	loaderColor = createjs.Graphics.getRGB(247, 247, 247);
	loaderBar = new createjs.Container();

	bar = new createjs.Shape();
	bar.graphics.beginFill(loaderColor).drawRect(0, 0, 1, barHeight).endFill();

	imageContainer = new createjs.Container();
	imageContainer.x = 430;
	imageContainer.y = 200;

	loaderWidth = 300;
	stage.addChild(imageContainer);

	var bgBar = new createjs.Shape();
	var padding = 3
	bgBar.graphics.setStrokeStyle(1).beginStroke(loaderColor).drawRect(-padding / 2, -padding / 2, loaderWidth + padding, barHeight + padding);

	loaderBar.x = canvas.width - loaderWidth >> 1;
	loaderBar.y = canvas.height - barHeight >> 1;
	loaderBar.addChild(bar, bgBar);

	stage.addChild(loaderBar);

	manifest = [
		{src: "image0.jpg", id: "image0"},
		{src: "image1.jpg", id: "image1"},
		{src: "image2.jpg", id: "image2"},
		{src: "image3.jpg", id: "image3"}
	];

	preload = new createjs.LoadQueue(true, "test/");

	// Use this instead to use tag loading
	//preload = new createjs.LoadQueue(false);

	preload.on("progress", handleProgress);
	preload.on("complete", handleComplete);
	preload.on("fileload", handleFileLoad);
	preload.loadManifest(manifest, true, "../_assets/art/");

	createjs.Ticker.framerate = 30;
}

function stop() {
	if (preload != null) {
		preload.close();
	}
}

function handleProgress(event) {
	bar.scaleX = event.loaded * loaderWidth;
}

function handleFileLoad(event) {
	var image = event.result;
	var w = image.width;
	var h = image.height;

	var bmp = new createjs.Bitmap(image).set({
		 scaleX: 0.75, scaleY: 0.75,
		 regX: w / 2, regY: h / 2,
		 rotation: Math.random() * 16 - 8,
		 cursor: "pointer",
		 x: borderPadding / 2 * 0.75, y: borderPadding / 2 * 0.7
	});
	bmp.on("click", handleClick);

	var border = new createjs.Shape(
			new createjs.Graphics().beginFill("#FFFFFF").drawRect(0, 0, w + borderPadding, h + borderPadding).endFill()
	).set({
		rotation: bmp.rotation,
		regX: w / 2,
		regY: h / 2,
		scaleX: bmp.scaleX,
		scaleY: bmp.scaleY,
		shadow: new createjs.Shadow("#000000", 0, 0, 2.5)
	});

	var container = new createjs.Container();
	container.addChild(border, bmp);
	imageContainer.addChild(container);
	stage.update();
}

function handleClick(event) {
	currentItem = event.target.parent;
	createjs.Tween.get(currentItem, {override: true})
			.to({y: -300, rotation:currentItem.rotation+Math.random()*30-15}, 200, createjs.Ease.quadInOut)
			.call(tweenUpComplete)
			.to({y: 0, rotation:currentItem.rotation}, 600, createjs.Ease.quadOut)
			.on("change", handleTweenChange);
}

function handleTweenChange(tween) {
	stage.update();
}

function tweenUpComplete(event) {
	imageContainer.addChildAt(currentItem, 0);
}

function handleComplete(event) {
	loaderBar.visible = false;
	stage.update();
}
