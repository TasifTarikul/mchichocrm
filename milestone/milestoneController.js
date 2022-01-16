const { validationResult } = require('express-validator');
const Milestone = require('../milestone/milestone');
const project = require('../project/project');
const Project = require('../project/project');

exports.addMilestone = (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }

    const projectId = req.body.projectId;
    const name = req.body.name;
    const creator = req.userId;
    const overview = req.body.overview;
    const amount = req.body.amount;
    const m_manager = req.body.m_manager;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;

    const milestone = {
        name: name,
        creator: creator,
        overview: overview,
        amount: amount,
        m_manager: m_manager,
        start_date: start_date,
        end_date: end_date
    }

    Project.findById(projectId)
    .then(project =>{
        project.milestones.push(milestone);
        return project.save();
    })
    .then(result => {
        res.status(201).json({
            message: "Milestone created",
            data: milestone
        })
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    });
}

exports.listMilestone = (req, res, next) => {
    
    const fltr_by_name = req.query.name;

    const currentPage = req.query.page || 1;
    const limit = req.query.limit || 0;
    const skip = req.query.skip;
    let totalProjects;
    let totalpages;
    let query= Milestone.find();

}

exports.retrieveMilestone = (req, res, next) =>{
    const milestoneId = req.body.milestoneId;
    

} 

exports.updateMilestone = (req, res, next) =>{
    
}

exports.deleteMilestone = (req, res, next) =>{
    const milestoneId = req.query.milestoneId;
    
}
