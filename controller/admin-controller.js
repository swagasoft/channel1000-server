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

const level1Users = async (req, res, next) => {
    // {$where: 'this.downline.length >= 4' },

   await User.find(
        {$and: [
          {role: 'INVESTOR'},
          {level: 'LEVEL-1'},
          {$where: 'this.downline.length >= 4' },
          {$where: 'this.downline.length  < 16' },
          {activate: true}
        ]}
      ).then((docs)=> {
        if(docs){
          res.status(200).send({docs, status: true});
        }else{
          res.status(200).send({docs, status: false, message:'users not found!'});
        }
        
      });
}
const level2Users = async (req, res, next) => {
   await User.find(
        {$and: [
          {role: 'INVESTOR'},
          {level: 'LEVEL-2'},
          {$where: 'this.downline.length >= 16' },
          {$where: 'this.downline.length  < 64' },
          {activate: true}
        ]}
      ).then((docs)=> {
        if(docs){
          res.status(200).send({docs, status: true}); 
        }else{
          res.status(200).send({docs, status: false, message: 'users not found!'}); 
        }
       
      });
}
const level3Users = async (req, res, next) => {
  console.log('level three fires');
   await User.find(
        {$and: [
          {role: 'INVESTOR'},
          {level: 'LEVEL-3'},
          {$where: 'this.downline.length >= 64' },
          {$where: 'this.downline.length  < 256' },
          {activate: true}
        ]}
      ).then((docs)=> {
        if(docs){
res.status(200).send({docs, status: true});        
        }else {
res.status(200).send({ status: false, message: 'users not found'});        
        }
      });
}
const level4Users = async (req, res, next) => {
  console.log('LEVEL FOUR FIRES');
   await User.find(
        {$and: [
          {role: 'INVESTOR'},
          {level: 'LEVEL-4'},
          {$where: 'this.downline.length >= 256' },
          {activate: true}
        ]}
      ).then((docs)=> {
        if(docs){
          res.status(200).send({docs, status: true});
        }else{
          res.status(200).send({docs, status: false, message:'users not found'});
        }
        
      });
}

const getInactiveUsers = async (req, res, next) => {
  console.log('inactive fires');

  await User.find(
    {$and: [
      {role: 'INVESTOR'},
      {activate: false}
    ]}
  ).then((doc) => {
  res.status(200).send({doc});

  });
}

const deleteUser = async (req, res ) => {
  let user_id = req.params.id;
  await User.findOneAndRemove({_id: user_id}).then(()=> {
    res.status(200).send({ status: true , message: 'user deleted.'});

  });

}

const deleteTrans = async (req, res) => {
  let user_id = req.params.id;
  await Transaction.findOneAndRemove({_id: user_id}).then(() => {
    res.status(200).send({status: true, message: ' user deleted'});
  })
}

const readAllTransactions = async (req, res) => {
Transaction.find({}).sort({date: -1}).limit(20).then((trans)=> {
  res.status(200).send({trans});
});
}

const queryUser = async (req, res, next)=> {

  let user = req.params.user;
 const queryInvest = await  Invest.findOne({user: user});

  res.status(200).send({queryInvest});
  
}



module.exports = {adminDashboard,queryUser, getInvestors, level1Users,readAllTransactions,
   level2Users , level3Users, level4Users,deleteTrans, getInactiveUsers, deleteUser}