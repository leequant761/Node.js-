// 쿠키를 만들어서 클라이언트의 브라우저에 심어보자
const http = require('http');

// name=zero;year=1994를 {name: 'zero', year: '1994'} 객체로 바꾸는 함수
const parseCookies = (cookie = '') => 
    cookie
        .split(';')
        .map(v => v.split('='))
        .map(([k, ...vs]) => [k, vs.join('=')])
        .reduce((acc, [k, v]) => {
            acc[k.trim()] = decodeURIComponent(v);
            return acc;
        }, {});

http.createServer((req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    console.log(req.url, cookies);
    res.writeHead(200, { 'Set-Cookie' : 'MyCookie=test' }); // 브라우저는 MyCookie=test라는 쿠키를 저장
    res.end('Hello Cookie');
})
    .listen(8082, () => {
        console.log('8082번 포트에서 서버 대기 중입니다!');
    });