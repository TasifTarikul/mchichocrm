const { validationResult, Result } = require('express-validator')
const Project = require('./project');
const User = require('../auth/user');
const History = require('../history/history');
const historyStatusConstants = require('../history/constants').historyStatus;

exports.createProject = (req, res, next) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }

    const name = req.body.name;
    const creator = req.userId;
    const overview = req.body.overview;
    const p_manager = req.body.p_manager;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const budget = req.body.budget;


    const project = new Project({
        name: name,
        creator: creator,
        overview: overview,
        p_manager: p_manager,
        start_date: start_date,
        end_date: end_date,
        budget: budget
    });

    project.save()
    .then(result => {

        console.log('After project saved');
        console.log(result);
        const history = new History ({
            object: 'Project',
            description: result.name,
            user: result.creator,
            status: historyStatusConstants.start[0],
            project: result._id
        })

        return history.save()
        
    })
    .then(history =>{
        return User.findById(p_manager);
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

    const currentPage = req.query.page || 1;
    const limit = req.query.limit || 0;
    const skip = (currentPage -1) * limit;
    let totalProjects;  
    let totalPages;
    let query = Project.find({creator: req.userId});
    
    // const filters = req.query;
    // for( const property in filters){
    //     try {
    //         query.where(property).equals(filters[property]);
    //     } catch (error) {
    //         continue;
    //     }
    // }
    query.clone().countDocuments()
    .then(count => {
        totalProjects = count;
        return query
        .skip(skip)
        .limit(limit)
    })
    .then(projects=>{
        totalPages = (Math.ceil(totalProjects/limit) === Infinity)? 1 : Math.ceil(totalProjects/limit);
        res
        .status(200)
        .json({
            message: "Projects fetched",
            count: totalProjects,
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
    console.log(projectId);
    Project.findById(projectId)
    .then(project =>{
        if(!project){
            const error = new Error('No project was found with this Id');
            error.statusCode = 404
            throw error;
        }
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
    const overview = req.body.overview;
    const p_manager = req.body.p_manager;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const budget = req.body.budget;

    let updatedProject;


    Project.findById(projectId)
    .then(project =>{

        if(!project){
            const error = new Error('No project was found with this Id');
            error.statusCode = 404
            throw error;
        }

        project.name = name;
        project.overview = overview;
        project.p_manager = p_manager;
        project.start_date = start_date;
        project.end_date = end_date;
        project.budget = budget;

        return project.save();
    })
    .then(project=>{
        updatedProject = project
        const history = new History ({
            object: 'Project',
            description: project.name,
            user: req.userId,
            status: historyStatusConstants.update[0],
            project: project._id
        })

        return history.save()
    })
    .then(history => {
        res.json({
            message: "Project Updated Successfully",
            status: 200,
            data: updatedProject
        })
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

        if(!project){
            const error = new Error('No Project was found with this id');
            error.statusCode = 404;
            throw error;
        }
        
        return Project.findByIdAndRemove(projectIds)
    })
    .then(result => {
        res.json({
            message: "Project deleted",
            status:200
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            statusCode = 500;
        }
        next(err);
    })
}