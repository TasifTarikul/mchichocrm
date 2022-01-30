const { validationResult } = require('express-validator');
const milestone = require('../milestone/milestone');
const Milestone = require('../milestone/milestone');
const Project = require('../project/project');
const History = require('../history/history');
const historyStatusConstants = require('../history/constants').historyStatus;

exports.addMilestone = (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }

    const name = req.body.name;
    const creator = req.userId;
    const overview = req.body.overview;
    const budget = req.body.budget;
    const m_manager = req.body.m_manager;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const projectId = req.body.project;

    const milestone = new Milestone({
        name: name,
        creator: creator,
        overview: overview,
        budget: budget,
        m_manager: m_manager,
        start_date: start_date,
        end_date: end_date,
        project: projectId
    })

    milestone.save()
    .then(milestone => {

        const history = new History({
            object: 'Milestone',
            description: milestone.name,
            status: historyStatusConstants.start[0],
            user: req.userId,
            milestone: milestone._id,
            project: projectId
        })

        return history.save()
    })
    .then(history=>{
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
    const fltr_by_project = req.query.project;
    const currentPage = req.query.page || 1;
    const limit = req.query.limit || 0;
    const skip = (currentPage -1) * limit;
    let totalMilestones;
    let totalPages;
    let query= Milestone.find({project:fltr_by_project});

    query.clone().countDocuments()
    .then(count =>{
        totalMilestones = count;
        return query
        .skip(skip)
        .limit(limit)
    })
    .then(milestones =>{
        totalPages = (Math.ceil(totalMilestones/limit) === Infinity)? 1 : Math.ceil(totalMilestones/limit);

        res.json({
            message: 'Milestones fetched',
            count: totalMilestones,
            totalPages: totalPages,
            currentPage: currentPage,
            status: 200,
            data: milestones
        })
    })
    .catch(err =>{
        if(!err.statusCode){
            statusCode = 500;
        }

        next(err);
    })

}

exports.retrieveMilestone = (req, res, next) =>{
    const milestoneId = req.params.milestoneId;

    Milestone.findById(milestoneId)
    .then(milestone =>{
        if(!milestone){
            const error = new Error('No milestone was found with this Id '+milestoneId);
            error.statusCode=404;
            throw error;
        }

        res.json({
            message: 'Milestone retrieved',
            data: milestone
        })
    })
    .catch(err =>{
        if(!err.statusCode){
            err.statusCode= 500;
        }
        next(err)
    })
    
} 

exports.updateMilestone = (req, res, next) =>{

    const milestoneId = req.params.milestoneId;
    const name = req.body.name;
    const overview = req.body.overview;
    const budget = req.body.budget;
    const m_manager = req.body.m_manager;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    let updatedMilestone;

    Milestone.findById(milestoneId)
    .then(milestone => {
        if(!milestone){
            const error = new Error('No milestone was found with this Id');
            error.statusCode=404;
            throw error;
        }

        milestone.name = name;
        milestone.overview = overview;
        milestone.budget = budget;
        milestone.m_manager = m_manager;
        milestone.start_date = start_date;
        milestone.end_date = end_date;

        return milestone.save();
    })
    .then(milestone=>{
        updatedMilestone=milestone;

        const history = new History ({
            object: 'Milestone',
            description: milestone.name,
            status: historyStatusConstants.update[0],
            user: req.userId,
            project: milestone.project,
            milestone: milestone._id
        })
        return history.save()

    })
    .then(history => {
        res.json({
            message: 'Milestone Updated Successfully',
            status: 200,
            data: updatedMilestone
        })
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
    
}

exports.deleteMilestone = (req, res, next) =>{
    const milestoneId = req.params.milestoneId;

    Milestone.findById(milestoneId)
    .then(milestone=>{
        if(!milestone){
            const error = new Error('No milestone was found with this Id');
            error.statusCode=404;
            throw error;
        }

        return Milestone.findByIdAndRemove(milestoneId)
    })
    .then(result =>{
        res.json({
            message: 'Milestone deleted Successfully',
            status: 200
        })
    })
    
}
