Java.perform(function() {

	Interceptor.replace(tls_helper_create_peer_trust, new NativeCallback(function(hdsk, server, trustRef) {
		return errSecSuccess;
	}, 'int', ['pointer', 'bool', 'pointer']));
	console.log("SSL certificate validation bypass active");
}, 0);
