const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const commentSchema = new Schema ({
    
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    text: {
        type: String,
        required: true
    },

    project: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('Comment', commentSchema);