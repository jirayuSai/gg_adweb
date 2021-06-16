//user.js 

const expressFunction = require('express');
const router = expressFunction.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var Schema = require("mongoose").Schema;
const userSchema = Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    sex: String,
    email: String,
}, {
    collection: 'users'
});

let User
try{
    User= mongoose.model('users')
} catch (error){
    User = mongoose.model('users', userSchema);
}


const makeHash = async(plainText) => {
     const result = await bcrypt.hash(plainText, 10);
     return result;

}

//บันทึกข้อมูลลงไปใน mongoDB
const insertUser = (dataUser) => {
    return new Promise((resolve, reject) =>{
        var new_user = new User({
            username: dataUser.username,
            password: dataUser.password,
            firstName: dataUser.firstName,
            lastName: dataUser.lastName,
            sex: dataUser.sex,
            email: dataUser.email,
            
        });
        //.save is callback function
        new_user.save((err, data) => {
            if(err){
                reject(new Error('Cannot insert user to DB!'));
            }else{
                resolve({message: 'Sign up successfully'});
            }
        });
    });
}

//รับ req ที่เข้ามาจากฝั่งของ user แล้วที่การเอาข้อมูลบันทึกลงใน PATH ข้อมูล
//post การเพอ่มข้อมูลเข้าไปใหม่
router.route('/signup')
    .post((req, res) => {
        makeHash(req.body.password)
        .then(hashText => {
            const playload = {
                username: req.body.username,
                password: hashText,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                sex: req.body.sex,
                email: req.body.email,
            }
            console.log(playload);
            insertUser(playload)
                .then(result => {
                    console.log(result);
                    res.status(200).json(result);
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
        })
       

    });

//export ตัว router ออกไปเพื่อไปใช้งาน
module.exports = router