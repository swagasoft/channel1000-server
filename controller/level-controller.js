const mongoose = require('mongoose');

const User = mongoose.model('User');
const Transaction = mongoose.model('Transaction');
const Invest = mongoose.model('Payment');


postUserToLevel2 = async (req, res, next) => {
    console.log('level two route firesss', req);
    // for (var c in req.body){
    //     console.log('fileee',c);
    // }
res.status(200).send('success from server');
    
}

module.exports = {postUserToLevel2}