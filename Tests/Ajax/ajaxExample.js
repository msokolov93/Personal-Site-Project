window.onload = function() {

	document.getElementById("change").onclick = function(e){
		var iframe = document.getElementById("iframe");
		iframe.src = "https://docs.google.com/document/d/e/2PACX-1vTH1rrEZw_vCU4DcB1hvA6kGtEZF18kN4i2eno-bb6idqxZAHuoGyfANAZlWGOoMCYYy_JAbbQ1XyD0/pub?embedded=true";
		iframe.style.visibility = "visible";
	}
}