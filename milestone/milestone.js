const { Decimal128 } = require('bson')
const mongoose = require('mongoose');
const Schema = mongoose.Schema

const milestoneSchema = new Schema({
    overview:{
        type: String,
        required: true
    },
    amouont:{
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
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('Milestone', milestoneSchema)