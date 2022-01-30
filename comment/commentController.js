const { validationResult } = require('express-validator');
const History = require('../history/history');
const historStatusConstants = require('../history/constants').historyStatus;
const Comment = require('./comment');

exports.addComment = (req, res, next) => {

    const error = validationResult(req);
    if(!error.isEmpty()){
        const error = new Error ('Validation Failed, enetered data is incorrect');
        error.statusCode = 422;
        throw error;
    }

    const creator = req.userId;
    const text = req.body.text;
    const projectId = req.body.project;
    
    const comment = new Comment({
        creator: creator,
        text: text,
        project: projectId
    })

    comment.save()
    .then(comment=>{
        const history = new History({
            object: 'Comment',
            description: comment.text,
            status: historStatusConstants.start[0],
            user: creator,
            comment: comment._id,
            project: projectId
        })
        return history.save();
    })
    .then(history => {
        res.json({
            message: 'Comment Created Successfully',
            status: 200,
            data: comment
        })
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.listComment = (req, res, next) => {

    const fltr_by_project = req.query.projectId;
    const currentPage = req.query.page;
    const limit = req.query.limit;
    const skip = req.query.skip;
    let totalPages;
    let totalComments;
    let query = Comment.find({project: fltr_by_project});

    query.clone().countDocuments()
    .then(count=>{
        totalComments = count;
        return query
        .skip(skip)
        .limit(limit)
    })
    .then(comments=>{
        totalPages = (Math.ceil(totalComments/limit) === Infinity)? 1 : Math.ceil(totalComments/limit)
        res.json({
            message: 'Comments Fetched',
            status: 200,
            currentPage: currentPage,
            totalPages: totalPages,
            count: totalComments,
            data: comments
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}
