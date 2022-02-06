const { Decimal128 } = require('bson')
const mongoose = require('mongoose');
const Schema = mongoose.Schema


const milestoneSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    creator:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    overview:{
        type: String,
        required: true
    },
    budget:{
        type: Number,
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

    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index:true
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('Milestone', milestoneSchema);