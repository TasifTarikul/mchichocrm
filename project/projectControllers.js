const { validationResult, Result } = require('express-validator')
const Project = require('./project');
const User = require('../auth/user');
const project = require('./project');


exports.createProject = (req, res, next) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }

    const name = req.body.name;
    const creator = req.userId;
    const p_manager = req.body.p_manager;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const budget = req.body.budget;

    const project = new Project({
        name: name,
        creator: creator,
        p_manager: p_manager,
        start_date: start_date,
        end_date: end_date,
        budget: budget
    });

    project.save()
    .then(result => {
        return User.findById(p_manager)
    })
    .then(user => {
        res.status(201).json({
            message: 'Project created',
            data: {
                project: project,
                p_manager: user.name
            }
        })
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    });
}

exports.listProject = (req, res, next) => {

    const fltr_by_name = req.query.name;
    const currentPage = req.query.page || 1;
    const limit = req.query.limit || 0;
    const skip = (currentPage -1) * limit;
    let totalProjects;
    let totalPages;
    let query = Project.find();

    if(fltr_by_name && fltr_by_name!="")
    {
        query = Project.find({ name: fltr_by_name });
    }

    query.clone().countDocuments()
    .then(count => {
        totalProjects = count;
        return query
        .skip(skip)
        .limit(limit)
    })
    .then(projects=>{
        totalPages = (Math.ceil(totalProjects/limit) === Infinity)? 1 : Math.ceil(totalProjects/limit),
        res
        .status(200)
        .json({
            totalPages: totalPages,
            message: "Projects fetched",
            totalPages: totalPages,
            currentPage: currentPage,
            data: projects
        })
    })
    .catch(err =>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    })
}

exports.retrieveProject = (req, res, next) => {

    const projectId = req.params.projectId;
    
    Project.findById(projectId)
    .then(project =>{
        res.status(201).json({
            message: 'Project Fetched',
            data: project
        })
    })
    .catch(err =>{
        if(!err.statusCode){
            statusCode = 500;
        }
        next(err);
    })
}

exports.updateProject = (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }

    const projectId = req.params.projectId;
    const name = req.body.name;
    const p_manager = req.body.p_manager;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const budget = req.body.budget;


    Project.findById(projectId)
    .then(project =>{
        project.name = name;
        project.p_manager = p_manager;
        project.start_date = start_date;
        project.end_date = end_date;
        project.budget = budget;

        return project.save();
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode ==500;
        }
        next(err);
    })
}

exports.deleteProject = (req, res, next) => {
    const projectId = req.params.projectId;
    
    Project.findById(projectId)
    .then(project=>{
        res.status(200).json({
            message: "Project deleted"
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            statusCode = 500;
        }
        next(err);
    })
}