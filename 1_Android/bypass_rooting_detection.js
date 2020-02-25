Java.perform(function() {

		/*Use Below when Codes writes with System Exit (0) to check rooting*/
		var exitClass = Java.use("java.lang.System");
		exitClass.exit.implementation = function(){
      		console.log("[**] System.exit Called!");
    	}

    	/*Use Below when Codes writes with just return ; to check rooting*/
//    	var rootClass2 = Java.use("com.audiapp.crmdealer.IntroActivity");
//    	console.log("???")
//    	rootClass2.init.implementation = function(){
//    		console.log("No Return");
//   	}

    	/*Use Below when Codes writes with return boolean to check rooting;*/
//		var rootClass = Java.use("com.audiapp.crmdealer.e.d");
//    	rootClass.a.overload().implementation = function(){
//    		console.log("Rooting?");
//    		return false;
//    	}


}, 0);
