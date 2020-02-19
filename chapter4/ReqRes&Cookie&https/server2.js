const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
    fs.readFile('./server2.html', (err, data) => { // html을 js에 다 입력하기엔 복잡하니 읽어서 띄워줌
        if (err) {
            throw err;
        }
        res.end(data);
    });
}).listen(8081, () => {
    console.log('8081번 포트에서 서버 대기 중입니다!');
});