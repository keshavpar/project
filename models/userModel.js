const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = mongoose.Schema

const userSchema = new schema({
    username:{
        type:String,
        required:true
    },
    firstname:{
        type:String,
        default:'',
        trim:true
    },
    lastname:{
        type:String,
        default:'',
        trim:true
    },
    mobilenumber:{
        type:Number,
        default:0,
        maxlength:[10,'Phone Number must be of 10 digits'],
        minlength:[10,'Phone Number must be of 10 digit']
    },
    email:{
        type:String,
        default:"default@email.com",
        required:[true,'Email is necessary']
    },
    password:{
        type:String,
        required:[true,'Password is necessary'],
        select: false
    },
    guests: {
        type: [
            {
                Sno:{
                    type:String,
                    default:'',
                    trim:true
                },
                name:{
                    type:String,
                    default:'',
                    trim:true
                },
                email:{
                    type:String,
                    default:'',
                    trim:true
                },
                address:{
                    type:String,
                    default:'',
                    trim:true
                },
                phone:{
                    type:Number,
                    default:'',
                    trim:true
                }
            }
        ],
        select: false
    }
})

userSchema.methods.comparePasswordInDb = async function (pswd, pswdDb) {
    return await bcrypt.compare(pswd, pswdDb);
}

const User = mongoose.model("User", userSchema)

module.exports = User;