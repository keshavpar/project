const express = require('express');

const User = require('./../models/userModel');

const asyncErrorHandler = require('./../utils/asyncErrorHandler');
// const CustomError = require('./../utils/CustomError');

exports.addGuests = asyncErrorHandler(async(req, res, next) => {

    const newGuests = req.body.guests;

    const updatedUser = await User.findByIdAndUpdate(req.params.userId, {  $push: { guests: { $each: newGuests } } }, { new: true });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
})

exports.deleteGuest = asyncErrorHandler(async (req, res, next) => {
    const userId = req.params.userId;
    const guestId = req.params.guestId;

    const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { guests: { _id: guestId } } }, { new: true });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
})

exports.updateGuest = asyncErrorHandler();



// router.get('/guestlist', async(req,res)=>{
//     try{
//         const users=await User.find()
//         res.status(200).json({
//             status:"Sucsess",
//             data:{
//                 users
//             }
//         })
//     }
//     catch(e){
//         res.status(400).json({status:"Error",data:{e}})
//     }
// })

// router.delete('/deleteguest',async(req,res)=>{
//     let deletedPatient = await User.findByIdAndDelete(req.params.id)
//     if(!deletedPatient){
//         const err= Error('Guest with _id:'+req.params.id+'is not found'+404)
//         return err;
//     }
//     res.status(204).json({status:"Guest deleted Successfully"})
// })

// router.update('/updateguest',async(req,res)=>{
//     let updatedUser=await User.findByIdAndUpdate(req.body.id,{users})
// })