class RoomPeer {
    constructor(options) {
        this.room = options.room;
        this.signalpeer = options.signalpeer;

        this.peers = {}

        this.room.addEventListener('open', (e) => {
            const [body] = e.detail;
            for (const id of body.ids) {
                if (!this.signalpeer.peer.peerConnections[id]) {
                    this.signalpeer.open(id);
                    this.peers[id] = new Set();
                }
                this.peers[id].add(body.rid);
            }
        })

        this.room.addEventListener('add', (e) => {
            const [body] = e.detail;
            if (!this.signalpeer.peer.peerConnections[body.id]) {
                this.peers[body.id] = new Set();
            }
            this.peers[body.id].add(body.rid);
        })

        this.room.addEventListener('delete', (e) => {
            const [body] = e.detail;
            this.peers[body.id].delete(body.rid);
            if (this.peers[body.id].size == 0) {
                this.signalpeer.close(body.id);
            }
        })
    }
    
    broadcast(rid, data) {
        for (const id of this.room.rooms[rid]) {
           this.signalpeer.peer.send(id, data);
        }
    }
}

export default RoomPeer;
