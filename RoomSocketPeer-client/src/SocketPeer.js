class SocketPeer {
    constructor(options) {
        this.socket = options.socket;
        this.peer = options.peer;

        this.socket.addEventListener('open', () => {
            this.socket.addEventListener('message', async event => {
                const message = JSON.parse(event.data);
                if (message.url == 'signaling') {
                    if (message.body.event == 'sdp') {
                        if (message.body.sdp.type == 'offer') {
                            const answer = await this.peer.createAnswer(message.body.id, message.body.sdp);
            
                            this.socket.send(JSON.stringify({
                                url: 'signaling',
                                body: {
                                    event: 'sdp',
                                    id: message.body.id,
                                    sdp: answer
                                }
                            }))
                        } else if (message.body.sdp.type == 'answer') {
                            await this.peer.setAnswer(message.body.id, message.body.sdp);
                        }
                    }
                }
            })
        });
    }

    async open(id) {
        const offer = await this.peer.createOffer(id);
        this.socket.send(JSON.stringify({
            url: 'signaling',
            body: {
                event: 'sdp',
                id: id,
                sdp: offer
            }
        }));
    }

    close(id) {
        this.peer.close(id);
    }
}

export default SocketPeer;
