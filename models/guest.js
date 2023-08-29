const mongoose=require('mongoose')
const schema=mongoose.Schema


const Guest=new schema({
    Sno:{type:String,default:'',trim:true},
    Name:{type:String,default:'',trim:true},
    email:{type:String,default:'',trim:true},
    address:{type:String,default:'',trim:true},
    phone:{type:Number,default:'',trim:true}
})
module.exports=mongoose.model("guest",Guest)