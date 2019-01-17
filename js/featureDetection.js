$(function(){

	var testElem = document.createElement('div');
	var conditional = document.querySelector('.conditional');
	
	if(testElem.style.backgroundClip == undefined || (testElem.style.textFillColor == undefined && testElem.style.webkitTextFillColor == undefined && testElem.style.MozTextFillColor == undefined)) {
		
		var ua = window.navigator.userAgent;
	    var msie = ua.indexOf("MSIE ");

	    if (msie < 0){
	    	conditional.setAttribute('href', 'css/extra.css');
	    }

	} else {
	  conditional.setAttribute('href', '#');
	}

});