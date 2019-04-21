
	var homeVisible = 0;	
	var home0List = document.getElementsByClassName("btnHomeMain");
	var homeButtonList = document.getElementsByClassName("HomeButton");
	var btnHomeList = document.getElementsByClassName("btnHome");
	
	for(var i=0; i < home0List.length; i++) { 
		home0List[i].onmouseover = function(){
			homeVisible = 1;
		}
	}
	
	for(var i=0; i < homeButtonList.length; i++){
		
		homeButtonList[i].onmouseover = function(){
			//console.log("OnMouseOver worked!");
			if (homeVisible == 1){
				for(var j=0; j < btnHomeList.length; j++){
					btnHomeList[j].style.visibility = "visible";
				}
			}
		}
		
		homeButtonList[i].onmouseleave = function(){
			//console.log("OnMouseLeave worked!");
			homeVisible = 0;
			for(var j=0; j < btnHomeList.length; j++){
				btnHomeList[j].style.visibility = "hidden";
			}
		}
	}	
