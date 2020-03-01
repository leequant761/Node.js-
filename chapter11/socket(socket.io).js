const SocketIO = require('socket.io');

module.exports = (server) => {
    const io = new SocketIO(server, { path: '/socket.io' }); // path: 클라이언트와 서버가 만나는 경로

    io.on('connection', (socket) => {
        const req= socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // IP 알아내는 방법 (유용함)
        console.log('새로운 클라이언트 접속', ip, socket.id, req.ip);
        socket.on('reply', (data) => {
            console.log(data);
        });
        socket.on('error', (error) => {
            console.log(error);
        });
        socket.on('disconnet', () => {
            console.log('클라이언트 접속 해제', ip, socket.id);
            clearInterval(socket.interval); // 접속 해제할 때 이 부분이 없다면 메모리 누수가 생김
        });
        socket.interval = setInterval(() => {
            socket.emit('news', 'Hello Socket.IO') // 이벤트 이름, 보내고 싶은 데이터 
        }, 3000);
    });
};