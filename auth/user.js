const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const constants = require('./constants')


const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    type:{
        type: Number,
        enum: constants.userType
    },

    name: {
        type: String,
        required: true
    },

    imageUrl: {
        type: String,
        required: false
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema);
