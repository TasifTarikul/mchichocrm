const { validationResult } = require('express-validator');

const Task = require('../task/task');
const Milestone = require('../milestone/milestone');
const task = require('../task/task');
const History = require('../history/history');

const historyStatusConstants = require('../history/constants').historyStatus;

exports.addTask = (req, res, next) => {

    const error = validationResult(req);
    if(!error.isEmpty()){
        const error = new Error('Validation failed, entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }

    const creator = req.userId;
    const projectId = req.body.project;
    const milestoneId = req.body.milestone;
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
    .then(task=>{
        const history = new History({
            object: 'Task',
            description: task.name,
            status: historyStatusConstants.start[0],
            user: creator,
            task: task._id,
            project: projectId
        })

        return history.save();
    })
    .then(history => {
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

exports.listTask = (req, res, next) => {
    const fltr_by_project = req.query.project;
    const fltr_by_milestone = req.query.milestone;
    const currentPage=req.query.page || 1;
    const limit = req.query.limit || 0;
    const skip = (currentPage -1) * limit;
    let totalPages;
    let totalTasks;
    let query = Task.find();
    filters = req.query;

    for(const property in filters){
        try{
            query.where(property).equals(filters[property])
        }catch(error){
            continue;
        }
    }

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
    const description = req.body.description;
    let updatedTask;
    
    Task.findById(taskId)
    .then(task => {
        if(!task){
            const error = new Error('No task was found with id ');
            error.statusCode = 404;
            throw error;
        }

        task.name = name;
        task.description = description;
        return task.save();
    })
    .then(task=>{
        updatedTask = task;

        const history = new History({
            object: 'Task',
            description: task.name,
            status: historyStatusConstants.update[0],
            user: re.userId,
            task: task._id,
            project: task.project
        })
        return history.save();
    })
    .then(histroy=>{
        res.json({
            message: 'Task Updated Successfully',
            status: 200,
            data: updatedTask
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