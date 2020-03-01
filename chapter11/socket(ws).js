const WebSocket = require('ws');

module.exports = (server) => {
    const wss = new WebSocket.Server( {server} );

    wss.on('connection', (ws, req) => {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // IP 알아내는 방법 (유용함)
        console.log('새로운 클라이언트 접속', ip);
        ws.on('message', (message) => {
            console.log(message);
        });
        ws.on('error', (error) => {
            console.log(error);
        });
        ws.on('close', () => {
            console.log('클라이언트 접속 해제', ip);
            clearInterval(ws.interval); // 접속 해제할 때 이 부분이 없다면 메모리 누수가 생김
        });
        const interval = setInterval(() => {
            if (ws.readyState === ws.OPEN) {
                ws.send('서버에서 클라이언트로 메시지를 보냅니다.');
            }
        }, 3000);
        ws.interval = interval;
    });
};