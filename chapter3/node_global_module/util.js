// 각종 편의 기능을 모아둔 모듈

const util = require('util');
const crypto = require('crypto');

const dontUseMe = util.deprecate((x, y) => {
    console.log(x + y);
}, 'dontUSEME 함수는 deprecated되었으니 더 이상 사용하지 마세요!');
dontUseMe(1, 2);

const randomBytesPromise = util.promisify(crypto.randomBytes);
randomBytesPromise(64)
    .then((buf) => {
        console.log(buf.toString('base64'));
    })
    .catch((err) => {
        console.error(err);
    });


crypto.randomBytes(64, (err, buf) => {
    if (err) {
        return console.error(err);
    }
    const salt = buf.toString('base64'); //64바이트의 문자열로 변환
    console.log('salt:', salt);
    crypto.pbkdf2('비밀번호', salt, 100000, 64, 'sha512', (err, key) => { // 10만번 반복후 sha512로 변환
        console.log('password', key.toString('base64'));
    });
});