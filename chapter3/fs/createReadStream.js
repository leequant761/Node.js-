const fs = require('fs');

const readStream = fs.createReadStream('./readme3.txt', { highWaterMark: 16}); // 버퍼의 단위를 16바이트; default 64
const data = [];

readStream.on('data', (chunk) => { // data 이벤트 캐처 파일 읽기가 시작되면 호출할 콜백
    data.push(chunk);
    console.log('data :', chunk, chunk.length);
});

readStream.on('end', () => { // 읽기 종료 이벤트 발생시
    console.log('end: ', Buffer.concat(data).toString());
});

readStream.on('error', (err) => {
    console.log('error', err);
})