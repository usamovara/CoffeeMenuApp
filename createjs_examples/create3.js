
var stage, sliceContainer, sliceWidth, degToRad = Math.PI / 180;

function init() {
	examples.showDistractor();

	stage = new createjs.Stage("testCanvas");
	stage.enableMouseOver();
	createjs.Touch.enable(stage);
	stage.mouseMoveOutside = true;

	var img = new Image();
	img.onload = handleImageLoad;
	img.src = "../_assets/art/flowers.jpg";
}

function handleImageLoad(evt) {
	examples.hideDistractor();

	var img = evt.target, imgWidth = img.width, imgHeight = img.height, sliceCount = 6;

	sliceWidth = imgWidth / sliceCount;
	sliceContainer = new createjs.Container();
	sliceContainer.x = stage.canvas.width / 2;

	for (var i = 0; i < sliceCount; i++) {
		var slice = new createjs.Bitmap(img);
		slice.sourceRect = new createjs.Rectangle(sliceWidth * i, 0, sliceWidth, imgHeight);
		slice.cache(0, 0, sliceWidth, imgHeight);
		slice.filters = [new createjs.ColorMatrixFilter(new createjs.ColorMatrix())];
		sliceContainer.addChild(slice);
	}

	var slider = new Slider(0, 50, 200, 50).set({x: 20, y: 330, value: 25});
	slider.on("change", handleSliderChange, this);

	stage.addChild(sliceContainer, slider);
	updateEffect(slider.value);
}

function handleSliderChange(evt) {
	updateEffect(evt.target.value);
}

function updateEffect(value) {
	var l = sliceContainer.numChildren;

	for (var i = 0; i < l; i++) {
		var slice = sliceContainer.getChildAt(i);
		slice.y = Math.sin(value * degToRad) * -sliceWidth / 2;
		if (i % 2) {
			slice.skewY = value;
		} else {
			slice.skewY = -value;
			slice.y -= sliceWidth * Math.sin(slice.skewY * degToRad);
		}
		slice.x = sliceWidth * (i - l / 2) * Math.cos(slice.skewY * degToRad);
		slice.filters[0].matrix.setColor(Math.sin(slice.skewY * degToRad) * -80);
		slice.updateCache();
	}
	stage.update();
}
