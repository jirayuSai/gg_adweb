var expressFunction = require('express')
const router = expressFunction.Router()
const authorization = require('../config/authorize')
const mongoose = require('mongoose')

var Schema = require("mongoose").Schema
const orderSchema = Schema({
    userid:String,
    name:String,
    price:Number,
    img:String,
    
},{
    coolection:'orders'
})
let Orders
try{
    Orders=mongoose.model('orders')
}catch(error){
    Orders=mongoose.model('orders',orderSchema)
}
mongoose.set('useFindAndModify', false);

const getOrders = () =>{
    return new  Promise((resolve, reject)=>{
        Orders.find({},(err,data)=>{
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

const delteOrderById = (id) =>{
    return new  Promise((resolve, reject)=>{
        Orders.findOneAndRemove({_id:id},(err,data)=>{
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

const getOrdersById = (id) =>{
    return new  Promise((resolve, reject)=>{
        Orders.find({userid:id},(err,data)=>{
            if(err){
                reject(new Error('Cannot delete order !!!'))
            }else{
               if(data){
                   resolve(data)
               }else{
                reject(new Error('Cannot delete order !!!'))
               }
            }
        })
    })
}

const putOderById = (orderData) =>{
    console.log(orderData);
    return new  Promise((resolve, reject)=>{
        Orders.findOneAndUpdate({_id:orderData._id},{ img:orderData.img },(err,data)=>{
            if(err){
                reject(new Error('Cannot put books !!!'))
            }else{
               if(data){
                   resolve(data)
               }else{
                reject(new Error('Cannot put books !!!'))
               }
            }
        })
    })
}
const insertOder = (dataOrder) =>{
    return new Promise((resolve, reject) => {
        var new_book = new Orders(
            dataOrder
        )
        new_book.save((err,data)=>{
            if(err){
                reject(new Error('Cannot insert order to DB!!!'))
            }else{
                resolve({message:'Order added successfully'})
            }
        })
    })
}
router.route('/get/:id').get(authorization,(req,res)=>{
    getOrdersById(req.params.id).then(result =>{
        console.log(result);
        res.status(200).json(result)
    }).catch(err=>{
        console.log(err);
    }) 
})
router.route('/get').get(authorization,(req,res)=>{
    getOrders(req.body).then(result =>{
        console.log(result);
        res.status(200).json(result)
    }).catch(err=>{
        console.log(err);
    }) 
})
router.route('/post').post(authorization,(req,res)=>{
    insertOder(req.body).then(result =>{
        console.log(result);
        res.status(200).json(result)
    }).catch(err=>{
        console.log(err);
    })
})
router.route('/put').put(authorization,(req,res)=>{
    putOderById(req.body).then(result =>{
        console.log(result);
        res.status(200).json(result)
    }).catch(err=>{
        console.log(err);
    })
})

router.route('/delete/:id').delete(authorization,(req,res)=>{
    delteOrderById(req.params.id).then(result =>{
        console.log(result);
        res.status(200).json(result)
    }).catch(err=>{
        console.log(err);
    })
})

module.exports = router