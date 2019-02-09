	var ctx1, ctx2;

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