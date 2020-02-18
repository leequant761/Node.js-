const url = require('url');

const URL = url.URL;
const myURL = new URL('http://www.gilbut.co.kr/book/bookList.aspx?sercate1=001001000#anchor'); // new : 인스턴스 생성
console.log('new URL():', myURL); // WHAATWG 방식
console.log('url.format():', url.format(myURL));
console.log('-----------------------------');
const parsedUrl = url.parse('http://www.gilbut.co.kr/book/bookList.aspx?sercate1=00100100#anchor');
console.log('url.parse():', parsedUrl); // node 방식
console.log('url.format():', url.format(parsedUrl));