const router = require('express').Router();
const { body, param , query} = require('express-validator');
const roomController = require('../controllers/RoomController');

// Fetches a room if already exists or creates a new one
router.post(
    '/initiate',
    roomController.onInitiateRoom
);

// Fetches all the rooms in which user is a part of
router.get(
    '/',
    roomController.onGetAllSubscribedRooms
);

// Fetches room if user is a part of with pagination
router.get(
    '/:roomId',
    roomController.onGetMyRoomById
);

// Posts a message in room if User is a part of
router.post(
    '/:roomId/message',
    roomController.onPostMessage
);

// Marks all the messages as read in the room if user is a part of
router.put(
    '/:roomId/mark-read',
    roomController.onMarkMyMessagesRead
);

// Deletes a message if it is posted by user
router.delete(
    '/message/delete/:messageId',
    roomController.onDeleteMyMessage
);

module.exports = router;