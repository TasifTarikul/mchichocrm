const { validationResult } = require('express-validator');

const Task = require('../task/task');
const Milestone = require('../milestone/milestone');

exports.addTask = (req, res, next) => {

    const error = validationResult(req);
    if(!error.isEmpty()){
        const error = new Error('Validation failed, entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }

    const creator = req.userId;
    const projectId = req.body.Id
    const milestoneId = req.body.milestoneId;
    const name = req.body.name;
    const description = req.body.description;

    const task = {
        creator: creator,
        name: name,
        description: description
    }
}

exports.listMilestone = (re, res, next) => {
    
}