	function MouseHandler(){
		this.clientX = 0;
		this.clientY = 0;
	}

	MouseHandler.prototype.eventHandler = function(canvas){
		window.onresize = function(){ // resize window event
			if( drawMain.transition != 0 ){
				setCanvas();
				drawMain.Constructor();
			}
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

	MouseHandler.prototype.ale = function(){
		return "MouseHandler";
	}

	var mouseHandler = new MouseHandler();
