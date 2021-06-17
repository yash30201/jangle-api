const { validationResult } = require('express-validator');
const userModel = require('../models/UserModel');

const onGetAllUsers = async (req, res, next) => {
    try {
        const users = await userModel.getAllUsers();
        return res.status(200).json({success : true, users});
    } catch (error) {
        next(error);
    }
}

const onGetUserById = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw (errors.array());
        
        const user = await userModel.getUserById(req.params.id);
        return res.status(200).json({success : true, user});
    } catch (error) {
        next(error);
    }
}


module.exports = {
    onGetAllUsers, 
    onGetUserById
}