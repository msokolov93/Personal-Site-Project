window.onload = function() {
	var targetFPS = 30;
	var d = 1;
	function main() {
		var htmlCanvas = document.getElementById('ImageCanvas');
		var	context = htmlCanvas.getContext('2d');
		
		initialize();
 
		function initialize() {
			window.addEventListener('resize', resizeCanvas, false);
			resizeCanvas();
		}
			
		function redraw() {
			context.strokeStyle = 'blue';
			context.lineWidth = '5';
			context.strokeRect(0, 0, window.innerWidth, window.innerHeight);
		}
		
		function resizeCanvas() {
			htmlCanvas.width = window.innerWidth;
			htmlCanvas.height = window.innerHeight;
			//redraw();
		}
		
	//	var img = new Image();   // Create new img element
	
		//img.addEventListener('load', function() {
			//context.drawImage(img, (window.innerWidth - 521) / 2, (window.innerHeight - 768) / 2, 521, 768);
			//ctx.fillStyle(0,0,0);
			if ( d > 0 ) {
				d -= 0.01;
			}
			if ( d <= 0) {
				d = 1;
			}
			//context.moveTo((window.innerWidth - 500) / 2, window.innerHeight / 2);
			var height = window.innerHeight / 2;
			var width = (window.innerWidth - 500) / 2;
			context.save();
			context.setTransform(1, 0, 0, d, 0, height - d * height );			
			context.font = '300px serif';
			context.fillText("sleepy", width, height);
			context.restore();
		//}, false);
		//img.src = 'myImage.jpg'; */
		
		//setInterval(letsdraw, 1000 / targetFPS);
 // Set source path
		/*  
		var sin = Math.sin(Math.PI / 6);
		var cos = Math.cos(Math.PI / 6);
		ctx.translate(100, 100);
		var c = 0;
		for (var i = 0; i <= 12; i++) {
			с = Math.floor(255 / 12 * i);
			ctx.fillStyle = 'rgb(' + c + ', ' + c + ', ' + c + ')';
			ctx.fillRect(0, 0, 100, 10);
			ctx.transform(cos, sin, -sin, cos, 0, 0);
		}
		  
		ctx.setTransform(-1, 0, 0, 1, 100, 100);
		ctx.fillStyle = 'rgba(255, 128, 255, 0.5)';
		ctx.fillRect(0, 50, 100, 100);*/
	}
	//main();
	setInterval(main, 1000 / targetFPS);
}