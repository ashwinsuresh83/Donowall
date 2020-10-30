const mongoose=require('mongoose')

const appointmentSchema=new mongoose.Schema({
    adminId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'admin'
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    time:[],
    hasDonated:{type:Boolean,required:true},
    date:{type:String,required:true},
    weekDay:{type:String,required:true}



})
module.exports=Appointment=mongoose.model('appointment',appointmentSchema)