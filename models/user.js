const mongoose=require('mongoose')
const schema=mongoose.Schema


const Users=new schema({
    username:{type:String,default:'',required:true},
    firstname:{type:String,default:'',trim:true},
    lastname:{type:String,default:'',trim:true},
    mobilenumber:{type:Number,default:0,maxlength:[10,'Phone Number must be of 10 digits'],minlength:[10,'Phone Number must be of 10 digit']},
    email:{type:String,default:"default@email.com",required:[true,'Email is necessary']},
    password:{type:String,required:[true,'Password is necessary']}

})

module.exports=mongoose.model("User",Users)