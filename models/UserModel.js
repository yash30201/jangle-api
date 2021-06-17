const mongoose = require('mongoose');
const {v4 : uuidv4} = require('uuid');

// const USER_TYPES = ['CONSUMER', 'DEVELOPER'];

const userSchema = new mongoose.Schema(
    {
        _id : {
            type : String,
            default : () => uuidv4().replace(/\-/g, ""),
        },
        firstName : String,
        lastName : String,
        phoneNumber : String,
        userType : {
            type : String,
            default : 'CONSUMER',
        }
    },
    {
        timestamps : true,
        collection : 'users'
    }
);

userSchema.statics.createUser = async function(
    firstName,
    lastName,
    phoneNumber,
){
    try {

        // Check if the user with this phone number is already present
        const oldUser = await this.findOne({phoneNumber});
        if(oldUser !== null) throw Error('This phone number is already in use');

        const newUser = await this.create({firstName, lastName, phoneNumber});

        return newUser;

    } catch (error) {
        throw error;
    }
}


userSchema.statics.getUserById = async function(_id){
    try {
        const user = await this.findOne({_id});
        if(user) return user;
        throw Error('No user with this id exists');
    } catch (error) {
        throw error;
    }
}

userSchema.statics.getUserByPhoneNumber = async function(phoneNumber){
    try {
        const user = await this.findOne({phoneNumber});
        if(user) return user;
        throw Error('No user with this phone number exists');
    } catch (error) {
        throw error;
    }
}


userSchema.statics.getUsersByIds = async function(ids){
    try{
        const users = await this.find({_id : {$in : ids}});
        if(users) return user;
        throw Error('Users in this list don\'t exist');
    }catch(error){
        throw error;
    }
}

userSchema.statics.getAllUsers = async function(){
    try{
        const users = await this.find();
        if(users) return users;
        throw Error('There are no users in the collection');
    } catch(error){
        throw error;
    }
}

const model = mongoose.model('user', userSchema);

module.exports = model;
