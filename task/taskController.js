const { validationResult } = require('express-validator');

const Task = require('../task/task');
const Milestone = require('../milestone/milestone');
const task = require('../task/task');

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

    const task = new Task ({
        creator: creator,
        name: name,
        description: description,
        project: projectId,
        milestone: milestoneId
    })

    task.save()
    .then(task => {
        res.json({
            message: 'New task created',
            status: 200,
            data: task
        })
    })
    .catch(err =>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    })
}

exports.listTask = (re, res, next) => {
    const fltr_by_name = req.query.name;
    const fltr_by_milestone = req.query.milestone;
    const fltr_by_project = req.query.project;
    const currentPage=req.query.page;
    const limit = req.query.limit;
    const skip = (currentPage -1) * limit;
    let totalPages;
    let totalTasks;
    let query = Task.find();

    query.clone().countDocuments()
    .then(count =>{
        totalTasks = count
        return query
        .skip(skip)
        .limit(limit)
    })
    .then(tasks =>{
        totalPages = (Math.ceil(totalTasks/limit) === Infinity)? 1 : Math.ceil(totalTasks/limit)
        res.json({
            message:'Tasks fetched',
            staus:200,
            currentPage: currentPage,
            totalPages: totalPages,
            count: totalTasks,
            data: tasks
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })


}

exports.retrieveTask = (req, res, next) =>{
    const taskId = req.params.taskId;

    Task.findById(taskId)
    .then(task =>{
        if(!task){
            const error = new Error('No Task was found with this Id '+taskId);
            error.statusCode=404;
            throw error;
        }

        res.json({
            message: 'Task Fetched',
            status: 200,
            data: task
        })
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.updateTask = (req, res, next) => {
    const taskId = req.params.taskId;
    const name = req.body.name;
    const desciption = req.body.description;
    
    Task.findById(taskId)
    .then(task => {
        if(!task){
            const error = new Error('No task was found with id ');
            error.statusCode = 404;
            throw error;
        }

        res.json({
            message: 'Task Fetched',
            status: 200,
            data: task
        })
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
    
}

exports.deleteTask = (req, res, next) => {
    const taskId = req.params.taskId;

    Task.findById(taskId)
    .then(task=>{
        if(!task){
            const error = new Error('No task was found with id ');
            error.statusCode = 404;
            throw error;
        }

        return Task.findByIdAndRemove(taskId);
    })
    .then(result => {
        res.json({
            message: 'Task was deleted Successfully',
            status: 200
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    })
}