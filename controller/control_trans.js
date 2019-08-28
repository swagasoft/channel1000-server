const mongoose = require('mongoose');
// var Transaction = require('../models/model_trans');

const User = mongoose.model('User');
const Transaction = mongoose.model('Transaction');
const Invest = mongoose.model('Payment');



const transaction = (req, res, next) => {
    var tranx = new Transaction();
    
    var user_username = req.body.user;
    tranx.amount = req.body.amount;
    tranx.status = req.body.status;
    tranx.user_id = req._id;
    tranx.message = req.body.message;
    tranx.user = req.body.user;
    tranx.email = req.body.email;
    tranx.transaction = req.body.trans;
    tranx.reference = req.body.reference;
     tranx.save((err, doc) => {
                User.findOne(
                  {$and: [
                    {role: 'INVESTOR'},
                    {$where: 'this.downline.length < 4'},
                    {activate: true}
                  ]}
                ).sort({date: 1}).then( result4 => {
                 if(result4){
                    result4.downline.push(user_username);
                    result4.save();
                    // #########
                    var invest = new Invest();
                    invest.user = user_username;
                    invest.user_id = req._id;
                    invest.investment = req.body.amount;
                    invest.amount = req.body.amount;
                    invest.save().then(()=> {
                       User.findByIdAndUpdate(req._id, {$set: {activate: true}},{new: true});
                    });
                    return;

                 }else{
                    User.findOne(
                        {$and: [
                          {role: 'INVESTOR'},
                          {$where: 'this.downline.length < 16'},
                          {activate: true}
                        ]}
                      ).sort({date: 1}).then(result16 => {
                        if(result16){
                            result16.downline.push(user_username);
                            result16.save();
                             // #########
                    var invest = new Invest();
                    invest.user = user_username;
                    invest.user_id = req._id;
                    invest.investment = req.body.amount;
                    invest.amount = req.body.amount;
                    invest.save().then(()=> {
                       User.findByIdAndUpdate(req._id, {$set: {activate: true}},{new: true});
                    });
                     return;

                        }else{
                    User.findOne(
                        {$and: [
                          {role: 'INVESTOR'},
                          {$where: 'this.downline.length < 64'},
                          {activate: true}
                        ]}
                      ).sort({date: 1}).then( result64 => {
                        if(result64){
                    result64.save();
                     // #########
                     var invest = new Invest();
                     invest.user = user_username;
                     invest.user_id = req._id;
                     invest.investment = req.body.amount;
                     invest.amount = req.body.amount;
                     invest.save().then(()=> {
                        User.findByIdAndUpdate(req._id, {$set: {activate: true}},{new: true});
                     });
                    return;

                        }else{
                    User.findOne(
                        {$and: [
                          {role: 'INVESTOR'},
                          {$where: 'this.downline.length < 256'},
                          {activate: true}
                        ]}
                      ).sort({date: 1}).then( result256 => {
                        result256.downline.push(user_username);
                         // #########
                    var invest = new Invest();
                    invest.user = user_username;
                    invest.user_id = req._id;
                    invest.investment = req.body.amount;
                    invest.amount = req.body.amount;
                    invest.save().then(()=> {
                       User.findByIdAndUpdate(req._id, {$set: {activate: true}},{new: true});
                    });
                    return;      });
                                    }
                                });
                                }
                            });
                 }
                });
            
    })
      
     
  

  

res.redirect('/investment_create');
}

investmentCreate = (req,res, next)=> {
    console.log('redirection successful..');
    console.log(req._id);
}

module.exports = {transaction, investmentCreate}