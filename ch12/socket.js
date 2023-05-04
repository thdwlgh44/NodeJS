const SocketIO = require('socket.io');
const { removeRoom } = require('./services');

module.exports = (server, app, sessionMiddleware) => {
    const io = SocketIO(server, { path: '/socket.io' });
    app.set('io', io); //io객체를 express에 저장
    const room = io.of('/room'); //room 네임스페이스로 전환
    const chat = io.of('/chat'); //chat 네임스페이스로 전환

    const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
    chat.use(wrap(sessionMiddleware))

    room.on('connection', (socket) => {
        console.log('room 네임스페이스 접속');
        socket.on('disconnect', () => {
            console.log('room 네임스페이스 접속 해제');
        })
    });
    chat.on('connection', (socket) => {
        console.log('chat 네임스페이스 접속');
        socket.on('join', (data) => {
            socket.join(data); // 방에 참가
            socket.to(data).emit('join', {
                user: 'system',
                chat: `${socket.request.session.color}님이 입장하셨습니다.`
            })
        })
        socket.on('disconnect', async () => {
            console.log('chat 네임스페이스 접속 해제');
            const { referer } = socket.request.headers;
            const roomId = new URL(referer).pathname.split('/').at(-1)
            const currentRoom = chat.adapter.rooms.get(roomId);
            const userCount = currentRoom?.size || 0;
            if (userCount === 0) {
                await removeRoom(roomId);
                room.emit('removeRoom', roomId);
                console.log('방 제거 요청 성공');
            } else {
                socket.to(roomId).emit('exit', {
                    user: 'system',
                    chat: `${socket.request.session.color}님이 퇴장하셨습니다.`
                })
            }
        })
    });

    // io.on('connection', (socket) => {
    //     const req = socket.request;
    //     const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    //     console.log('새로운 클라이언트 접속', ip, socket.id, req.ip);
    //     socket.on('disconnect', () => {
    //         console.log('클라이언트 접속 해제', ip, socket.id);
    //         clearInterval(socket.interval);
    //     })
    //     socket.on('reply', (data) => {
    //         console.log(data);
    //     })
    //     socket.on('error', console.error);
    //     socket.interval = setInterval(() => {
    //         // if (ws.readyState === ws.OPEN) { ==> socket.io에서 알아서 체크를 해줌
    //             socket.emit('news', 'Hello Socket.IO');
    //         // }
    //     }, 3000);
    // });
};
