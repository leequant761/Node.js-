// const http = require('http');
const https = require('https');
const fs = require('fs');

// listen 메서드에 콜백함수 넣는 방식
https.createServer({
    cert: fs.readFileSync('도메인 인증서 경로'),
    key: fs.readFileSync('도메인 비밀키 경로'),
    ca: [
        fs.readFileSync('상위 인증서 경로'),
        fs.readFileSync('상위 인증서 경로'),
    ]
}, (req, res) => {
    res.write('<h1>Hello, Node!</h1>');
    res.end('<p>Hello Server!</p');
}).listen(8080, () => {
    console.log('8080번 포트에서 서버 대기 중입니다!');
});