// 쿠키를 만들어서 클라이언트의 브라우저에 심어보자
// 그리고 쿠키를 식별해보자
// 쿠키를 안전하게?

const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

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

const session = {}; // 사용자의 이름과 만료시간을 담을 객체

http.createServer((req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    // 주소가 /login으로 시작할 경우에; 리다이렉트 주소(/) + 쿠키(만료시간 5분)
    if (req.url.startsWith('/login')) {
        const { query } = url.parse(req.url);
        const { name } = qs.parse(query);
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 5);
        const randomInt = Date.now();
        session[randomInt] = {
            name,
            expires,
        };
        res.writeHead(302, {
            Location: '/',
            'Set-Cookie': `session=${randomInt};Expires=${expires.toGMTString()};HttpOnly;Path=/`
        });
        res.end();
    } 
    // 쿠키가 있는 경우에; 인삿말 띄워줌
    else if (cookies.session && session[cookies.session].expires > new Date()) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
        res.end(`${session[cookies.session].name}님 안녕하세요`);
    }
    // 쿠키가 없는 경우에; server4.html을 읽어서 띄워줌
    else {
        fs.readFile('./server4.html', (err, data) => {
            if (err) {
                throw err;
            }
            res.end(data);
        });
    }
})
    .listen(8084, () => {
        console.log('8084번 포트에서 서버 대기 중입니다!');
    });