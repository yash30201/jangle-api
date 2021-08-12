// This is how it will work
/*
When ever a user enters the application for a window/device, he/she will be required to join all the rooms in which he/she is a part of from the front end;

*/
const roomModel = require('../models/roomModel');

class WebSockets {
    constructor() {
        this.users = [];

    }
    connection = (socket) => {
        // console.log(socket.id);
        socket.on('add user to list', async (userId) => {
            // console.log('User : ' + userId + ' emitted add user to list');
            this.users.push({
                socketId: socket.id,
                userId: userId
            });
            // console.log(this.users);

            const rooms = await roomModel.socketMethod_getAllMyRooms(userId);
            for (let i = 0; i < rooms.length; i++) {
                socket.join(rooms[i]._id);
            }
            // const sockets = await global.io.fetchSockets();
            // for(let i = 0 ;i < sockets.length ; i++){
            //     console.log(sockets[i].id);
            // }
        });
        socket.on('disconnect', async () => {
            // console.log('A user disconnected');
            let userId = '';
            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i].socketId === socket.id) {
                    userId = this.users[i].userId;
                    break;
                }
            }
            this.users = this.users.filter((user) => {
                return user.socketId !== socket.id;
            });
            // console.log({users : this.users, userId});
            const rooms = await roomModel.socketMethod_getAllMyRooms(userId);
            for (let i = 0; i < rooms.length; i++) {
                socket.leave(rooms[i]._id);
            }
        });

        socket.on('join room', (roomId,myUserId, otherUserId) => {
            // Used when new conversation is created in real time
            const userSockets = this.users.filter((user) => {
                return (user.socketId !== socket.id && (user.userId === otherUserId || user.userId === myUserId));
            });
            // console.log('Join room');
            // console.log(myUserId + ' ' + otherUserId);
            // console.log(userSockets);
            userSockets.map((userInfo) => {
                const socketConnection = global.io.of("/").connected[userInfo.socketId];
                if (socketConnection){
                    socketConnection.join(roomId);
                }
            })
            socket.join(roomId);
            socket.emit('new conversation');
        });

        socket.on('leave room', (room) => {
            // Used when an existing conversation is completely deleted in real time

            // Since there is no provision to delete conversation for now, hence is trivial.
            socket.leave(room);
        });

        socket.on('send message', (room, data) => {
            // console.log('New message');
            // console.log(data);
            // Considering the message has already been added in the database
            socket.to(room).emit('new message', data);
        });

        socket.on('new conversation', (userIds) => {
            // console.log('New conversation : ');
            // console.log(userIds);
            const userSockets = this.users.filter((user) => {
                return (user.socketId !== socket.id && userIds.includes(user.userId));
            });
            // console.log('New conversation');
            // console.log(userSockets)
            userSockets.map((userInfo) => {
                socket.to(userInfo.socketId).emit('new conversation');
            })
        });


    }
};

module.exports = WebSockets;