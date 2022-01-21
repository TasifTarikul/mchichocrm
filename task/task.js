const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    creator:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true
    },

    milestone: {
        type: Schema.Types.ObjectId,
        ref: 'Milestone',
        required: true,
        index: true
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model('Task', taskSchema);