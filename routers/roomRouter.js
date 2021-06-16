const router = require('express').Router();
const {body} = require('express-validator');

// Fetches a room if already exists or creates a new one
router.post('/getRoom');

// Fetches all the rooms in which user is a part of
router.get('/');

// Fetches room if user is a part of with pagination
router.get('/:roomId');

// Posts a message in room if User is a part of
router.post('/:roomId/message');

// Marks all the messages as read in the room if user is a part of
router.put('/:roomId/mark-read');

// Deletes a message if it is posted by user
router.delete('/message/delete/:messageId');

module.exports = router;