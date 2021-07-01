const mongoose = require('mongoose');
const {v4 : uuidv4} = require('uuid');

const roomSchema = new mongoose.Schema(
    {
        _id : {
            type : String,
            default : () => uuidv4().replace(/\-/g,""),
        },
        userIds : Array,
        roomInitiator : String,
    },
    {
        timestamps : true,
        collection : 'rooms'
    }
);

roomSchema.statics.initiateRoom = async function(userIds, roomInitiator){
    try {
        // Find if there is already a room created
        const oldRoom = await this.findOne({
            userIds : {
                $size : userIds.length,
                $all : [...userIds],
            }
        });
        if(oldRoom) return { isNew : false, roomId : oldRoom._id};

        // Else create a new room
        const newRoom = await this.create({userIds, roomInitiator});
        return { isNew : true, roomId : newRoom._id};
    } catch (error) {
        throw error;
    }
}

roomSchema.statics.getAllMyChatRooms = async function(userId){
    try {
        const rooms = await this.find({
            userIds : {
                $elemMatch : { $eq : userId}
            }
        });
        return rooms;
    } catch (error) {
        throw error;
    }
}

roomSchema.statics.socketMethod_getAllMyRooms = async function(userId){
    try {
        const rooms = await this.find({
            userIds : {
                $elemMatch : { $eq : userId}
            }
        },{
            "_id" : 1
        });

        return rooms;
    } catch (error) {
        return [];
    }
}

roomSchema.statics.getRoomById = async function(_id){
    try {
        const rooms = await this.aggregate([
            { $match : {_id}},
            {
                $lookup : {
                    from : 'users',
                    localField : 'roomInitiator',
                    foreignField : '_id',
                    as : 'roomInitiator'
                }
            },
            { $unwind : '$roomInitiator'},
            { $unwind : '$userIds'},
            {
                $lookup : {
                    from : 'users',
                    localField : 'userIds',
                    foreignField : '_id',
                    as : 'userIds',
                }
            },
            {
                $group : {
                    _id : '$_id',
                    roomInitiator : {$last : '$roomInitiator'},
                    userIds : {$addToSet : '$userIds'},
                    createdAt : {$last : '$createdAt'},
                    updatedAt : {$last : '$updatedAt'},
                }
            }
        ]);
        return rooms[0];
    } catch (error) {
        throw error;
    }
}

const model = mongoose.model('room', roomSchema);

module.exports = model;