const { query } = require('express-validator');
const History = require('./history');


exports.listHistory = (req, res, next) => {

    const currentPage = req.query.page;
    const limit = req.query.limit;
    const skip = (currentPage -1)* limit;
    let totalPages;
    let totalHistory;
    let query = History.find();

    query.clone().countDocuments()
    .then(count=>{
        totalHistory=count;
        return query
        .skip(skip)
        .limit(limit)
    })
    .then(histories=>{
        totalPages = (Math.ceil(totalHistory/limit) === Infinity)? 1 : Math.ceil(totalHistory/limit);
        res.json({
            message: 'Histories fetched',
            status:200,
            currentPage: currentPage,
            totalPages: totalPages,
            count: totalHistory,
            data: histories
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}