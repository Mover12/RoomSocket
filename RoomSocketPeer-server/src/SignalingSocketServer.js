class SignalingSocketServer {
    constructor (options) {
        this.socket = options.socket;

        this.socket.on('connection', ws => {
            ws.on('message', data => {
                const message = JSON.parse(data);
                if (message.url == 'signaling') {
                    if (message.body.event == 'sdp') {
                        if (this.socket.sockets[message.body.id]) {
                            this.socket.sockets[message.body.id].send(JSON.stringify({
                                url: 'signaling',
                                body: {
                                    event: 'sdp',
                                    id: ws.id,
                                    sdp: message.body.sdp
                                }
                            }));
                        }
                    }
                }
            });
        });
    }
}

module.exports = SignalingSocketServer;
