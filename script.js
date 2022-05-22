var items_real = 13;
var items_on_page = items_real + 2;
var step = 15;
var items_array = new Array(items_on_page);

//console.log(items_array);

var s_width = window.innerWidth;
var s_height = window.innerHeight;
console.log(s_width + ' ' + s_height);
var stage, bmp;
var container;



function init() {

	canvas_screen = document.getElementById('roott');
	canvas_screen.height = s_height;
	canvas_screen.width = s_width;

	stage = new createjs.StageGL("roott");
	bmp = new createjs.Bitmap("olya_character.jpg");
	container = new createjs.Container();
	container.addChild(bmp);

	stage.addChild(container);

	createjs.Ticker.on("tick", handleTick);
	createjs.Ticker.framerate = 60;

	container.scaleX = container.scaleY = 1;
};

function handleTick(event) {
	if (container.x + step + 128 > s_width || container.x + step < 0) {
		step *= -1;
	};
	container.x += step;
	//console.log(s_width+' -> '+bmp.x+' ->');
	stage.update();
}