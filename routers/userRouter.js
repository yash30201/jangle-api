const router = require('express').Router();
const userController = require('../controllers/UserController');
const {param} = require('express-validator');

//Creates a new user
// router.post('/', ); No need to directly create an user

// Return all the users so that user can start a chat with any member
router.get('/', userController.onGetAllUsers);

// Get user by id
router.get(
    '/:id',
    param('id').notEmpty().isAlphanumeric().isLength({min : 32, max : 32}),
    userController.onGetUserById
);


module.exports = router;