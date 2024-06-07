const SocketServer = require('./src/SocketServer');
const SignalingSocketServer = require('./src/SignalingSocketServer');
const RoomSocketServer = require('./src/RoomSocketServer');

const ss = new SocketServer({
    url: '127.0.0.1',
    port: 8000
});

const sss = new SignalingSocketServer({
    socket: ss
});

const rs = new RoomSocketServer({
    socket: ss
});