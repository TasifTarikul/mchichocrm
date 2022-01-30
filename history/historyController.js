const { query } = require('express-validator');
const project = require('../project/project');
const History = require('./history');
const historyStatusConstants = require('./constants').historyStatus;


exports.listHistory = (req, res, next) => {
    const fltr_by_project = req.query.project;
    const currentPage = req.query.page || 1;
    const limit = req.query.limit || 0;
    const skip = (currentPage -1)* limit;
    let totalPages;
    let totalHistory;
    let query = History.find({project: fltr_by_project});
    


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