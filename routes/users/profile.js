const express = require('express');
const router = express.Router();
const config = require('config');
const mongoose = require('mongoose');
const User = require('../../models/Users');
const userAuth=require('../../middleware/userAuth')

router.put('/edit',userAuth, async (req,res)=>{
    try{
        const user= await User.findByIdAndUpdate(req.user.id,{$set:req.body},{new:true});
        res.json({user})
    }
    catch(err){
        console.log(err)
        res.status(500).json({ err: "Server Error" });
    }
})
module.exports=router