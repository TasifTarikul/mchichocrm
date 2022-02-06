const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Decimal128 } = require('bson');

const paymentSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },

    milestone: {
        type: Schema.Types.ObjectId,
        ref: 'Milestone'
    },

    currency: {
        type: Number,
        enum: [0, 1],
        default: 0
    }
})

module.exports = mongoose.model('Payment', paymentSchema);