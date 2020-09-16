//frida -U -l bypassJB.js -f kr.lottedfs.Guide --no-pause

if(ObjC.available){
	send("\nbypassJB() is activated....\n\n")
	var classHook = ObjC.classes.IntroViewController["- isJailbroken"];

	Interceptor.attach(classHook.implementation, {
		onEnter: function(args) {
			console.log("\n")
			console.log("\t[\tfunc. OnEnter\t]\n\n")
		},

		onLeave: function(retval){
			console.log("\t[\tfunc. OnLeave\t]\n\n")
			console.log("\t[*] "+retval+" ; (return value of func.)")
			retval.replace(0x0)
			console.log("\t[+] "+retval+" ; (Injected RET.)")
		}

	});

}else{
	console.log("[Warning] Injection Failed\nbypassJB() is deactivated.\n\n\n")
}