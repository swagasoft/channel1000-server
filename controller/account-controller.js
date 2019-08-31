mongoose = require('mongoose');

const User = mongoose.model('User');
const Transaction = mongoose.model('Transaction');
const Invest = mongoose.model('Payment');

const loadBalance = (req, res, next) => {
Invest.findOne({user_id: req._id}, (err, doc) => {

res.status(200).send({doc});
});
}

const getTransactions = (req, res) => {
    console.log('trax routes fires', req._id);
    Transaction.find({user_id: req._id}, (err, result)=> {
        res.status(200).send({result});
    });
}

const usersCashout = (req, res, next) => {
  Invest.find().where('cashout').gte(1).exec((error, result)=> {
      console.log(result);
res.status(200).send({result});
    });
}


module.exports = { loadBalance, usersCashout, getTransactions }