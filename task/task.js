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
    }
},
{
    timestamps: true
}
)

module.exports = taskSchema;