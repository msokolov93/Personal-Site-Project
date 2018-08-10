window.onload = function() {
	
	var homeVisible = 0;
	//var clientX, clientY;
	
	document.getElementById("home0").onmouseover = function(){		
		homeVisible = 1;		
	}
	
	document.getElementById("homeButton").onmouseover = function(){		
		if (homeVisible == 1){
			document.getElementById("home2").style.visibility = "visible";
			document.getElementById("home1").style.visibility = "visible";
		}
	}
	
	document.getElementById("homeButton").onmouseleave = function(){
		homeVisible = 0;
		document.getElementById("home2").style.visibility = "hidden";
		document.getElementById("home1").style.visibility = "hidden";
	}
	
	// Code that writes text on canvas
	
	
	
}