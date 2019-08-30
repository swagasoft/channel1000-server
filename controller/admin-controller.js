const mongoose = require('mongoose');

const User =  mongoose.model('User');
const Invest = mongoose.model('Payment');
const Transaction = mongoose.model('Transaction');


    //  admin dashboard route....
const adminDashboard = (req, res, next)=> {
 const findAllInvestor = User.countDocuments({role:'INVESTOR'});  
 const findAllInvestment = Invest.countDocuments({});
 const findAllTransact = Transaction.countDocuments({});
 const findAllMarketer = User.countDocuments({role:'MARKETER'});
 
 Promise.all([findAllInvestor, findAllInvestment,
     findAllTransact,findAllMarketer]).then((values)=> {

     const investors = values[0];
     const allInvestment = values[1];
     const allTransaction = values[2];
     const marketers = values[3];

    console.log('user reult', investors);
    console.log('investment reult', allInvestment);
    console.log('traxx reult', allTransaction);
    console.log('marketer reult', marketers);


     res.status(201).send({investors, 
        allInvestment, allTransaction, marketers});
 });

}

// get investor's route....
const getInvestors = (req, res, next) => {

    Invest.find({}, (err, doc) => {
    console.log(doc);
    res.status(200).send({doc});
});
}


module.exports = {adminDashboard, getInvestors }