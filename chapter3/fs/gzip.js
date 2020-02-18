const zlib = require('zlib');
const fs = require('fs');

const readStream = fs.createReadStream('./readme4.txt');
const zlibStream = zlib.createGzip(); // 이 메서드 역시 스트림을 지원하므로 중간에 파이핑을 할 수 있다.
const writeStream =  fs.createWriteStream('./readme4.txt.gz');
readStream.pipe(zlibStream).pipe(writeStream);