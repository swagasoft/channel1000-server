const mongoose = require('mongoose');
// var Transaction = require('../models/model_trans');

const User = mongoose.model('User');
const Transaction = mongoose.model('Transaction');



const transaction = (req, res, next) => {
    console.log('transaction route fires'); 

    var tranx = new Transaction();
    
    tranx.amount = req.body.amount;
    console.log('saving data over here...'); 
    tranx.status = req.body.status;
    tranx.message = req.body.message;
    tranx.user = req.body.user;
    tranx.transaction = req.body.trans;
    tranx.reference = req.body.reference;
    tranx.save((err, doc) => {
        if(!err){
            console.log('tranx saved.....!'+ doc);
        }else{
            console.log(err);
        }
    });

    console.log(req.body);

res.status(201).send('transaction has been saved!');
}

module.exports = {transaction}