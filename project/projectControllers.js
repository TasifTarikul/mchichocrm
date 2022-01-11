const { validationResult, Result } = require('express-validator')
const Project = require('./project');
const User = require('../auth/user');


exports.createProject = (req, res, next) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }

    const name = req.body.name;
    const p_manager = req.userId;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const budget = req.body.budget;

    const project = new Project({
        name: name,
        p_manager: p_manager,
        start_date: start_date,
        end_date: end_date,
        budget: budget
    });

    project.save()
    .then(result => {
        res.status(201).json({
            message: 'Project created',
            projet: project,
        })
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    });
}