
var canvas, stage;

function init() {
	canvas = document.getElementById("testCanvas");
	stage = new createjs.Stage(canvas);

	var ball = new createjs.Shape();
	ball.graphics.setStrokeStyle(5, 'round', 'round');
	ball.graphics.beginStroke('#000000');
	ball.graphics.beginFill("#FF0000").drawCircle(0, 0, 50);
	ball.graphics.setStrokeStyle(1, 'round', 'round');
	ball.graphics.beginStroke('#000000');
	ball.graphics.moveTo(0, 0);
	ball.graphics.lineTo(0, 50);

	ball.graphics.endStroke();
	ball.x = 200;
	ball.y = -50;

	createjs.Tween.get(ball, {loop: -1})
		.to({x: ball.x, y: canvas.height - 55, rotation: -360}, 1500, createjs.Ease.bounceOut)
		.wait(1000)
		.to({x: canvas.width - 55, rotation: 360}, 2500, createjs.Ease.bounceOut)
		.wait(1000)
		.to({scaleX: 2, scaleY: 2}, 2500, createjs.Ease.quadOut)
		.wait(1000)

	stage.addChild(ball);

	createjs.Ticker.addEventListener("tick", stage);
}

