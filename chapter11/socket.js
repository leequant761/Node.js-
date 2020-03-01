const SocketIO = require('socket.io');
const axios = require('axios');

module.exports = (server, app, sessionMiddleware) => {
    const io = SocketIO(server, { path: '/socket.io' });
    app.set('io', io); // 나중에 라우터에서 io 객체에 접근하기 위함
    const room = io.of('/room'); // 소켓에 네임스페이스 부여 (같은 네임스페이스끼리만 데이터 전달)
    const chat = io.of('/chat'); // 소켓에 네임스페이스 부여
    io.use((socket, next) => { // 소켓에 세션 미들웨어 장착
        sessionMiddleware(socket.request, socket.request.res, next);
    });
    room.on('connection', (socket) => {
        console.log('room 네임스페이스에 접속');
        socket.on('disconnet', () => {
            console.log('room 네임스페이스 접속 해제');
        });
    });
    
    chat.on('connection', (socket) => {
        console.log('chat 네임스페이스에 접속');
        const req = socket.request;
        const { headers: { referer } } = req;
        const roomId = referer
            .split('/')[referer.split('/').length - 1]
            .replace(/\?.+/, '');

        socket.join(roomId) // room(데이터를 주고받을 소켓 모임 장소)에 들어가는 메소드

        socket.to(roomId).emit('join', { // to(roomId).emit(이벤트 이름, 보내고 싶은 데이터) 
            user: 'system',
            chat: `${req.session.color}님이 입장하셨습니다.`,
        });

        socket.on('disconnect', () => {
            console.log('chat 네임스페이스 접속 해제');
            socket.leave(roomId); // 방탈출
            const currentRoom = socket.adapter.rooms[roomId];
            const userCount = currentRoom ? currentRoom.length: 0;
            if (userCount === 0) { 
                axios.delete(`http://localhost:8005/room/${roomId}`) // 방제거 요청
                    .then(() => {
                        console.log('방 제거 요청 성공');
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                socket.to(roomId).emit('exit', { // to(roomId).emit(이벤트 이름, 보내고 싶은 데이터)
                    user: 'system',
                    chat: `${req.session.color}님이 퇴장하셨습니다.`
                });
            }
        });
    });
};