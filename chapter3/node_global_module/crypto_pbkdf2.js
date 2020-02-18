// 단방향, 현재 주로 사용하는 알고리즘
const crypto = require('crypto');

crypto.randomBytes(64, (err, buf) => {
    const salt = buf.toString('base64'); //64바이트의 문자열로 변환
    console.log('salt:', salt);
    crypto.pbkdf2('비밀번호', salt, 100000, 64, 'sha512', (err, key) => { // 10만번 반복후 sha512로 변환
        console.log('password', key.toString('base64'));
    });
});