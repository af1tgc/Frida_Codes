# Frida_Codes

How to Use

(1) Bypass the SSL Pinning

	# frida-ps -U
	# frida -U -f {App.Package} -l {PATH}\bypass_ssl_pinning.js --no-pause


(2) Raptor
∙ raptor_frida_android_enum.js – 어플리케이션에서 사용하는 class 및 method 열거
∙ raptor_frida_android_trace.js – 패키지/클래스/메소드를 지정하여 Tracing 동작

	# frida -U -f {App.Package} -l raptor_frida_android_enum.js --no-pause > result
	# frida -U -f {App.Package} -l raptor_frida_android_trace_new.js --no-pause


(3) Params

	#python {runtime.py}
	#frida -U {App.Package} -l {return.js} --no-pause