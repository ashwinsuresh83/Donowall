const express = require('express');
const router = express.Router();
const adminAuth = require('../../middleware/adminAuth');
const Appointment = require('../../models/Appointment');

router.get('/',adminAuth, async (req,res)=>{
    try{
        let appointments= await Appointment.find({admin:req.user.id})
        res.status(200).json(appointments)
    }
    catch(err){
        console.log(err)
    }
})

module.exports=router