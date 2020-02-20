Java.perform(function () {
    // Function to hook is defined here
    var Activity = Java.use('com.android.insecurebankv2.PostLogin');
    var s = "apple"

    Activity.doesSuperuserApkExist.implementation = function(s){	// 
  	console.log("Hooking Function");  

	var ret = this.doesSuperuserApkExist(s);
	    console.log(ret);
	ret = true;
	    console.log(ret);
	return ret;
    
    };
});