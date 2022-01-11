const { Decimal128 } = require('bson')
const mongoose = require('mongoose');
const Schema = mongoose.Schema

const taskSchema = require('../task/task');

const milestoneSchema = new Schema({
    overview:{
        type: String,
        required: true
    },
    amount:{
        type: Decimal128,
        required: true
    },
    m_manager: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },

    tasks: [
        {
            type:taskSchema,
            required: false
        }
    ]
},
{
    timestamps: true
})

module.exports = milestoneSchema