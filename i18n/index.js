var reg=/[\\]n                            [\\]"\w+[\\]"[\\]n/ig //
var onlyWordreg=/[A-Za-z][A-Za-z\s]*[A-Za-z]/ig  // 
// 最终的正则是下面这个
var wordreg=/[\\]n                            [\\]"[A-Za-z][A-Za-z\s]*[A-Za-z][\\]"[\\]n/ig
var fs=require('fs')
var MD5=require('./md5.js').MD5
var http=require("http")
var text=fs.readFileSync('./en.js').toString()
var enres=text.match(wordreg)

function OnlineTranslate(query ,to ){
    return new Promise(function (resolve ,reject){
        var appid = '2015063000000001';
        var key = '12345678';
        var salt = (new Date).getTime();
        // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
        var from = 'en';
        var to = to||'zh';
        var str1 = appid + query + salt +key;
        var sign = MD5(str1);
        var url=`http://api.fanyi.baidu.com/api/trans/vip/translate?q=${query}&appid=${appid}&salt=${salt}&from=${from}&to=${to}&sign=${sign}`
        var req= http.get(url,function(res){
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                var x=JSON.parse(chunk)['trans_result'][0]['dst']
                resolve([query,x])
            });
        })
        req.on('error', function(err){
            //失败后调用
            reject(err);
        });
    })
}
enres.map((x)=>{
OnlineTranslate(x.match(onlyWordreg)[0])
.then((x)=>{
    console.log(`${x[0]} => ${x[1]}`);
})
})
