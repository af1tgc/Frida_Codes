import frida, sys

def on_message(message, data):
    if message['type'] == 'send':
        print("[*] {0}".format(message['payload']))
    else:
        print(message)

jscode = """
Java.perform(function () {
    // 후킹하고자 하는 패키지/클래스 지정
    var MainActivity = Java.use('com.example.seccon2015.rock_paper_scissors.MainActivity');
    // 메인 엑티비티내 onClick 메소드 호출시 아래 코드 수행
    MainActivity.onClick.implementation = function (v) {
        send('onClick');

        // onClick 리스너 호출
        this.onClick(v);
        // onClick이 호출되면 cnt변수를 999로 설정
this.cnt.value = 999;
        console.log('Done:' + JSON.stringify(this.cnt));
    };
});
"""

process = frida.get_usb_device().attach('com.example.seccon2015.rock_paper_scissors')
script = process.create_script(jscode)
script.on('message', on_message)
print('[*] Running CTF')
script.load()
sys.stdin.read()
