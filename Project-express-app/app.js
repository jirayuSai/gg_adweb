const expressFunction = require('express');
const mongoose = require('mongoose');
var expressApp = expressFunction();

//ใช้ mongoose connect ใน ฐานข้อมูล
const url = 'mongodb://localhost:27017/Project_AdWeb';
const config ={
    autoIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
};


//middleware
expressApp.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE, OPTION')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Option, Authorization')
    return next()
});

expressApp.use(expressFunction.json());

//middleware for connect mongodb definily
expressApp.use((req, res, next) =>{
    mongoose.connect(url, config)
    .then(() => {
        console.log('Connected to MongoDB...');
        next();

    })
    .catch(err => {
        console.log('Cannot connect to MongoDB...');
        res.status(501).send('Cannot connect to MongoDB')
    })
})

expressApp.use('/user', require('./routes/user'))
expressApp.use('/login', require('./routes/singin'))
expressApp.use('/api/user',require('./api/user'))
expressApp.use('/api/books',require('./api/books'))
expressApp.use('/api/cart', require('./api/cart'))
expressApp.use('/api/order',require('./api/order'))


expressApp.listen(3000, function(){
    console.log('Listening on port 3000');
});