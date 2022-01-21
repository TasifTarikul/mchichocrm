const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');

const milestoneController = require('../milestone/milestoneController');
const isAuth = require('../middleware/is_auth');

router.post('/add_milestone', isAuth, milestoneController.addMilestone);
router.get('/list_milestone', isAuth, [
    query('name').custom( value =>{
        console.log('inside name query validatior');
        console.log(value);
        if(value == ''){
            console.log('if value is empty string');
            const error = new Error('Query parameter cannot be an empty string');
            error.statusCode = 400;
            throw error;
        }
        return true;
    })
], milestoneController.listMilestone);

router.get('/detail_milestone/:milestoneId', isAuth, milestoneController.retrieveMilestone);
router.put('/update_milestone/:milestoneId', isAuth, milestoneController.updateMilestone);
router.delete('/delete_milestone/:milestoneId', isAuth, milestoneController.deleteMilestone);

module.exports = router;