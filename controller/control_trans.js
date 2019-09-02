const mongoose = require('mongoose');
// var Transaction = require('../models/model_trans');

const User = mongoose.model('User');
const Transaction = mongoose.model('Transaction');
const Invest = mongoose.model('Payment');

 function updateUser(body, id){
   console.log('update user fires');
  var invest = new Invest();
  invest.user = body.user;
  invest.user_id = id;
  invest.investment = body.amount;
  invest.amount = body.amount;
  invest.save().then(()=> {
     User.findByIdAndUpdate(id, {$set: {activate: true}}, (err, update)=>{
   console.log('update user updating   ACTIVATE == TRUE');

     });

  });
  return;
 }

const transaction = async (req, res, next) => {
    
 const userAccount =  await Invest.find({user_id : req._id});
 if (userAccount.length ){
  console.log('USER ACCOUNT FOUND IN DATABASE');
 await Invest.findOne({user_id : req._id}).then((user_record)=> {
  //  console.log('file',file);
   let previousInvest =  user_record.investment;
   let newPayment = req.body.amount;
   let new_balance = previousInvest + newPayment;
   console.log(new_balance);
   Invest.findOneAndUpdate({user_id : req._id}, {$set : {investment : new_balance}}).then(
     (update)=> {
      var trax = new Transaction();
      trax.amount = req.body.amount;
      trax.status = req.body.status;
      trax.user_id = req._id;
      trax.message = req.body.message;
      trax.user = req.body.user;
      trax.email = req.body.email;
      trax.transaction = req.body.trans;
      trax.reference = req.body.reference;
      trax.save().then(()=> {
       res.status(200);

      });
     }
   );
  
 });

 }else{
   console.log('USER ACCOUNT NOT FOUND IN DATABASE')
 
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
     tranx.save().then(()=> {
                User.findOne(
                  {$and: [
                    {role: 'INVESTOR'},
                    {$where: 'this.downline.length < 4'},
                    {activate: true}
                  ]}
                ).sort({date: 1}).then( result4 => {
                  console.log('RESULT 4');
                 if(result4){
                    result4.downline.push(user_username);
                    result4.save().then(()=> {
                      updateUser(req.body, req._id);
                    });
                    // #########
                  
                 }else{
                    User.findOne(
                        {$and: [
                          {role: 'INVESTOR'},
                          {$where: 'this.downline.length < 16'},
                          {activate: true}
                        ]}
                      ).sort({date: 1}).then(result16 => {
                        if(result16){
                  console.log('RESULT 16');
                            result16.downline.push(user_username);
                            result16.save();
                             // #########
                       updateUser(req.body, req._id);

                        }else{
                    User.findOne(
                        {$and: [
                          {role: 'INVESTOR'},
                          {$where: 'this.downline.length < 64'},
                          {activate: true}
                        ]}
                      ).sort({date: 1}).then( result64 => {
                        if(result64){
                  console.log('RESULT 64');
                  result64.downline.push(user_username);
                    result64.save();
                     // #########
                         updateUser(req.body, req._id);
                        }else{
                    User.findOne(
                        {$and: [
                          {role: 'INVESTOR'},
                          {$where: 'this.downline.length < 256'},
                          {activate: true}
                        ]}
                      ).sort({date: 1}).then( result256 => {
                        console.log('RESULT 256 ')
                        result256.downline.push(user_username);
                         // #########
                        updateUser(req.body, req._id);
                        });
                                    }
                                });
                                }
                            });
                 }
                });
            
    })
      
res.redirect('/investment_create');
  }
}


investmentCreate = (req,res, next)=> {
    console.log('redirection successful..');
    console.log(req._id);
}

module.exports = {transaction, investmentCreate}