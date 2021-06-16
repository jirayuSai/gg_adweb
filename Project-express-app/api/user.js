var expressFunction = require('express')
const router = expressFunction.Router()
const authorization = require('../config/authorize')
const mongoose = require('mongoose')

var Schema = require("mongoose").Schema
const addressSchema = Schema({  
    userId:String,
    fistname:String,
    lastname:String,
    phonenumber:String,
    address:String

},{
    coolection:'addresses'
})
let Address
try{
    Address=mongoose.model('addresses')
}catch(error){
    Address=mongoose.model('addresses',addressSchema)
}

const insertAdderss = (dataAddress)=>{
    return new Promise((resolve, reject) => {
        var new_address = new Address(
            dataAddress
        )
        new_address.save((err,data)=>{
            if(err){
                reject(new Error('Cannot insert adderss to DB!!!'))
            }else{
                resolve({message:'Adderss added successfully'})
            }
        })
    })
}

router.route('/add').post((req,res)=>{
    console.log('add');
    insertAdderss(req.body).then(result =>{
        console.log(result);
        res.status(200).json(result)
    }).catch(err=>{
        console.log(err);
    })
})


router.route('/put').put((req,res)=>{
    
})

router.route('/get/:id').get((req,res)=>{
  
})



module.exports = router