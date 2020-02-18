const fs = require('fs');

// 폴더 내용 확인 및 삭제
fs.readdir('./folder', (err, dir) => {
    if (err) {
        throw err;
    }
    console.log('폴더 내용 확인', dir);
    fs.unlink('./folder/newFile.js', (err) => { // 파일 삭제
        if (err) {
            throw err;
        }
        console.log('파일 삭제 성공');
        fs.rmdir('./folder', (err) => {
            if (err) {
                throw err;
            }
            console.log('폴더 삭제 성공');
        });
    });
});