// 전역 개게라는 점을 이용하여 데이터를 파일끼리 공유할 때 사용가능
const A = require('./globalA');

global.message = '안녕하세요';
console.log(A());