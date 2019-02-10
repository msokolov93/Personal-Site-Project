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

window.onload = function(){

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
	
	function changeTransition(){
		if (SceneHandler.scene == 0 && drawMain.transition == 0){
			drawMain.transition = drawMain.menuState;
		}
	}
	
	//  ||| Initialize operations end |||
	
	//   === Screen handler class start ===
	
	function SceneHandler(){
		this.scene = 0; // menu
	}
	
	SceneHandler.prototype.Updated = function(){
		if (sceneHandler.scene == 0){
			sceneHandler.Menu();
		}
		
		setTimeout(function() {
			requestAnimationFrame(sceneHandler.Updated);			
		}, 1000 / targetFPS);
	}
	
	SceneHandler.prototype.Menu = function(){
		//console.log("SceneHandler.Menu.switch is avaliable");
		switch (drawMain.transition){
			case 0: 
				drawMain.drawMenu(ctx1);
			break;
			case 1:
				if ( drawMain.transition != 0 ){
					drawTransition.toResume();
				}
				else {
					drawMain.drawMenu(ctx1);
				}						
			break;
			case 2:
				if ( drawMain.transition != 0 ){
					drawTransition.toAbout();
				}
				else {
					drawMain.drawMenu();
				}	
			break;
			case 3:
				if ( drawMain.checkAim() ){
					drawTransition.toPerson();
				}
				else {
					drawMain.drawMenu();
				}		
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
			if( drawMain.transition != 0 ){
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
			//console.log("clicked at [" + e.clientX + "; " + e.clientY + "]; ");
			//console.log("sceneHandler.scene = " + sceneHandler.scene + "; drawMain.transition = " + drawMain.transition + "; ");
			//console.log("drawMain.menuState = " + drawMain.menuState);
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
	
	//   === Transition code start ===
	
	function drawTransition(){ // static scope for transition animations
		this.resumeState = 0; // state of resume transition
		this.aboutState = 0;
		
		// Resume State One
		this.alpha = Math.PI / 2;
		this.oneFrames = 27;
		this.oneRate = this.alpha / this.oneFrames ;  // 27 frames depends on speed of curves animation
		
		// Resume State Two
		this.twoFrames = 53; 
		this.twoRate = this.alpha / this.twoFrames ; // (pi / 2) / frames
		this.median = window.innerHeight / 2 ; // never used in this state
			
		// About State One			
		this.scale = 1;		
	}
	
	//    == Resume code start ==
	
	function initDocs(){

	}
	
	drawTransition.prototype.toResume = function(){
		switch (drawTransition.resumeState){			
			case 0: 
				drawTransition.resumeStateOne(ctx1);
			break;
			case 1: 
				drawTransition.resumeStateTwo(ctx1);
			break;
			case 2:
				drawTransition.resumeStateThree();
			break;
			default:
			break;
		}
	}
	
	drawTransition.prototype.resumeStateOne = function(context){
		drawMain.changeState(context, 0); 	
		var height = drawMain.curves[0].y;
		drawMain.clearLines(context);
		drawMain.clearCurves(context);
		
		// Calculate new turn angle
		if ( this.alpha > 0 ){
			this.alpha -= this.oneRate;
			if (this.alpha < 0){
				this.alpha = 0;
			}
		}
		
		// Calculate new curve and line height
		if (drawMain.curves[0].y < drawMain.curves[1].y){
			drawMain.curves[0].y = ( drawMain.curves[1].y - (Math.sin(this.alpha) * drawMain.lineSpan) );
			drawMain.lines[0].y = drawMain.curves[0].y;
		}		
	
		// Draw curves and lines

		drawMain.drawCurves(context);
		drawMain.drawLines(context);
		
		// Draw Menu Text
		context.save();
		context.setTransform(1, 0, 0, Math.sin(this.alpha), 0, height - Math.sin(this.alpha) * (height) );		
		drawMain.drawName(context, drawMain.curves[0], drawMain.curves[1], "RESUME");
		context.restore();
		drawMain.drawName(context, drawMain.curves[1], drawMain.curves[2], "ABOUT");
		drawMain.drawName(context, drawMain.curves[2], drawMain.curves[3], "PERSON");
		
		// change scene event
		if (Math.sin(this.alpha) == 0){
			this.resumeState = 1;
			// preparation for stage two
			drawMain.curves[0].y = drawMain.curves[1].y;
			drawMain.curves[1].y = drawMain.curves[2].y;
			this.median = drawMain.curves[1].y;
			//ctx2.fillStyle = "rgba(82, 86, 89, 1)"; // pdf background color
			ctx2.fillStyle = "rgba(255, 255, 255, 1)";
			ctx2.fillRect(0,0,window.innerWidth,window.innerHeight);
		}
	}
	
	drawTransition.prototype.resumeStateTwo = function(context){
		var span = drawMain.lineSpan;
		drawMain.clearLines(context);
		
		context.save();
		context.clearRect(0, drawMain.lines[1].y, window.innerWidth, drawMain.lines[2].y - drawMain.lines[1].y );
		context.fillStyle = "rgba(0, 0, 0, "+ Math.cos(this.alpha) +")";
		context.fillRect(0, drawMain.lines[1].y, window.innerWidth, drawMain.lines[2].y - drawMain.lines[1].y );
		context.restore();
		
		if ( this.alpha < (Math.PI / 2) ){
			this.alpha += this.twoRate;
			if (this.alpha > (Math.PI / 2) ){
				this.alpha = (Math.PI / 2);
			}
		}
		var topy = this.median * Math.cos(this.alpha) ;
		var boty = drawMain.endy - this.median * Math.cos(this.alpha);
		//console.log("topy = " + topy);
		//console.log("boty = " + boty);
		
		if ( (drawMain.curves[1].y != 0) || (drawMain.curves[2].y != drawMain.endy) ){
			drawMain.curves[0].y = topy - span;
			drawMain.curves[1].y = topy;
			drawMain.curves[2].y = boty;
			drawMain.curves[3].y = boty + span;		
			
			drawMain.lines[0].y = topy - span;
			drawMain.lines[1].y = topy;
			drawMain.lines[2].y = boty;
			drawMain.lines[3].y = boty + span;		
		}
	
		drawMain.drawCurves(context);
		drawMain.drawLines(context);
		
		drawMain.drawName(context, drawMain.curves[0], drawMain.curves[1], "ABOUT");
		drawMain.drawName(context, drawMain.curves[2], drawMain.curves[3], "PERSON");
		if (Math.sin(this.alpha) == 1){
			this.resumeState = 2;
			//ctx1.clearRect(0, 0, window.innerWidth, window.innerHeight);
			//document.getElementById("actionCanvas").style.visibility = "hidden";
			//document.getElementById("resumedoc").style.zIndex = "100";
		}		
	
	}		
	
	drawTransition.prototype.resumeStateThree = function(context){
		document.getElementById("canvascontainer").style.display = "none";
		document.getElementById("resumecontainer").style.display = "block";
		var iframe = document.getElementById("iframe");
		iframe.src = "https://docs.google.com/document/d/e/2PACX-1vTH1rrEZw_vCU4DcB1hvA6kGtEZF18kN4i2eno-bb6idqxZAHuoGyfANAZlWGOoMCYYy_JAbbQ1XyD0/pub?embedded=true";
		iframe.style.visibility = "visible";
		document.body.style.overflow = "scroll";
		//document.getElementById("actionCanvas").style.display = "none";
		//document.getElementById("backgroundCanvas").style.display = "none";
		this.resumeState = 3;
	}
	
	//    || Resume code end ||
	
	//    == About code start ==
	
	drawTransition.prototype.toAbout = function(){
		switch (drawTransition.aboutState){			
			case 0: 
				drawTransition.aboutStateOne(ctx1);
			break;
			case 1: 
				drawTransition.aboutStateTwo(ctx1);
			break;
			case 2:
				drawTransition.aboutStateThree(ctx1);
			break;
		}
	}
	
	drawTransition.prototype.aboutStateOne = function(context){ // doesnt work on page resize
		
		if( drawMain.menuState == 2 && drawMain.checkAim() == 1){
			this.x = Math.round( drawMain.curves[0].getCrestX() );
			this.y0 = Math.round( (drawMain.curves[0].getCrestY() + drawMain.curves[1].getCrestY()) / 2 + FontSize / 3 );
			this.y1 = Math.round( (drawMain.curves[1].getCrestY() + drawMain.curves[2].getCrestY()) / 2 + FontSize / 3 );
			drawMain.menuState = 1;
			drawMain.curves[1].setAim(1);
		} 
		
		drawMain.clearLines(context);
		drawMain.clearCurves(context);
		
		context.fillText("ABOUT", ( this.x - context.measureText("ABOUT").width / 2) , this.y1); // before fill
		context.save();
		drawMain.pathArea(context, 0);
		context.fillStyle = "rgb(255, 255, 255, 1)";
		context.fill();
		context.restore();
		
		drawMain.drawCurves(context);
		drawMain.drawLines(context);
		
		context.fillText("RESUME", ( this.x - context.measureText("RESUME").width / 2) , this.y0);		
		drawMain.drawName(context, drawMain.curves[2], drawMain.curves[3], "PERSON");
		
		if (drawMain.checkAim() == 0 && drawMain.menuState == 2){ // to finish the animation of About, this.x, this.y wasnt created yet
			drawMain.drawName(context, drawMain.curves[0], drawMain.curves[1], "RESUME");
			drawMain.drawName(context, drawMain.curves[1], drawMain.curves[2], "ABOUT");
		}

		if ((drawMain.checkAim() == 1) && (drawMain.menuState == 1)){
			drawTransition.aboutState = 1;
		}
	}
	
	drawTransition.prototype.aboutStateTwo = function(context){ // !* Recreated curves during resize dont inherit state *!
		drawMain.curves[1].setAim(-1);
		
		drawMain.clearLines(context);
		drawMain.clearCurves(context);
		
		context.save();
		context.fillStyle = "rgb(0, 0, 0, 1);";
		context.beginPath();
		var radius = (drawMain.lineSpan / 2);
		context.arc(drawMain.endx/2, drawMain.endy/2 - radius , radius, 0, 2*Math.PI);
		context.fill();
		context.restore();		
		
		//context.fillText("ABOUT", ( this.x - context.measureText("ABOUT").width / 2) , this.y1); // before fill
		context.save();
		drawMain.pathArea(context, 0);
		context.fillStyle = "rgb(255, 255, 255, 1)";
		context.fill();
		context.restore(); 
		
		drawMain.drawCurves(context);
		drawMain.drawLines(context);
		context.fillText("RESUME", ( this.x - context.measureText("RESUME").width / 2) , this.y0);		
		drawMain.drawName(context, drawMain.curves[2], drawMain.curves[3], "PERSON");
		
		if ((drawMain.checkAim() == 1) && (drawMain.menuState == 1)){
			drawTransition.aboutState = 2;
		}
	}
	
	drawTransition.prototype.aboutStateThree = function(context){ // enlarges the page
		if (this.scale < 75){
			this.scale += 1.5;
		}			
		
		context.save();		 
		context.transform(this.scale, 0, 0, this.scale, - ( (window.innerWidth / 2) * (this.scale - 1) ), - ( (window.innerHeight / 2 - 20) * (this.scale - 1) ));

		drawMain.clearLines(context);
		drawMain.clearCurves(context);		
		drawMain.drawCurves(context);
		drawMain.drawLines(context);

		// Draws pupil
			context.save();
			context.fillStyle = "rgb(0, 0, 0, 1);";
			context.beginPath();
			var radius = (drawMain.lineSpan / 2);
			context.arc(drawMain.endx/2, window.innerHeight/2 - radius , radius, 0, 2*Math.PI);
			context.fill();
			context.restore();
		
		drawMain.drawName(context, drawMain.curves[0], drawMain.curves[1], "RESUME");
		//drawMain.drawName(context, drawMain.curves[1], drawMain.curves[2], "ABOUT");
		drawMain.drawName(context, drawMain.curves[2], drawMain.curves[3], "PERSON");
		
		//console.log("Scale = " + this.scale);
		context.restore();
	}
	
	//    || About code start ||
	
	//    == Person code start ==
	
	drawTransition.prototype.toPerson = function(){
		/*transform: scaleY(-1); // value goes 1 to -100
		transform: rotate(90deg); // value goes 0 to 90 */
		// But rotations are performed around the point with respect to distance from dot to rotation point.
		// is it possible to make transition seamless??
		
		// Discrete persists in gradient solution, tears are inevitable
		
		// contour (line-curve-curve-line) is a "rail" for this animation - 
		// animation is a carriage that at the start 
		
		// lets look the carrige only
		// gradient transform is needed
		
		// lets take all pixels in carrige - N pixels fills 100% of transformation, so every pixel is doing just
		// 100/N % of transform. But is it possible to send 
		
		// every pixel gets transformed 
	}
	
	//    || Person code end ||
	
	//   ||| Transition code end |||
	
	// ===== Main start =====
	
	var drawTransition = new drawTransition();
	var mouseHandler = new MouseHandler();
	var sceneHandler = new SceneHandler();	
	//svar drawMain = new DrawMain();
	//MouseHandler.ale();
	init();	
	
	// ||||| Main end |||||
}
