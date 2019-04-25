(function() {
var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
|| window[vendors[x]+'CancelRequestAnimationFrame'];
}
if (!window.requestAnimationFrame)
window.requestAnimationFrame = function(callback, element) {
var currTime = new Date().getTime();
var timeToCall = Math.max(0, 16 - (currTime - lastTime));
var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
timeToCall);
lastTime = currTime + timeToCall;
return id;
};
if (!window.cancelAnimationFrame)
window.cancelAnimationFrame = function(id) {
clearTimeout(id);
};
}());

// ===== Global objects and variables =====

var targetFPS = 60;

var FontSize = 24;

var mouseX = 0;

var mouseY = 0;

var fpsInterval, startTime, now, then, elapsed;



	//  === Initialize operations start ===
	function init(){
		
		setCanvas();	// set canvas layers and style		
		console.log("setCanvas worked");
		
		initEvents();	// assign events
		console.log("initEvents worked");
		
		initConstructors(); // runs construction methods		
		console.log("initConstructors worked");
		
		initUpdated();  // draw curves and text
		console.log("initUpdated worked");
		
		initGoogleDoc();
		console.log("Google Doc worked");
	}
	
	function initEvents(){ 
		mouseHandler.eventHandler(canvas1);
	}
	
	function initConstructors(){
		drawMain.Constructor(ctx1, ctx2); 
	}
	
	function initUpdated(){
		requestAnimationFrame(sceneHandler.Updated);
	}
	
	//  ||| Initialize operations end |||
	
	//   === Screen handler class start ===
	
	function SceneHandler(){
		this.scene = 0; // menu
	}
	
	SceneHandler.prototype.Updated = function(){
		/*switch (sceneHandler.scene){
			case 0:
				sceneHandler.Menu();
			break;
			case 0:
				sceneHandler.Menu();
			break;
		}*/
		if (sceneHandler.scene == 0){
			sceneHandler.Menu();
		}
		
		setTimeout(function() {
			requestAnimationFrame(sceneHandler.Updated);			
		}, 1000 / targetFPS);
	}
	
	SceneHandler.prototype.Menu = function(){
		switch (drawMain.transition){
			case 0: 
				drawMain.drawMenu(ctx1);
			break;
			case 1:
				drawTransition.toResume();						
			break;
			case 2:
				drawTransition.toAbout();
			break;
			case 3:
				drawTransition.toPerson();
			break;
		}			
	}
	
	//   ||| Screen handler class end |||
	
	//   === Event handler class start ===
	
	var MouseHandler = function(){
		this.clientX = 0;
		this.clientY = 0;
	}
	
	MouseHandler.prototype.eventHandler = function(canvas){
		window.onresize = function(){ 
		// resize window event
			if( drawMain.transition == 0 ){
				setCanvas();
				drawMain.Constructor();
			}
		}
		canvas.onmousemove = function (e) {
			MouseHandler.clientX = e.clientX;
			MouseHandler.clientY = e.clientY;
			mouseX = e.clientX;
			mouseY = e.clientY;
		}	
		canvas.onclick = function (e) {
			if (sceneHandler.scene == 0 && drawMain.transition == 0){
				drawMain.transition = drawMain.menuState;
			}
		}
	}
	
	MouseHandler.prototype.getX = function(){
		return this.clientX;
	}
	
	MouseHandler.prototype.getY = function(){
		return this.clientY;
	}
	
	
	//   ||| Event handler class end |||
	
	
	function DisplayScene(containerName){
		document.getElementById("canvascontainer").style.display = "none";
		document.getElementById("resumecontainer").style.display = "none";
		document.getElementById("aboutcontainer").style.display = "none";
		document.getElementById("personcontainer").style.display = "none";
		
		if (containerName == "aboutcontainer"){
			var typed = new Typed('#typed', {
				stringsElement: '#typed-strings',
				typeSpeed: 30
			});
			
			console.log("aboutcontainer");
			document.body.style.backgroundColor = "#000";
		} else {
			console.log(containerName);
			document.body.style.backgroundColor = "#fff";
		}
		
		if(containerName == "personcontainer"){
			animatePersonScene();
		}
		
		document.getElementById(containerName).style.display = "block";
	}
	
	function ResumeMain(){
		console.log("resume main");
		setCanvas();
		drawMain.Constructor();
		drawMain.transition = 0;
		drawTransition.init();
		sceneHandler.scene = 0;
	}
	
	
	
	// ===== Main start =====
	
	var drawMain = new DrawMain();
	var drawTransition = new DrawTransition();
	var mouseHandler = new MouseHandler();
	var sceneHandler = new SceneHandler();	
	
	drawTransition.init();
	init();	
	
	// ||||| Main end |||||
