class Socket extends WebSocket {
    constructor(options) {
        super(options.url);
        this.id = options.id;

        this.addEventListener('open', () => {
            this.send(JSON.stringify({
                url: 'socket',
                body: {
                    event: 'connect',
                    id: this.id
                }
            }));
        });
    }
}

export default Socket;