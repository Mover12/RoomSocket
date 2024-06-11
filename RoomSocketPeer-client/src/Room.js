import EventEmitter from "./EventEmitter";

class Room extends EventEmitter {
    constructor(options) {
        super(['open', 'add', 'delete']);
        this.socket = options.socket;

        this.rooms = {};

        this.socket.addEventListener('open', () => {
            this.socket.addEventListener('message', async event => {
                const message = JSON.parse(event.data);
                if (message.url == 'room') {
                    if (message.body.event == 'open') {
                        this.rooms[message.body.rid] = new Set(message.body.ids);
                    } else if (message.body.event == 'add') {
                        this.rooms[message.body.rid].add(message.body.id);
                    } else if (message.body.event == 'delete') {
                        this.rooms[message.body.rid].delete(message.body.id);
                    }
                    this.emit(message.body.event, [message.body])
                }
            });
        });
    }

    open(rid) {
        this.socket.send(JSON.stringify({
            url: 'room',
            body: {
                event: 'open',
                rid: rid
            }
        }));
    }

    close(rid) {
        delete this.rooms[rid];
        this.socket.send(JSON.stringify({
            url: 'room',
            body: {
                event: 'delete',
                rid: rid
            }
        }));
    }
}

export default Room;
