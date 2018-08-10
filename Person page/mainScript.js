window.onload = function() {
	var centerY = (window.innerHeight - 630) / 2;
	document.getElementById("wrapper").style.marginTop = centerY + "px";
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
	
	document.onmousemove = function (e) {
		var clientX = e.clientX;
		var clientY = e.clientY;

		var sideX = ( (window.innerWidth / 2) - clientX) / (window.innerWidth /2);
		var sideY = ( (window.innerHeight / 2) - clientY) / (window.innerWidth /2);
		
		console.log(sideX);
		document.getElementById("me").style.marginLeft = sideX*20 + 'px';
		document.getElementById("me").style.marginTop = sideY*10 + 'px';
		
		document.getElementById("myhand").style.marginLeft = sideX*10 + 'px';
		document.getElementById("myhand").style.marginTop = sideY*10 + 'px';
	}
	
}