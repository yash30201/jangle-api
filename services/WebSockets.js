// This is how it will work
/*
When ever a user enters the application for a window/device, he/she will be required to join all the rooms in which he/she is a part of from the front end;

*/
const roomModel = require('../models/roomModel');

class WebSockets {
    constructor(){
        this.users = [];
    }
    subscribeOtherUser(room, otherUserId){
        const userSockets = this.users.filter((user) => {
            return user.userId === otherUserId;
        });

        userSockets.map((userInfo) => {
            const socketConnection = global.io.connected[userInfo.socketId];
            if(socketConnection) socketConnection.join(room);
        })
    }
    connection(client){

        client.on('connect',async (userId) => {
            this.users.push({
                socketId : client.id,
                userId : userId
            });

            const rooms = await roomModel.socketMethod_getAllMyRooms(userId);
            for(let i = 0 ; i < rooms.length ; i++){
                client.join(rooms[i]._id);
            }
            // const sockets = await global.io.fetchSockets();
            // for(let i = 0 ;i < sockets.length ; i++){
            //     console.log(sockets[i].id);
            // }
        });
        client.on('disconnect',async () => {
            this.users = this.users.filter((user) => {
                return user.socketId !== client.id;
            });
            const rooms = await roomModel.socketMethod_getAllMyRooms(userId);
            for(let i = 0 ; i < rooms.length ; i++){
                client.leave(rooms[i]._id);
            }
        });

        client.on('initiate_new_room', (room, otherUserId) => {
            this.subscribeOtherUser(room, otherUserId);
            client.join(room);
        });

        client.on('unsubscribe', (room) => {
            client.leave(room);
        });

        client.on('send_message', (data) => {
            // Considering the message has already been added in the database
            client.broadcast.emit('new message', data);
        });


    }
};

module.exports = WebSockets;