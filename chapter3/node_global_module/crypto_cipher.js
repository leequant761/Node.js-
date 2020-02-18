// 양방향
const crypto = require('crypto');

const cipher = crypto.createCipher('aes-256-cbc', '열쇠'); //알고리즘, 키 
let result = cipher.update('암호화할 문장', 'utf8', 'base64');// 문자열, 인코딩, 암호출력인코딩
result += cipher.final('base64'); // 암호출력 인코딩
console.log('암호화:', result);

const decipher = crypto.createDecipher('aes-256-cbc', '열쇠');
let result2 = decipher.update(result, 'base64', 'utf8'); // 문자열, 인코딩, 복호화출력인코딩
result2 += decipher.final('utf8'); // 복호화 인코딩
console.log('복호화:', result2);