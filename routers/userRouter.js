const router = require('express').Router();
const {body} = require('express-validator');


//Creates a new user
router.post('/');

// Return all the users so that user can start a chat with any member
router.get('/');

// Get user by id
router.get('/id/:id');


module.exports = router;