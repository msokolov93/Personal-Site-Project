
		//   === Menu class start ===
	
	function DrawMain(endx = 640, endy = 640, lineSpan = 40, lineNum = 4, curveLength = 400, curveHeight = 75){ // sets const for scene
		this.endx = endx;
		this.endy = endy;
		this.lineSpan = lineSpan;
		this.lineNum = lineNum;
		this.curveLength = curveLength;
		this.curveHeight = curveHeight;
		this.menuState = 0; // variable for option chosen in the menu
		this.transition = 0; // 0 - no transition, 1 - resume, 2 - about, 3 - person
	}
	
	DrawMain.prototype.Constructor = function(context1, context2){ // Puts in place static parts of menu page
		drawMain.getCanvas(ctx1, ctx2); 
		drawMain.createCurves();
		drawMain.createLines();
	}
	
	DrawMain.prototype.getCanvas = function(context1, context2){ // gets resolution of canvas contexts
		this.endx = context1.canvas.width;
		this.endy = context1.canvas.height;
		//console.log("context1 size = [" + context1.canvas.width + "; " + context1.canvas.height + "] ");
		this.ctxDynamic = context1;
		this.ctxStatic = context2;
	}
	
	DrawMain.prototype.createLines = function(){ // creates array with lines
		var height = this.lineSpan * this.lineNum;	
		var y = Math.round( this.endy / 2 - height / 2 );
		
		this.lines = new Array();
		for( let i = 0; i < this.lineNum; i++){
			this.lines.push(new Line(y + i * this.lineSpan, this.curveLength));
		}
	}
	
	DrawMain.prototype.drawLines = function(context){	// draw lineNum of curves in their current state
		for( let i = 0; i < this.lineNum; i++){
			this.lines[i].drawLine(context);
		}
	}
	
	DrawMain.prototype.clearLines = function(context){ 	// clears the lines from screen !*todo not to clear center*
		for (let i = 0; i < 4 ; i++){
			context.save();
			context.fillStyle = 'rgb(255,255,255,1)';
			context.fillRect(0, this.lines[i].y-2, this.endx, this.lineNum * this.lineSpan-2);
			context.restore();
		}
	}
		
	DrawMain.prototype.createCurves = function(){ 		// create array of curves
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
	
	DrawMain.prototype.drawCurves = function(context){	// draw lineNum of curves in their current state
		for (let i = 0; i < this.lineNum; i++){
			this.curves[i].drawCurve(context);
		}
	}
	
	/*
	DrawMain.prototype.clearCurvesOld = function(context){ // clears the area with curves (center)
		var endx = drawMain.endx;
		var endy = drawMain.endy;
	
		var height = drawMain.lineSpan * drawMain.lineNum;
		var length = drawMain.curveLength;		

		var y1 = Math.round( endy / 2 - height / 2);
		var x1 = Math.round( endx / 2 - length / 2);
		
		context.save();
		context.fillStyle = 'rgb(255,255,255,1)';
		context.fillRect(x1 ,y1-drawMain.curveHeight-10, length, height+2*drawMain.curveHeight); // top left to bottom right
		context.restore();
	}
	*/
	
	DrawMain.prototype.clearCurves = function(context){
		for (let i = 0; i < this.lineNum; i++){
			this.curves[i].clearCurve(context);
		}
	}
	
	DrawMain.prototype.checkState = function(context){ // checks position of cursor and changes state of animation
		var clientX = mouseX;
		var clientY = mouseY;
		var cursorArea = drawMain.cursorArea(context, clientX, clientY);
		drawMain.changeState(context, cursorArea);
	}

	DrawMain.prototype.changeState = function(context, state){ // changes state of curve animation
		this.menuState = state;
		if (state == 0){
			for(var i = 0; i < this.lineNum; i++ ){
				this.curves[i].setAim(0);
			}
		} else if (state != 0){
			for(var i = 0; i < this.lineNum; i++){
				if( i < state ) {
					this.curves[i].setAim(-1);
				} else if ( i >= state ){
					this.curves[i].setAim(1);
				}
			}
		}
		//console.log("menuState = " + this.menuState);
	}	
	
	DrawMain.prototype.cursorArea = function(context, clientX, clientY){ // returns value with number of area with cursor in it ( 0 - empty space, 1 - resume, etc )
		var clientX = clientX;
		var clientY = clientY;
		var curvesState = 0; 
		
		if(context != undefined){
			for(let i = 0 ; i < this.lineNum-1 ; i++){
				this.pathArea(context, i);
				if (context.isPointInPath(clientX, clientY)){ // spread the curves
					curvesState = i+1;	
				}
			}
			return curvesState;
		}
		else 
			console.log("context is undefined in drawMain.cursorArea");
	}
	
	DrawMain.prototype.pathArea = function(context, curveNum){  // returns path of menu areas
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
	
	DrawMain.prototype.drawMenu = function(context1){ // sets the drawing functions for menu
		var context = context1;	 // context is set here
		
		if (drawMain.transition == 0){ // animation must finish before next phase
			drawMain.checkState(context); 
		}
		drawMain.clearCurves(context);
		drawMain.drawLines(context);
		drawMain.drawCurves(context);
		drawMain.drawMenuText(context);	
	}
		
	DrawMain.prototype.drawMenuText = function(context){ // draws text between the lines
		drawMain.drawName(context, this.curves[0], this.curves[1], "RESUME");
		drawMain.drawName(context, this.curves[1], this.curves[2], "ABOUT");
		drawMain.drawName(context, this.curves[2], this.curves[3], "PERSON");
	}
	
	DrawMain.prototype.drawName = function(context, curve1, curve2, word){	// draws a word between two curve !*curve object can be replaced with curve num*!
		var context = context;
		
		var x = Math.round( curve1.getCrestX() - context.measureText(word).width / 2 );
		var y = Math.round( (curve1.getCrestY() + curve2.getCrestY()) / 2 + FontSize / 3 );
		
		context.fillText(word, x, y);
	}
	
	DrawMain.prototype.checkAim = function(){ // checks if menu animation has finished
		for (let i = 0; i < this.lineNum; i++){
			if ( this.curves[i].aim != this.curves[i].shape){
				//console.log("curve[" + i + "] is not ready");
				return 0;
			}
		}
		return 1;
	}
			
	//   ||| Menu class end |||	
	
	//   === Line class start ===
	
	function Line (y = 0, gap = 400, x = 0){ // Line needs X parameter that says where a gap starts. Middle minus half of gap by default
		//this.endx = drawMain.endx;
		this.x = x;
		this.y = y;
		this.gap = gap;
		//this.length = (endx - gap) / 2;
	}
	
	Line.prototype.drawLine = function(context){
		let y = this.y;
		let gap = this.gap;
		let endx = context.canvas.width;
		let length = (endx - gap) / 2 + this.x;
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

	//   ||| Line class end |||
	
	//   === Curve class start ===
	
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
	
	Curve.prototype.clearCurve = function(context){
		context.save();
		context.fillStyle = 'rgb(255,255,255,1)';
		context.fillRect(this.x , this.y-drawMain.curveHeight-1, this.length, this.height+2*drawMain.curveHeight); // top left to bottom right
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
	
	//   ||| Curve class end |||
	
	//   === Transition code start ===
	
	function DrawTransition(){ // static scope for transition animations
	}
	
	DrawTransition.prototype.init = function(){
		this.resumeState = 0; // state of resume transition
		this.aboutState = 0;
		this.personState = 0;
		
		// Resume State One
		this.alpha = Math.PI / 2;
		this.oneFrames = 27;
		this.oneRate = this.alpha / this.oneFrames ;  // 27 frames depends on speed of curves animation
		
		// Resume State Two
		this.twoFrames = 53; 
		this.twoRate = this.alpha / this.twoFrames ; // (pi / 2) / frames
		
		// About State Three
		this.scale = 0;
			
		// Person State One			
		this.betta = (Math.PI / 2) / this.oneFrames ;		
		this.velocity = window.innerHeight / this.oneFrames;
		this.delta = 0;
	}
	
	//    == Resume code start ==
	
	DrawTransition.prototype.toResume = function(){
		switch (drawTransition.resumeState){			
			case 0: 
				drawTransition.resumeStateOne(ctx1);
			break;
			case 1: 
				drawTransition.resumeStateTwo(ctx1);
			break;
			case 2:
				console.log("Scene = Resume");
				sceneHandler.scene = 1;
				DisplayScene('resumecontainer');
			break;
		}
	}
	
	DrawTransition.prototype.resumeStateOne = function(context){
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
	
	DrawTransition.prototype.resumeStateTwo = function(context){
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
		}		
	
	}		

	
	//    || Resume code end ||
	
	//    == About code start ==
	
	DrawTransition.prototype.toAbout = function(){
		switch (drawTransition.aboutState){			
			case 0: 
				drawTransition.aboutStateOne(ctx1);
				console.log("aboutStateOne");
			break;
			case 1: 
				drawTransition.aboutStateTwo(ctx1);
				console.log("aboutStateTwo");
			break;
			case 2:
				drawTransition.aboutStateThree(ctx1);
				console.log("aboutStateThree");
			break;
			case 3:
				console.log("Scene = About");
				sceneHandler.scene = 2;
				DisplayScene('aboutcontainer');
			break;
		}
	}
	
	DrawTransition.prototype.aboutStateOne = function(context){ // doesnt work on page resize
		
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
	
	DrawTransition.prototype.aboutStateTwo = function(context){ // !* Recreated curves during resize dont inherit state *!
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
	
	DrawTransition.prototype.aboutStateThree = function(context){ // enlarges the page
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
		
		context.restore();
		if ( this.scale >= 75){
			drawTransition.aboutState = 3;
		}
	}
	
	//    || About code start ||
	
	//    == Person code start ==
	
	DrawTransition.prototype.toPerson = function(){
		switch (drawTransition.personState){			
			case 0: 
				drawTransition.personStateOne(ctx1);
			break;
			case 1: 
				console.log("Scene = Person");
				sceneHandler.scene = 3;
				DisplayScene('personcontainer');
			break;
		}
	}
	
	DrawTransition.prototype.personStateOne = function(context){	

		drawMain.clearLines(context);	
		drawMain.clearCurves(context);
	
		this.delta += Math.sin(this.betta) * this.velocity; // sin( pi/(2 * 27) ) * window.innerHeight / 27
	
		for(let i = 0; i < 3; i++){
			drawMain.curves[i].x += this.delta / 2; // top goes right
			drawMain.lines[i].x += this.delta / 2;
			drawMain.curves[i].y -= this.delta;		// top goes up
			drawMain.lines[i].y -= this.delta;
		}
		
		drawMain.curves[3].x -= this.delta / 2; 	// bottom goes left
		drawMain.lines[3].x -= this.delta / 2;	
		drawMain.curves[3].y += this.delta; 		// bottom goes down
		drawMain.lines[3].y += this.delta;			
		
		drawMain.drawLines(context);
		drawMain.drawCurves(context);
		
		drawMain.drawName(context, drawMain.curves[0], drawMain.curves[1], "RESUME");
		drawMain.drawName(context, drawMain.curves[1], drawMain.curves[2], "ABOUT");
		//drawMain.drawName(context, drawMain.curves[2], drawMain.curves[2]+, "PERSON");
		let y0 = (drawMain.curves[2].y + (drawMain.curves[2].y - drawMain.curves[1].y) / 2 + FontSize / 3); // height for 3rd word
		context.fillText("PERSON", ( drawMain.curves[2].getCrestX() - context.measureText("PERSON").width / 2) , y0);
		
		if (drawMain.lines[2].y <= -100){
			drawTransition.personState = 1;
		}	
	}

	//    || Person code end ||
	
	//   ||| Transition code end |||
	//var drawMain = new DrawMain();