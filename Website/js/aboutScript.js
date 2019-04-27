var aboutTextExists = 0;

function runAboutText(){
	if (aboutTextExists == 0){ 
		var typed = new Typed('#typed', {
			stringsElement: '#typed-strings',
			typeSpeed: 30
		});
		aboutTextExists = 1;
	}
}