// throw Error를 처리하지 못했다면 그 이벤트를 캐치해서 프로세스 유지
process.on('uncaughtException', (err) => {
    console.error('예기치 못한 에러');
})

setInterval(() => {
    throw new Error('서버를 고장내주마!');
}, 1000);

setTimeout(() => {
    console.log('실행됩니다');
}, 2000);