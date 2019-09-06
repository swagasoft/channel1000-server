mongoose = require('mongoose');

const User = mongoose.model('User');
const Transaction = mongoose.model('Transaction');
const Invest = mongoose.model('Payment');


const loadBalance = (req, res, next) => {
    console.log('LOAD BALANCE');
Invest.findOne({user_id: req._id}, (err, doc) => {
res.status(200).send({doc});
});
}

const processCashout = async(req, res, next)=> {
    console.log(req.params.value);
    console.log(req._id);
    let curDate = Date.now();
    let cashout = req.params.value;
    await Invest.updateOne({user_id : req._id},{$inc : {earnings: -cashout}});
    await Invest.updateOne({user_id : req._id}, {$inc : {cashout:cashout}});
    await Invest.updateOne({user_id : req._id}, {date: curDate});
    await Invest.findOne({user_id: req._id}, (err, doc) => {
        res.status(200).send({doc});
        });
   
}

const getTransactions = (req, res) => {
    Transaction.find({user_id: req._id}, (err, result)=> {
        res.status(200).send({result});
    });
}

const usersCashout = (req, res, next) => {
  Invest.find().where('cashout').gte(1).exec((error, result)=> {
res.status(200).send({result});
    });
}


module.exports = { loadBalance, usersCashout, getTransactions, processCashout }