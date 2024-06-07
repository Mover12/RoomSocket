import Peer from './src/Peer';
import Socket from './src/Socket';
import SocketPeer from './src/SocketPeer';
import Room from './src/Room';
import RoomPeer from './src/RoomPeer';

const UID = Array.from(Array(8), () => Math.floor(Math.random() * 16).toString(16)).join('');

const text_user_id = document.querySelector('.text-user-id');
const text_room_id = document.querySelector('.text-room-id');
const input_room_id = document.querySelector('.input-room-id');
const open = document.querySelector('.open');
const rooms = document.querySelector('.rooms');

text_user_id.innerHTML = UID
text_room_id.innerHTML= Array.from(Array(8), () => Math.floor(Math.random() * 16).toString(16)).join('');

const socket = new Socket({
    id: UID,
    url: 'ws://127.0.0.1:8000'
});

const peer = new Peer({
    id: UID
})

const socketPeer = new SocketPeer({
    socket: socket,
    peer: peer
});

const room = new Room({
    socket: socket
});

const roomPeer = new RoomPeer({
    room: room,
    signalpeer: socketPeer
})



text_room_id.addEventListener('click', () => {
    text_room_id.innerHTML = Array.from(Array(8), () => Math.floor(Math.random() * 16).toString(16)).join('');
});

open.addEventListener('click', () => {
    room.open(input_room_id.value);

    const droom = document.createElement('div');
    droom.className = input_room_id.value;

    const text_room_id = document.createElement('div');
    text_room_id.className = 'text-room-id';
    text_room_id.innerHTML = input_room_id.value;

    const input_message = document.createElement('input');
    input_message.className = 'input-message';

    input_message.addEventListener('input', () => {
        roomPeer.broadcast(droom.className, {
            event: 'input',
            rid: droom.className,
            text: input_message.value
        })
    });

    const close = document.createElement('button');
    close.className = 'close';
    close.innerHTML = 'close';

    close.addEventListener('click', () => {
        room.close(droom.className);
        rooms.removeChild(droom);
    });

    droom.appendChild(text_room_id);
    droom.appendChild(input_message);
    droom.appendChild(close);

    rooms.appendChild(droom);
})

peer.onmessage = (e) => {
    const [id, event] = e.detail;
    const message = JSON.parse(event.data);
    if (message.event == 'input') {
        rooms.querySelector(`.${message.rid}`).querySelector('.input-message').value = message.text
    }
}