const http = require('http');

// listen 메서드에 콜백함수 넣는 방식
http.createServer((req, res) => {
    res.write('<h1>Hello, Node!</h1>');
    res.end('<p>Hello Server!</p');
}).listen(8080, () => {
    console.log('8080번 포트에서 서버 대기 중입니다!');
});