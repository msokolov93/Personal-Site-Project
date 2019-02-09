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

var fpsInterval, startTime, now, then, elapsed;

window.onload = function() {


	
	// ===== Function declarations start =====
	
	//  ==== Initialize operations start ====
	
	function init(){
		
		setCanvas();	// set canvas layers and style		
		console.log("setCanvas working");
		
		initEvents();	// assign events
		console.log("initEvents working");
		
		initConstructors(); // runs construction methods		
		
		initUpdated();  // draw curves and text
	}
	
	function initEvents(){ 
		mouseHandler.eventHandler(canvas1);
	}
	
	function initConstructors(){
		drawMain.Constructor(ctx1, ctx2); 
	}
	
	function initUpdated(){
		requestAnimationFrame(SceneHandler.Updated);
	}
	
	//  |||| Initialize operations end ||||
	
	//  ==== Canvas properties start ====
	/*
	function setCanvas(){ // action ctx1; background ctx2
		canvas1 = document.getElementById('actionCanvas');
			ctx1 = canvas1.getContext("2d");
		canvas2 = document.getElementById('backgroundCanvas');
			ctx2 = canvas2.getContext("2d");
			
		setSizeCanvas(ctx1);
		setSizeCanvas(ctx2);
		
		setStyleCanvas(ctx1);
		setStyleCanvas(ctx2);		
	}
	
	function setSizeCanvas(context){ //no var context might be error
		if (window.innerHeight >= 640){
			context.canvas.height = window.innerHeight;
		} else {
			context.canvas.height = 640;
		}
		
		if (window.innerWidth >= 640){
			context.canvas.width = window.innerWidth;
		} else {
			context.canvas.width = 640;
		}
	}

	function setStyleCanvas(context){ //no var context might be error
		context.lineWidth = 2;
		context.strokeStyle = 'rgb(0,0,0,1)';
		context.font = FontSize + 'px Luganskiy';
		context.save();
		context.fillStyle = 'rgb(255,255,255,1)';
		context.fillRect(0, 0, window.innerWidth, window.innerHeight);
		context.restore();
	}
	*/
	//  |||| Canvas properties end ||||	
	
	//  ==== Global screen scope start ====
	
	//   === Screen handler class start ===
	
	function SceneHandler(){
		this.scene = 0; // menu
	}
	
	SceneHandler.prototype.Updated = function(){
		if (SceneHandler.scene == 0){
			SceneHandler.Menu();
		}
		
		setTimeout(function() {
			requestAnimationFrame(SceneHandler.Updated);			
		}, 1000 / targetFPS);
	}
	
	SceneHandler.prototype.Menu = function(){
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
	
	function MouseHandler(){
		this.clientX = 0;
		this.clientY = 0;
	}
	
	MouseHandler.prototype.eventHandler = function(canvas){
		window.onresize = function(){ // resize window event
			//if( drawMain.transition != 0 ){
				setCanvas();
				drawMain.Constructor();
			//}
		}
		canvas.onmousemove = function (e) {
			MouseHandler.clientX = e.clientX;
			MouseHandler.clientY = e.clientY;
		}	
		canvas.onclick = function (e) {
			if (SceneHandler.scene == 0 && drawMain.transition == 0){
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
	
	//  |||| Global Screen scope end ||||
	
	//  ==== Main page scope start ====
	
	//   === Menu class start ===
	/*
	function drawMain(endx = 640, endy = 640, lineSpan = 40, lineNum = 4, curveLength = 400, curveHeight = 75){ // sets const for scene
		this.endx = endx;
		this.endy = endy;
		this.lineSpan = lineSpan;
		this.lineNum = lineNum;
		this.curveLength = curveLength;
		this.curveHeight = curveHeight;
		this.menuState = 0; // variable for option chosen in the menu
		this.transition = 0; // 0 - no transition, 1 - resume, 2 - about, 3 - person
	}
	
	drawMain.prototype.Constructor = function(context){ // Puts in place static parts of menu page
		drawMain.getCanvas(ctx1, ctx2); 
		drawMain.createCurves();
		drawMain.createLines();
	}
	
	drawMain.prototype.getCanvas = function(context1, context2){ // gets resolution of canvas contexts
		this.endx = context1.canvas.width;
		this.endy = context1.canvas.height;
		this.ctxDynamic = context1;
		this.ctxStatic = context2;
	}
	
	drawMain.prototype.createLines = function(){ // creates array with lines
		var height = this.lineSpan * this.lineNum;	
		var y = Math.round( this.endy / 2 - height / 2 );
		
		this.lines = new Array();
		for( let i = 0; i < this.lineNum; i++){
			this.lines.push(new Line(y + i * this.lineSpan, this.curveLength));
		}
	}
	
	drawMain.prototype.drawLines = function(context){	// draw lineNum of curves in their current state
		for( let i = 0; i < this.lineNum; i++){
			this.lines[i].drawLine(context);
		}
	}
	
	drawMain.prototype.clearLines = function(context){ 	// clears the lines from screen !*todo not to clear center*
		for (let i = 0; i < 4 ; i++){
			context.save();
			context.fillStyle = 'rgb(255,255,255,1)';
			context.fillRect(0, this.lines[i].y-2, this.endx, this.lineNum * this.lineSpan-2);
			context.restore();
		}
	}
		
	drawMain.prototype.createCurves = function(){ 		// create array of curves
		var endx = this.endx;
		var endy = this.endy;
		
		var height = this.lineSpan * this.lineNum;
		var length = this.curveLength;		
		
		var x = Math.round( endx / 2 - length / 2 );
		var y = Math.round( endy / 2 - height / 2 );
		
		this.curves = new Array();
		for (let i = 0; i < this.lineNum; i++){
			this.curves.push(new Curve(x, y + i * drawMain.lineSpan, this.curveLength, this.curveHeight, 0));
		}
	}
	
	drawMain.prototype.drawCurves = function(context){	// draw lineNum of curves in their current state
		for (let i = 0; i < this.lineNum; i++){
			this.curves[i].drawCurve(context);
		}
	}
	
	drawMain.prototype.clearCurves = function(context){ // clears the area with curves !*math incorrect*!
		var endx = drawMain.endx;
		var endy = drawMain.endy;
	
		var height = drawMain.lineSpan * drawMain.lineNum;
		var length = drawMain.curveLength;		

		var y1 = Math.round( endy / 2 - height / 2);
		var x1 = Math.round( endx / 2 - length / 2);
		
		context.save();
		context.fillStyle = 'rgb(255,255,255,1)';
		context.fillRect(x1 ,y1-drawMain.curveHeight-1, length, height+2*drawMain.curveHeight); // top left to bottom right
		context.restore();
	}
	
	drawMain.prototype.checkState = function(context){ // checks position of cursor and changes state of animation
		var clientX = MouseHandler.getX();
		var clientY = MouseHandler.getY();
		//console.log('x = ' + clientX + '. y = ' + clientY);
		var cursorArea = drawMain.cursorArea(context, clientX, clientY);
		drawMain.changeState(context, cursorArea);
	}

	drawMain.prototype.changeState = function(context, state){ // changes state of curve animation
		this.menuState = state;
		if (state == 0){
			for(var i = 0; i < this.lineNum; i++ ){
				this.curves[i].setAim(0);
			}
		} else if (state != 0){
			//console.log("new state = " + state);
			for(var i = 0; i < this.lineNum; i++){
				if( i < state ) {
					this.curves[i].setAim(-1);
				} else if ( i >= state ){
					this.curves[i].setAim(1);
				}
			}
		}
	}	
	
	drawMain.prototype.cursorArea = function(context, clientX, clientY){ // returns value with number of area with cursor in it ( 0 - empty space, 1 - resume, etc )
		var clientX = clientX;
		var clientY = clientY;
		var curvesState = 0; 
		
		for(let i = 0 ; i < this.lineNum-1 ; i++){
			this.pathArea(context, i);
			if (context.isPointInPath(clientX, clientY)){ // spread the curves
				curvesState = i+1;				
			}
		}
		return curvesState;
	}
	
	drawMain.prototype.pathArea = function(context, curveNum){  // returns path of menu areas
		var curve1 = this.curves[curveNum];
		var curve2 = this.curves[curveNum+1];
		
		context.save();
		context.beginPath();
		
		curve1.pathCurve(context);
		context.lineTo(curve2.x + curve2.length, curve2.y);
		curve2.pathCurve(context, 1);
		context.lineTo(curve1.x, curve1.y);
		
		context.closePath();
		context.restore();		
	}
	
	drawMain.prototype.drawMenu = function(){ // sets the drawing functions for menu
		var context = ctx1;	 // context is set here
		
		if (drawMain.transition == 0){ // animation must finish before next phase
			drawMain.checkState(context); 
		}
		drawMain.clearCurves(context);
		drawMain.drawLines(context);
		drawMain.drawCurves(context);
		drawMain.drawMenuText(context);	
	}
		
	drawMain.prototype.drawMenuText = function(context){ // draws text between the lines
		drawMain.drawName(context, this.curves[0], this.curves[1], "RESUME");
		drawMain.drawName(context, this.curves[1], this.curves[2], "ABOUT");
		drawMain.drawName(context, this.curves[2], this.curves[3], "PERSON");
	}
	
	drawMain.prototype.drawName = function(context, curve1, curve2, word){	// draws a word between two curve !*curve object can be replaced with curve num*!
		var context = context;
		
		var x = Math.round( curve1.getCrestX() - context.measureText(word).width / 2 );
		var y = Math.round( (curve1.getCrestY() + curve2.getCrestY()) / 2 + FontSize / 3 );
		
		context.fillText(word, x, y);
	}
	
	drawMain.prototype.checkAim = function(){ // checks if menu animation has finished
		for (let i = 0; i < this.lineNum; i++){
			if ( this.curves[i].aim != this.curves[i].shape){
				//console.log("curve[" + i + "] is not ready");
				return 0;
			}
		}
		return 1;
	}
	*/	
	//   ||| Menu class end |||		

	//   === Main transition code start ===
	
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
		
		console.log("Scale = " + this.scale);
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
	
	//   ||| Main transition code end |||
	
	//   === Line class start ===
	/*
	function Line (y = 0, gap = 400){
		//this.endx = drawMain.endx;
		this.y = y;
		this.gap = gap;
		//this.length = (endx - gap) / 2;
	}
	
	Line.prototype.drawLine = function(context){
		let y = this.y;
		let gap = this.gap;
		let endx = drawMain.endx;
		let length = (endx - gap) / 2;
		context.save();
		context.beginPath();
		
		context.moveTo(0, y);
		context.lineTo(length, y);
		
		context.stroke();
		context.beginPath();
		context.moveTo(length + gap, y);
		context.lineTo(endx, y);

		context.stroke();		
		context.restore();		
	}
	*/
	//   ||| Line class end |||
	
	//   === Curve class start ===
	/*
	function Curve (x = 0, y = 0 , length = 400, height = 75, shape = 0){ //class, not a constructor
		this.x = x;
		this.y = y;
		this.length = length;
		this.height = height;
		this.shape = shape;
		this.aim = shape;
	}	
	
	Curve.prototype.getCrestX = function(){ // used for text
		return this.x + this.length / 2;
	}
	
	Curve.prototype.getCrestY = function(){ // used for text
		return this.y + this.shape * this.height;
	}
	
	Curve.prototype.setAim = function(aim){ // changed by events
		this.aim = aim;
	} 
	
	Curve.prototype.changeShape = function(){ // constant speed
		var aim = this.aim;
		var maxSpeed = 0.064; // somewhere here the number of frames is hidden
		var minSpeed = 0.032;
		var step = Math.max( (Math.abs(1 - Math.abs(this.shape)) * maxSpeed) , minSpeed);
		var step = Math.min( step , maxSpeed);
		
		if (this.shape > aim){ 
			this.shape -= step;
			if (this.shape < aim)
				{ this.shape = aim; }
		} else if (this.shape < aim){
			this.shape += step;
			if (this.shape > aim)
				{ this.shape = aim; }
		}
	}		
	
	Curve.prototype.drawCurve = function(context){ // draws path of curve
		context.save();
		context.beginPath();
		this.pathCurve(context);
		context.stroke();			
		context.restore();
	}
	
	Curve.prototype.pathCurve = function(context, negative = 0){ // need to obey drawMain and be like drawLines
		var context = context;
		var height = this.height;
		var length = this.length;
		var x = this.x;
		var y = this.y;	
		
		this.changeShape();		
		height *= this.shape;
		
		var x1 = x + Math.round(length / 4);
		var y1 = y;
		
		var x2 = x + Math.round(length / 4);
		var y2 = y + height;
		
		var x3 = x + Math.round(length / 2);
		var y3 = y + height;
		
		var x4 = x + Math.round(length * (3/4));
		var y4 = y + height;
		
		var x5 = x + Math.round(length * (3/4));
		var y5 = y;
		
		var x6 = x + length;
		var y6 = y;
		
		// changing bezier curve 
		if (negative == 0){
			context.moveTo(x, y);
			context.bezierCurveTo(x1, y1, x2, y2, x3, y3);
			context.bezierCurveTo(x4, y4, x5, y5, x6, y6);
		} else if (negative == 1){
			context.moveTo(x6, y6);
			context.bezierCurveTo(x5, y5, x4, y4, x3, y3);
			context.bezierCurveTo(x2, y2, x1, y1, x, y);
		}	
	}
	*/
	//   ||| Curve class end |||
	
	//  |||| Main page scope end ||||
	
	// ||||| Function declarations end |||||
	
	// ===== Main start =====
	
	var drawTransition = new drawTransition();
	var SceneHandler = new SceneHandler();
	//var MouseHandler = new MouseHandler();
	//var drawMain = new drawMain();
	//MouseHandler.ale();
	init();	
	
	// ||||| Main end |||||
}
