const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historySchema = new Schema({
    object: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    status: {
        type: Number,
        enum: [0, 1, 2, 3],
        default: 0
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: false
    },

    milestone: {
        type: Schema.Types.ObjectId,
        ref: 'Milestone',
        required: false
    },

    task: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: false
    },

    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: false
    },

    payment:{
        type: Schema.Types.ObjectId,
        ref: 'Payment',
        required: false
    }

},
{
    timestamps: true
})

module.exports = mongoose.model('History', historySchema);