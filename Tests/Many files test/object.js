function init(){
	let a = 1;
}

init.prototype.test = function(){
	let a = 2;
	return a;
}

var init = new init();