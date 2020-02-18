const fs = require('fs');

const readStream = fs.createReadStream('readme4.txt');
const writeStream = fs.createWriteStream('writeme3.txt');
readStream.pipe(writeStream);

// 읽기 스트림과 쓰기 스트림을 만들고 pipe로 연결해주면 파일이 복사된다.
// node 8.5 부터는 copyFile.js 방식을 선호