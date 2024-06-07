class RoomSocketServer {
    constructor (options) {
        this.socket = options.socket;

        this.rooms = {};

        this.socket.on('connection', ws => {
            ws.rooms = new Set();
            ws.on('message', data => {
                const message = JSON.parse(data);
                if (message.url == 'room') {
                    if (message.body.event == 'open') {
                        ws.rooms.add(message.body.rid);
                        if (!this.rooms[message.body.rid]) this.rooms[message.body.rid] = new Set();
                        this.socket.sockets[ws.id].send(JSON.stringify({
                            url: 'room',
                            body: {
                                event: 'open',
                                rid: message.body.rid,
                                ids: Array.from(this.rooms[message.body.rid])
                            }
                        }));
                        for (const id of this.rooms[message.body.rid]) {
                            this.socket.sockets[id].send(JSON.stringify({
                                url: 'room',
                                body: {
                                    event: 'add',
                                    rid: message.body.rid,
                                    id: ws.id
                                }
                            }));
                        }
                        this.rooms[message.body.rid].add(ws.id);
                    } else if (message.body.event == 'delete') {
                        ws.rooms.delete(message.body.rid);
                        this.rooms[message.body.rid].delete(ws.id);
                        for (const id of this.rooms[message.body.rid]) {
                            this.socket.sockets[id].send(JSON.stringify({
                                url: 'room',
                                body: {
                                    event: 'delete',
                                    rid: message.body.rid,
                                    id: ws.id
                                }
                            }));
                        }
                        if(this.rooms[message.body.rid].size == 0) {
                            delete this.rooms[message.body.rid];
                        }
                    }
                }
            });

            ws.on('close', () => {
                for (const rid of ws.rooms) {
                    this.rooms[rid].delete(ws.id);
                    for (const id of this.rooms[rid]) {
                        this.socket.sockets[id].send(JSON.stringify({
                            url: 'room',
                            body: {
                                event: 'delete',
                                rid: rid,
                                id: ws.id
                            }
                        }));
                    }
                    if(this.rooms[rid].size == 0) {
                        delete this.rooms[rid];
                    }
                }
            });
        });
    }
}

module.exports = RoomSocketServer;