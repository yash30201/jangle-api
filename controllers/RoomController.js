const { validationResult } = require('express-validator');
const roomModel = require('../models/roomModel');
const messageModel = require('../models/messageModel');

const onInitiateRoom = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw (errors.array());

        const userIds = [req.userId, ...req.body.userIds];
        const room = await roomModel.initiateRoom(userIds, roomInitiator = req.userId);
        return res.status(200).json({success : true, room});
        // return res.status(200).json({fakeSuccess : true, })
    } catch (error) {
        next(error);
    }
}

const onGetAllSubscribedRooms = async (req, res, next) => {
    try {
        const rooms = await roomModel.getAllMyChatRooms(userId = req.userId);
        return res.status(200).json({success : true, rooms});
    } catch (error) {
        next(error);
    }
}


const onGetRecentMessages = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw (errors.array());
        
        const room = await roomModel.getRoomById(_id = req.params.roomId);
        
        const options = {
            page : parseInt(req.query.page) || 0,
            limit : parseInt(req.query.limit) || 10,
        };
        const recentMessages = await messageModel.recentMessages(roomId = room._id, options);

        return res.status(200).json({success : true,room, recentMessages});
    } catch (error) {
        next(error);
    }
}


const onPostMessage = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw (errors.array());

        const post = await messageModel.createPost(
            roomId = req.params.roomId,
            message = req.body.message,
            postedByUser = req.userId
        );

        // global.io.socker
        return res.status(200).json({success : true, post});
    } catch (error) {
        next(error);
    }
}


const onMarkMyMessagesRead = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw (errors.array());

        const result = await messageModel.markConversationAsRead(roomId = req.params.roomId, loggedUserId = req.userId);

        return res.status(200).json({success : true, result});

    } catch (error) {
        next(error);
    }
}


const onDeleteMyMessage = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw (errors.array());

        const result = await messageModel.deleteMessageById(_id = req.params.messageId, userId = req.userId);
        return res.status(200).json({success : true, result});
    } catch (error) {
        next(error);
    }
}

module.exports = {
    onInitiateRoom,
    onGetAllSubscribedRooms,
    onGetRecentMessages,
    onPostMessage,
    onMarkMyMessagesRead,
    onDeleteMyMessage
};

