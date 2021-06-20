const router = require('express').Router();
const { body, param , query} = require('express-validator');
const roomController = require('../controllers/RoomController');

// Fetches a room if already exists or creates a new one
router.post(
    '/initiate',
    body('userIds.*').notEmpty().isAlphanumeric().isLength({min : 32, max : 32}),
    body('userIds').isArray({ min: 1 }).custom(userIds => {
        let userIdsCopy = userIds.slice().sort();
        let len = userIds.length;
        let notValid = false;
        for (let i = 0; i < len - 1; i++) {
            if (userIdsCopy[i] == userIdsCopy[i + 1]) {
                notValid = true;
                break;
            }
        }
        if (notValid) throw Error('Some userIds are same');
        return true;
    }),
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
    param('roomId').notEmpty().isAlphanumeric().isLength({min : 32, max : 32}),
    roomController.onGetRecentMessages
);

// Posts a message in room if User is a part of
router.post(
    '/:roomId/message',
    param('roomId').notEmpty().isAlphanumeric().isLength({min : 32, max : 32}),
    body('message').notEmpty(),
    roomController.onPostMessage
);

// Marks all the messages as read in the room if user is a part of
router.put(
    '/:roomId/mark-read',
    param('roomId').notEmpty().isAlphanumeric().isLength({min : 32, max : 32}),
    roomController.onMarkMyMessagesRead
);

// Deletes a message if it is posted by user
router.delete(
    '/message/delete/:messageId',
    param('messageId').notEmpty().isAlphanumeric().isLength({min : 32, max : 32}),
    roomController.onDeleteMyMessage
);

module.exports = router;