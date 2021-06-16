var expressFunction = require('express')
const router = expressFunction.Router()
const authorization = require('../config/authorize')
const mongoose = require('mongoose')

var Schema = require("mongoose").Schema
const bookSchema = Schema({
    
    name: String,
    writer: String,
    description: String,
    quantity: Number,
    price: Number,
    file: String,
    img: String

},{
    coolection:'book'
})
let Book
try{
    Book = mongoose.model('book')
}catch{
    Book = mongoose.model('book', bookSchema);
}


const insertBook = (dataBook)=>{
    return new Promise((resolve, reject) => {
        var new_book = new Book(
            dataBook
        )
        new_book.save((err,data)=>{
            if(err){
                reject(new Error('Cannot insert product to DB!!!'))
            }else{
                resolve({message:'Product added successfully'})
            }
        })
    })
}

const getBook = () =>{
    return new  Promise((resolve, reject)=>{
        Book.find({},(err,data)=>{
            if(err){
                reject(new Error('Cannot get order !!!'))
            }else{
               if(data){
                   resolve(data)
               }else{
                reject(new Error('Cannot get order !!!'))
               }
            }
        })
    })
}

router.route('/add').post((req,res)=>{
    console.log('add');
    insertBook(req.body).then(result =>{
        console.log(result);
        res.status(200).json(result)
    }).catch(err=>{
        console.log(err);
    })
})

router.route('/get').get((req,res)=>{
    console.log('get');
    getBook(req.body).then(result =>{
        console.log(result);
        res.status(200).json(result)
    }).catch(err=>{
        console.log(err);
    })
})

module.exports = router