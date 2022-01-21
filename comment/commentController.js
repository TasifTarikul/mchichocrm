const { validationResult } = require('express-validator');
const comment = require('./comment');

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
    .then(result => {
        res.json({
            message: 'Comment created successfully',
            status: 200,
            data: result,
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
    let query = Comment.find();

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
