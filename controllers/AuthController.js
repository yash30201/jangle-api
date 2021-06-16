const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const onLoginUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw (errors.array());

    } catch (error) {
        next(error);
    }
};

const onSignUpUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw (errors.array());
        
        
    } catch (error) {
        next(error);
    }
};


module.exports = {
    onLoginUser,
    onSignUpUser
}