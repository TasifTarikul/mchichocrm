const milestone = require('../milestone/milestone');
const Payment = require('./payment');

const History = require('../history/history');
const historyStatusConstants = require('../history/constants').historyStatus;

exports.addPayment = (req, res, next) => {
    
    const amount = req.body.amount;
    const user = req.userId;
    const project = req.body.project;
    const milestone = req.body.milestone;
    const currency = req.body.currency;

    const payment = new Payment({
        amount: amount,
        user: user,
        project: project,
        milestone: milestone,
        currency: currency
    })

    payment.save()
    .then(payment=>{

        const history = new History({
            object: 'Amount',
            description: payment.amount,
            status: historyStatusConstants.paid[0],
            user: req.userId,
            project: project,
            milestone: milestone,
            currency: currency
        })

        return history.save();
    })
    .then(history=>{
        res.json({
            message: 'Paid successfully',
            status: 200,
            data: payment
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}