
function init() {
	if (!createjs.Sound.initializeDefaultPlugins()) {
		document.getElementById("error").style.display = "block";
		document.getElementById("content").style.display = "none";
		return;
	}

	$("#position").css("display", "none");
	$("#playPauseBtn").attr("disabled", true);
	$("#stopBtn").attr("disabled", true);
	$("#track").css("display", "none");

	examples.showDistractor("content");
	var assetsPath = "../../_assets/audio/";
	var src = assetsPath + "M-GameBG.ogg";

	createjs.Sound.alternateExtensions = ["mp3"];	// add other extensions to try loading if the src file extension is not supported
	createjs.Sound.addEventListener("fileload", createjs.proxy(handleLoadComplete, this)); // add an event listener for when load is completed
	createjs.Sound.registerSound(src, "music");
}

var instance;
var positionInterval;
var seeking = false;

function handleLoadComplete(event) {
	examples.hideDistractor();

	$("#track").css("display", "block");
	$("#loading").css("display", "none");
	$("#progress").css("display", "none");
	$("#position").css("display", "block");

	instance = createjs.Sound.play("music");
	instance.addEventListener("complete", function () {
		clearInterval(positionInterval);
		$("#playBtn").removeClass("pauseBtn").addClass("playBtn")
		$("#stopBtn").attr("disabled", true);
	});
	$("#playPauseBtn").attr("disabled", false);
	$("#playBtn").removeClass("playBtn").addClass("pauseBtn");
	$("#playBtn").click(function (event) {
		if (instance.playState == createjs.Sound.PLAY_FINISHED) {
			instance.play();
			$("#playBtn").removeClass("playBtn").addClass("pauseBtn");
			trackTime();
			return;
		} else {
			instance.paused ? instance.paused = false : instance.paused = true;
		}

		if (instance.paused) {
			$("#playBtn").removeClass("pauseBtn").addClass("playBtn");
		} else {
			$("#playBtn").removeClass("playBtn").addClass("pauseBtn");
		}
	});
	$("#stopBtn").click(function (event) {
		instance.stop();
		//console.log("stop");
		clearInterval(positionInterval);
		$("#playBtn").removeClass("pauseBtn").addClass("playBtn");
		$("#thumb").css("left", 0);
	});
	$("#stopBtn").attr("disabled", false);

	trackTime();

	// http://forums.mozillazine.org/viewtopic.php?f=25&t=2329667
	$("#thumb").mousedown(function (event) {
		//console.log("mousedown");
		var div = $();
		$("#player").append($("<div id='blocker'></div>"));
		seeking = true;
		$("#player").mousemove(function (event) {
			// event.offsetX is not supported by FF, hence the following from http://bugs.jquery.com/ticket/8523
			if (typeof event.offsetX === "undefined") { // || typeof event.offsetY === "undefined") {
				var targetOffset = $(event.target).offset();
				event.offsetX = event.pageX - targetOffset.left;
				//event.offsetY = event.pageY - targetOffset.top;
			}
			$("#thumb").css("left", Math.max(0, Math.min($("#track").width() - $("#thumb").width(), event.offsetX - $("#track").position().left)));
		})
		$("#player").mouseup(function (event) {
			//console.log("mouseup");
			seeking = false;
			$(this).unbind("mouseup mousemove");
			var pos = $("#thumb").position().left / $("#track").width();
			instance.position = (pos * instance.duration);
			$("#blocker").remove();
		});
	});
}

var dragOffset;
function trackTime() {
	positionInterval = setInterval(function (event) {
		if (seeking) {
			return;
		}
		$("#thumb").css("left", instance.position / instance.duration * $("#track").width()-10);
	}, 30);
}
