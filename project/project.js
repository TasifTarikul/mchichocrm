const { Decimal128 } = require('bson');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const milestoneSchema = require('../milestone/milestone');

const projectSchema = new Schema({
    name: {
        type: String,
        required: true
    }, 

    startTime: {
        type: Date,
        required: true
    },

    endTime: {
        type: Date,
        required: true
    },

    budget: {
        type: Decimal128,
        required: true
    },

    milestones: [
        {
            type: milestoneSchema,
            required: false
        }
    ]
    
},
{
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema)