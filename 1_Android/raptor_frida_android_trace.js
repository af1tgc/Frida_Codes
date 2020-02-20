var g_flag = 0;

// generic trace
function trace(pattern)
{
	var type = (pattern.toString().indexOf("!") === -1) ? "java" : "module";

	if (type === "module") {

		// trace Module
		var res = new ApiResolver("module");
		var matches = res.enumerateMatchesSync(pattern);
		var targets = uniqBy(matches, JSON.stringify);
		targets.forEach(function(target) {

			traceModule(target.address, target.name);
		});

	} else if (type === "java") {

		// trace Java Class
		var found = false;
		Java.enumerateLoadedClasses({
			onMatch: function(aClass) {
				if (aClass.match(pattern)) {

					found = true;

					console.log("");
					console.log("----------------------------aClass: " + aClass);
					console.log("");
					console.log("");

					var className = aClass;
					//var className = aClass.match(/[L](.*);/)[1].replace(/\//g, ".");
					traceClass(className);
				}
			},
			onComplete: function() {}
		});

		// trace Java Method
		if (!found) {
			try {
				traceMethod(pattern);
			}
			catch(err) { // catch non existing classes/methods
				console.error(err);
			}
		}
	}
}

// find and trace all methods declared in a Java Class
function traceClass(targetClass)
{
	console.log("+++++++++++++++++++++++++++++++TRACING CLASSES+++++++++++++++++++++++++++++++++++");
	var hook = Java.use(targetClass);
	var methods = hook.class.getDeclaredMethods();
	hook.$dispose;

	var parsedMethods = [];
	methods.forEach(function(method) {
		parsedMethods.push(method.toString().replace(targetClass + ".", "TOKEN").match(/\sTOKEN(.*)\(/)[1]);
	});

	var targets = uniqBy(parsedMethods, JSON.stringify);
	targets.forEach(function(targetMethod) {
		traceMethod(targetClass + "." + targetMethod);
		console.log("--------------------")
		console.log("END OF TRACE METHODS");
	});
}

// trace a specific Java Method
function traceMethod(targetClassMethod)
{
	console.log("+++++++++++++++++++++++++++++++TRACING METHODS+++++++++++++++++++++++++++++++++++");
	console.log(targetClassMethod);
	if(targetClassMethod.match(" ") ){
		var replaced_targetClassMethod = targetClassMethod.split(" ");
		targetClassMethod = replaced_targetClassMethod[1];
	}
	
	
	var delim = targetClassMethod.lastIndexOf(".");
	if (delim === -1) return;

	var targetClass = targetClassMethod.slice(0, delim)
	var targetMethod = targetClassMethod.slice(delim + 1, targetClassMethod.length)

	var hook = Java.use(targetClass);
	var overloadCount = hook[targetMethod].overloads.length;

	console.log("Tracing " + targetClassMethod + " [" + overloadCount + " overload(s)]");

	for (var i = 0; i < overloadCount; i++) {

		hook[targetMethod].overloads[i].implementation = function() {
			//console.warn("\n*** entered " + targetClassMethod);
			console.warn("*** entered " + targetClassMethod);

			// print backtrace
			// Java.perform(function() {
			//	var bt = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new());
			//	console.log("\nBacktrace:\n" + bt);
			// });   


			// print args
			if (arguments.length) console.log();
			console.log(arguments.length);
			for (var j = 0; j < arguments.length; j++) {
				console.log("arg[" + j + "]: " + arguments[j]);
			}
			// print retval
			var retval = this[targetMethod].apply(this, arguments); // rare crash (Frida bug?)
			console.log("\nretval: " + retval);
			console.warn("\n*** exiting " + targetClassMethod);
			return retval;
			
		}
	}
}

// trace Module functions
function traceModule(impl, name)
{
	console.log("+++++++++++++++++++++++++++++++TRACING MODULES+++++++++++++++++++++++++++++++++++");
	console.log("Tracing " + name);

	Interceptor.attach(impl, {

		onEnter: function(args) {

			// debug only the intended calls
			this.flag = false;
			// var filename = Memory.readCString(ptr(args[0]));
			// if (filename.indexOf("XYZ") === -1 && filename.indexOf("ZYX") === -1) // exclusion list
			// if (filename.indexOf("my.interesting.file") !== -1) // inclusion list
				this.flag = true;

			if (this.flag) {
				console.warn("\n*** entered " + name);

				// print backtrace
				//console.log("\nBacktrace:\n" + Thread.backtrace(this.context, Backtracer.ACCURATE)
				//		.map(DebugSymbol.fromAddress).join("\n"));
			}
		},

		onLeave: function(retval) {

			if (this.flag) {
				// print retval
				//console.log("\nretval: " + retval);
				//console.warn("\n*** exiting " + name);
			}
		}

	});
}

// remove duplicates from array
function uniqBy(array, key)
{
        var seen = {};
        return array.filter(function(item) {
                var k = key(item);
                return seen.hasOwnProperty(k) ? false : (seen[k] = true);
        });
}

// usage examples
setTimeout(function() { // avoid java.lang.ClassNotFoundException

	Java.perform(function() {
  
		// trace("com.target.utils.CryptoUtils");
		trace("android.util.Log.v");
		trace("android.util.Log.d");
		trace("android.util.Log.i");
		trace("android.util.Log.w");
		trace("android.util.Log.e");
		// trace("CryptoUtils");
		// trace(/crypto/i);
		// trace("exports:*!open*");

	});   
}, 0);
