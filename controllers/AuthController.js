const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');

const onLoginUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw (errors.array());

        const {phoneNumber, password} = req.body;
        const user = await authModel.loginUser(phoneNumber, password);
        

        // Till now, user has successfully logged up.
        // So now we generate jwt token
        const payload = {userId : user._id};
        const authToken = jwt.sign(payload,process.env.JWT_SECRET_KEY);
        return res.status(200).json({success : true, authToken, user});
    } catch (error) {
        next(error);
    }
};

const onSignUpUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw (errors.array());
        
        const {firstName, lastName, phoneNumber, password} = req.body;
        const user = await authModel.signupUser(firstName, lastName, phoneNumber, password);
        res.status(200).json({success : true, user});
        
    } catch (error) {
        next(error);
    }
};


module.exports = {
    onLoginUser,
    onSignUpUser
}