/*
 * raptor_frida_android_enum.js - Java class/method enumerator
 * Copyright (c) 2017 Marco Ivaldi <raptor@0xdeadbeef.info>
 *
 * Example usage:
 * # frida -U -f com.target.app -l raptor_frida_android_enum.js --no-pause
 */

// enumerate all Java classes
function enumAllClasses()
{
	var allClasses = [];
	var classes = Java.enumerateLoadedClassesSync();

	classes.forEach(function(aClass) {
		try {
			var className = aClass.match(/[L](.*);/)[1].replace(/\//g, ".");
		}
		catch(err) {} // avoid TypeError: cannot read property 1 of null
		allClasses.push(className);
	});

	return allClasses;
}

// find all Java classes that match a pattern
function findClasses(pattern)
{
	var allClasses = enumAllClasses();
	var foundClasses = [];

	allClasses.forEach(function(aClass) {
		try {
			if (aClass.match(pattern)) {
				foundClasses.push(aClass);
			}
		}
		catch(err) {} // avoid TypeError: cannot read property 'match' of undefined
	});

	return foundClasses;
}

// enumerate all methods declared in a Java class
function enumMethods(targetClass)
{
	var hook = Java.use(targetClass);
	var ownMethods = hook.class.getDeclaredMethods();
	hook.$dispose;

	return ownMethods;
}

// usage examples
setTimeout(function() { // avoid java.lang.ClassNotFoundException

	Java.perform(function() {

		// enumerate all classes
		var a = enumAllClasses();
		a.forEach(function(s) {
			if (s!=undefined){
				console.log("");
				console.log("-----------Class------------");
				console.log(s);

				var t = enumMethods(s)
				t.forEach(function(v) { 
					if (v!=undefined){
						console.log(v); 
				}
		}); 
			}
		});
	});
}, 0);
