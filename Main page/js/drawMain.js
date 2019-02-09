		//   === Menu class start ===
	
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
	
	drawMain.prototype.Constructor = function(context1, context2){ // Puts in place static parts of menu page
		drawMain.getCanvas(context1, context2); 
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
		var clientX = MouseHandler.getX;
		var clientY = MouseHandler.getY;
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
	
	drawMain.prototype.drawMenu = function(context1){ // sets the drawing functions for menu
		var context = context1;	 // context is set here
		
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
			
	//   ||| Menu class end |||	
	
	//   === Line class start ===
	
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
	
	var drawMain = new drawMain();