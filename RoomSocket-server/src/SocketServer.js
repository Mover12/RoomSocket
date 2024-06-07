const WebSocketServer = require('ws').WebSocketServer;

class SocketServer extends WebSocketServer {
    constructor(options) {
        super(options);
        
        this.sockets = {};

        this.on('connection', ws => {
            ws.on('message', data => {
                const message = JSON.parse(data);
                if (message.url == 'socket') {
                    if (message.body.event == 'connect') {
                        ws.id = message.body.id
                        this.sockets[message.body.id] = ws; 
                    }
                }
            });
        });

        this.on('close', ws => {
            delete this.sockets[ws.id];
        })
    }
}

module.exports = SocketServer;