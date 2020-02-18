// 서버에서는 거의 사용하지 않는 함수
let i = 1;
setInterval(() => {
    if (i===5) {
        console.log('종료!');
        process.exit();
    }
    console.log(i);
    i +=1;
}, 1000);