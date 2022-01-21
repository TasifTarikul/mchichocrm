const { Decimal128 } = require('bson');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const projectSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    creator: {
        type:Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    overview: {
        type: String,
        required: true
    },

    p_manager: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    start_date: {
        type: Date,
        required: true
    },

    end_date: {
        type: Date,
        required: true
    },

    budget: {
        type: Decimal128,
        required: true
    },
},
{
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema)