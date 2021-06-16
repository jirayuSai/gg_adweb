var expressFunction = require('express')
const router = expressFunction.Router()
const authorization = require('../config/authorize')
const mongoose = require('mongoose')

var Schema = require("mongoose").Schema
const bookSchema = Schema({
    
    name: String,
    writer: String,
    quantity: Number,
    price: Number,

})
const cartSchema = Schema({
    userId: String,
    book: [bookSchema],
}, {
    coolection: 'cart'
})
let Cart
try {
    Cart = mongoose.model('cart')
} catch (error) {
    Cart = mongoose.model('cart', cartSchema)
}
const insertCart = (dataCart) => {
    return new Promise((resolve, reject) => {
        var new_cart = new Cart(
            dataCart
        )
        new_cart.save((err, data) => {
            if (err) {
                reject(new Error('Cannot insert cart to DB!!!'))
            } else {
                resolve({ message: 'Cart added successfully' })
            }
        })
    })
}

const pushCart = (cartData, id) => {
    console.log("this " + id);
    return new Promise((resolve, reject) => {
        Cart.updateOne({ userId: id }, { $push: { book: cartData.book } }, (err, data) => {
            if (err) {
                reject(new Error('Cannot push data cart to DB!!!'))
            } else {
                resolve({ message: 'Cart push successfully' }, data)
            }
        })
    })
}

const pushQuantityCart = (myquantity, cartData, id) => {
    return new Promise((resolve, reject) => {
        Cart.updateOne({ userId: id, "book.name":cartData.book.name}, { $set :{ 'book': { 'quantity':  myquantity,
    'name':cartData.book.name,'detail':cartData.book.detail,'type':cartData.book.type,'price':cartData.book.price  } }}, (err, data) => {
            if (err) {
                reject(new Error('Cannot push data cart to DB!!!'))
            } else {
                resolve({ message: 'Cart push successfully' }, data)
            }
        })
    })
}

const getCartById = (id) => {
    return new Promise((resolve, reject) => {
        Cart.find({ userId: id }, (err, data) => {
            if (err) {
                reject(new Error('Cannot get cart !!!'))
            } else {
                if (data) {
                    resolve(data)
                } else {
                    reject(new Error('Cannot  get cart !!!'))
                }
            }
        })
    })
}

const delteBookInCart = (userid, bookid) => {
    console.log();
    return new Promise((resolve, reject) => {
        Cart.updateOne({ userId: userid }, { $pull: { 'book': { '_id': '' + bookid + '' } } }, (err, data) => {
            if (err) {
                reject(new Error('Cannot Delete book !!!'))
            } else {
                if (data) {
                    resolve(data)
                } else {
                    reject(new Error('Cannot Delete book !!!'))
                }
            }
        })
    })
}

router.route('/delete').post((req, res) => {
    console.log(req.body);
    delteBookInCart(req.body.userId, req.body.bookId).then(result => {
        console.log(result);
        res.status(200).json(result)
    }).catch(err => {
        console.log(err);
    })
})

router.route('/add/:id').get((req, res) => {
    console.log(req.params.id);
    const playload = {
        userId: req.params.id
    }
    insertCart(playload).then(result => {
        console.log(result);
        res.status(200).json(result)
    }).catch(err => {
        console.log(err);
    })
})

router.route('/put').put((req, res) => {
    console.log("1");
    let playload = {
        book: {

            
            name: req.body.book.name,
            quantity: req.body.book.quantity,
            price: req.body.book.price,
            
            
        }
    }
    getCartById(req.body.userId).then(result => {
        console.log(result)
        if (result[0].book.length > 0) {
            for (let i = 0; i < result[0].book.length; i++) {
                if (result[0].book[i].name == playload.book.name) {
                    console.log("2");
                    myquantity = result[0].book[i].quantity + playload.book.quantity
                    pushQuantityCart(myquantity,playload, req.body.userId).then(result => {
                        res.status(200).json(result)
                    }).catch(err => {
                        console.log(err);
                    })
                }
                else {
                    console.log("3");
                    pushCart(playload, req.body.userId).then(result => {
                        res.status(200).json(result)
                    }).catch(err => {
                        console.log(err);
                    })
                }
            }
        } else {
            console.log("4");
            pushCart(playload, req.body.userId).then(result => {
                res.status(200).json(result)
            }).catch(err => {
                console.log(err);
            })
        }
    }).catch(err => {
        console.log(err);
    })

})


router.route('/get/:id').get(authorization, (req, res) => {
    getCartById(req.params.id).then(result => {
        console.log(result);
        res.status(200).json(result)
    }).catch(err => {
        console.log(err);
    })
})



module.exports = router