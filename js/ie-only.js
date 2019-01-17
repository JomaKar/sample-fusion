(function() {


	function removeModernJquery(){
		var jqueryHighVScript = document.getElementById('jqueryScript');
		var body = document.getElementsByTagName('body')[0];
	    body.removeChild(jqueryHighVScript);
	}


	function onMicrosoftBrowser() {

	    var ua = window.navigator.userAgent;
	    var msie = ua.indexOf("MSIE ");

	    var head   = document.head || document.getElementsByTagName('head')[0],
    		styles = document.createElement('link');

    	styles.rel = 'stylesheet';

	    if (msie > 0){
	        var ieNum = parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));

	        console.log(ieNum);

	        if(ieNum == 8){
	        	removeModernJquery();
	        }

	        if(ieNum > 9){

	        	styles.href = 'css/styles-ie-10.css';
	        	head.appendChild(styles);
	        	sessionStorage.setItem('noFlex', '1');

	        }
	    }
	    else if(navigator.appName == "Netscape"){                       
	       /// in IE 11 the navigator.appVersion says 'trident'
	       /// in Edge the navigator.appVersion does not say trident

	       console.log(navigator.appName);

	       if(navigator.userAgent.indexOf('Trident') !== -1){
	       		styles.href = 'css/styles-ie-11.css';
		    	head.appendChild(styles);
		    	sessionStorage.setItem('noFlex', '1');
	       }

	    }else{
	    	console.log('other browser');
	    }
	}

	onMicrosoftBrowser();

})();