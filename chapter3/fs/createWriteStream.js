const fs = require('fs');

const writeStream = fs.createWriteStream('./writeme2.txt');
writeStream.on('finish', () => { // 파일 쓰기가 종료되면 콜백 함수 호출
    console.log('파일 쓰기 완료');
})

writeStream.write('이 글을 씁니다. \n');
writeStream.write('한 번 더 씁니다.');
writeStream.end();