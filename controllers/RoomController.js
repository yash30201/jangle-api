const { validationResult } = require('express-validator');

const onInitiateRoom = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw (errors.array());

    } catch (error) {
        next(error);
    }
}

const onGetAllSubscribedRooms = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw (errors.array());

    } catch (error) {
        next(error);
    }
}


const onGetMyRoomById = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw (errors.array());

    } catch (error) {
        next(error);
    }
}


const onPostMessage = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw (errors.array());

    } catch (error) {
        next(error);
    }
}


const onMarkMyMessagesRead = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw (errors.array());

    } catch (error) {
        next(error);
    }
}


const onDeleteMyMessage = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw (errors.array());

    } catch (error) {
        next(error);
    }
}

module.exports = {
    onInitiateRoom,
    onGetAllSubscribedRooms,
    onGetMyRoomById,
    onPostMessage,
    onMarkMyMessagesRead,
    onDeleteMyMessage
};

