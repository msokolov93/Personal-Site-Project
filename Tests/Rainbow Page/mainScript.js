window.onload = function() {
	var canvas = document.getElementById('mainCanvas');
		var ctx = canvas.getContext("2d");
		
		// Canvas by the size of the page
		ctx.canvas.width  = window.innerWidth;
		ctx.canvas.height = window.innerHeight;
		
		// The target frames per second (how often do we want to update / redraw the scene)
		var targetFPS = 30;
	
		// Scene variable
		var current_scene = 'homepage';				
		
		// Animation timer class
		//function timer (cnt 0 )
		
		// Curve class
		function curve (step = 20, x = 0, y = 0, del = 0, del_i = 1){
			this.step = step;
			this.x = x;
			this.y = y;
			this.del = del;
			this.del_i = del_i;
		}		
		
		// Curve movement 
		curve.prototype.move = function(speed = 1){					
			// wave direction 
			this.del += this.del_i * speed;
			if (this.del >= this.step){
				this.del_i = -1;
			}
			if (this.del <= 0){
				this.del_i = 1;
			}			
		}
		
		// Curve function
		curve.prototype.draw = function(offsetx, offsety){
			this.x += offsetx;
			this.y += offsety;
			ctx.save();
			
			// start of path
			ctx.beginPath();
			ctx.moveTo(this.x, this.y);
			
			// changing bezier curve 
			ctx.bezierCurveTo(this.x + this.del, this.y, this.x + 2*this.step-this.del, this.y + this.step, this.x + 2*this.step, this.y + this.step);
			ctx.bezierCurveTo(this.x + 2*this.step+this.del, this.y + this.step, this.x + 4*this.step-this.del, this.y, this.x + 4*this.step, this.y);
			
			ctx.stroke();			
			this.x -= offsetx;
			this.y -= offsety;
			ctx.restore();
		}
		
		// Color wheel class
		function colorwheel (color_min = 0, color_max = 255, speed = 1, offset = 0) {
			this.color_min = color_min;
			this.color_max = color_max;
			this.speed = speed;
			this.color_step = offset;
			
			this.red = 0;
			this.green = 0;
			this.blue = 0;
		}
		
		// Color wheel method
		colorwheel.prototype.rollcolor = function() {
		
			// autoscroll; limited by the maximum difference in colors (length of circle)
			this.color_step += this.speed;
			if (this.color_step > (this.color_max-this.color_min)*6)
				this.color_step = 1;
			if (this.color_step < 1)
				this.color_step = (this.color_max-this.color_min)*6;
				
			// start point for roll. i.e watch algorithm further.
			let icolor = [this.color_min, this.color_max, this.color_min];		
			
			// to change a starting poing, cycle should be reshaped.
			for (let j = 0; j < this.color_step; j++){						
										
				// skip full parts
				let i = Math.trunc(j / (this.color_max-this.color_min) );
				// pick current color, choose if its time to add or substract
				icolor[i%3] += i%2>0 ? -1 : 1;
				// fill the color	
			}				
			this.red = icolor[0];   
			this.green = icolor[1];
			this.blue = icolor[2];
		}
		
		// Color wheel change context.fillStyle 
		colorwheel.prototype.changeFill = function(opacity = 1){
			ctx.fillStyle = 'rgba(' + this.red + ', ' + this.green +	', ' + this.blue + ',' + opacity + ')';
		}
		
		// Color wheel change context.strokeStyle
		colorwheel.prototype.changeStroke = function(opacity = 1){
			ctx.strokeStyle = 'rgba(' + this.red + ', ' + this.green +	', ' + this.blue + ',' + opacity + ')';
		}
		
		// Homepage setup
		var step = 24; 	// Length of waves
		var curve_speed = 0.2; // 
		// Number of waves x;y
		var repeatx = Math.floor(window.innerWidth / (step*2));	
		var repeaty = Math.floor(window.innerHeight / step);
		var curve = new curve(step);

		var color_bg = new colorwheel(235, 255, 0.1);
		var color_curve = new colorwheel(64, 128, 0.32, 32);
		var color_menu = new colorwheel(20, 60, 0.2, 20);
		
		
		// Print background on home page  
		function page_home_background()  {
		// change page background color
			ctx.save();
			color_bg.rollcolor();			
			color_bg.changeFill();			
			ctx.fillRect(0,0, canvas.width, canvas.height);
			ctx.restore();
		}
		
		// Pring waves on home page
		function page_home_waves() {
			// Populate page with curve
			ctx.save();
			color_curve.rollcolor();
			color_curve.changeStroke();
			ctx.lineWidth = 1;
			curve.move(curve_speed);
			for(let i = 0; i < repeatx; i++){
				for(let j = 0; j < repeaty; j++){					 
					 curve.draw(i*step*4-step, step*4*j+98);
				}
			}		
			ctx.restore();
		}
		
		// Pring menu on home page
		function page_home_menu() {
			ctx.save();
			//ctx.font = '24px DINPro-Light';
			color_menu.rollcolor();
			color_menu.changeFill();
			ctx.font = '24px Luganskiy';
			ctx.fillText('PERSON', 40, 58);
			ctx.fillText('RESUME', 215, 58);
			ctx.fillText('CONTACT', 390, 58);
			ctx.restore();
		}
		
		// Scene function - home page
		function scene_homepage() {
			page_home_background();
			page_home_waves();
			page_home_menu();
		}
				  
		// Global draw function 	  
		function draw(){
			ctx.clearRect(0,0, canvas.width, canvas.height);
			
			switch(current_scene) {
				case 'homepage':
					scene_homepage();
				break;
				default: 
					scene_homepage();
			}
		}

		// Event handler
		
		
		
		//scene_homepage_setup();
		
		setInterval(draw, 1000 / targetFPS);
		
}