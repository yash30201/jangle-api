const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const userModel = require('./UserModel');

const authSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, ""),
        },
        passwordHash: String,
    },
    {
        timestamps: true,
        collection: 'auths'
    }
);

authSchema.statics.loginUser = async function (phoneNumber, password) {
    try {
        // already checked for result in user model method
        const user = await userModel.getUserByPhoneNumber(phoneNumber);
        const authUser = await this.findOne({ _id: user._id });
        if (!authUser) throw Error('User exist in user but is absent in auth collection');

        const valid = await bcrypt.compare(password, authUser.passwordHash);
        if (valid) return user;
        throw Error('Password is incorrect');
    } catch (error) {
        throw error;
    }
}

authSchema.statics.signupUser = async function (
    firstName,
    lastName,
    phoneNumber,
    password,
) {
    try {
        // generating hash
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Creating user in the users collection
        // This will throw error if user already exists
        const user = await userModel.createUser(firstName, lastName, phoneNumber);

        await this.create({_id : user._id, passwordHash});
        return user;

    } catch (error) {
        throw error;
    }
}

const model = mongoose.model('auth', authSchema);

module.exports = model;