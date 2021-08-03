const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const roomModel = require('./roomModel');

// const MESSAGE_TYPES = {
//     TYPE_TEXT : "text",
// };


const blueTickSchema = new mongoose.Schema(
    {
        _id : false,
        userId : String,
        readAt : {
            type : Date,
            default : Date.now(),
        }
    },
    {timestamps : false}
);

const messageSchema = new mongoose.Schema(
    {
        _id : {
            type : String,
            default : () => uuidv4().replace(/\-/g, ""),
        },
        roomId : String,
        message: mongoose.Schema.Types.Mixed,
        postedByUser : String,
        blueTicks : [blueTickSchema],
    },
    {
        timestamps : true,
        collection : 'messages'
    }
);

messageSchema.statics.createPost = async function(roomId, message, postedByUser){
    try {

        const post = await this.create({
            roomId, message, postedByUser, blueTicks : [{userId : postedByUser}]
        });

        await roomModel.updateRoomTime(roomId);

        const result = await this.aggregate([
            { $match : {_id : post._id}},
            {
                $lookup : {
                    from : 'users',
                    localField : 'postedByUser',
                    foreignField : '_id',
                    as : 'postedByUser'
                }
            },
            {$unwind : '$postedByUser'},
            {
                $lookup : {
                    from : 'rooms',
                    localField : 'roomId',
                    foreignField : '_id',
                    as : 'roomId',
                }
            },
            { $unwind :'$roomId'},
            { $unwind : '$roomId.userIds'},
            {
                $lookup : {
                    from : 'users',
                    localField : 'roomId.userIds',
                    foreignField : '_id',
                    as : 'roomId.userIds',
                }
            },
            { $unwind : '$roomId.userIds'},
            {
                $group : {
                    _id : '$_id',
                    roomId : {$last : '$roomId._id'},
                    message : {$last : '$message'},
                    postedByUser : {$last : '$postedByUser'},
                    chatRoomUsers : {$addToSet : '$roomId.userIds'},
                    readByRecipients : {$last : '$blueTicks'},
                    createdAt : {$last : '$createdAt'},
                    updatedAt : {$last : '$updatedAt'},
                }
            }
        ]);

        return result[0];
    } catch (error) {
        throw error;
    }
}


messageSchema.statics.recentMessages = async function(roomId, options){
    try {
        const recentMessages = await this.aggregate([
            { $match : {roomId}},
            { $sort : {createdAt : -1}},
            {
                $lookup : {
                    from : 'users',
                    localField : 'postedByUser',
                    foreignField : '_id',
                    as : 'postedByUser'
                }
            },
            { $unwind : '$postedByUser'},
            { $skip : options.page * options.limit},
            { $limit : options.limit},
            { $sort : {createdAt : 1}},
        ]);
        return recentMessages
    } catch (error) {
        throw error;
    }
};



messageSchema.statics.markConversationAsRead = async function(roomId, loggedUserId){
    try {
        const result = await this.updateMany(
            {
                roomId,
                'blueTicks.userId' : { $ne : loggedUserId},
            },
            {
                $addToSet : {
                    blueTicks : { userId : loggedUserId}
                }
            },
            {
                multi : true
            }
        );
        return result;
    } catch (error) {
        throw error;
    }
}

messageSchema.statics.deleteMessageById = async function(_id, userId){
    try {
        const message = await this.findOne({_id});
        if(message.postedByUser !== userId){
            throw Error('This message was not posted by you');
        }
        const result = await this.deleteOne({_id});
        return result;
    } catch (error) {
        throw error;
    }
}



const model = mongoose.model('message', messageSchema);

module.exports = model;