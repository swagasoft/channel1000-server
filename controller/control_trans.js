const mongoose = require('mongoose');
// var Transaction = require('../models/model_trans');

const User = mongoose.model('User');
const Transaction = mongoose.model('Transaction');
const Invest = mongoose.model('Payment');
const PayoutModel = mongoose.model('Payout');

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
 res.status(200).send({message: 'Already a subscribe member'});

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
      
res.status(200).send({status: true, message: 'payment saved!'});
  }
}



investmentCreate = (req,res, next)=> {
    console.log('redirection successful..');
    console.log(req._id);
}

const payOutUser = async (req, res) => {
  var newPayout = new PayoutModel();

    console.log(req.params.values);
      let values = req.params.values;
      let nameArr = values.trim().split(',');
      user_ID = nameArr[0];
      username = nameArr[1];
      amount = nameArr[2];
     
      newPayout.amount = amount;
      newPayout.user_id = user_ID;
      newPayout.username = username;
      newPayout.save();

      await Invest.updateOne({user_id: user_ID},{$set: {cashout: 0}}).then((doc)=> {
        console.log('UPDATE', doc);
      })

      await  Invest.find().where('cashout').gte(1).exec((error, result)=> {
        console.log('sending result....');
        res.status(200).send({result});
});
 }


module.exports = {transaction, investmentCreate, payOutUser}