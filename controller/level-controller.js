const mongoose = require('mongoose');

const User = mongoose.model('User');
const Transaction = mongoose.model('Transaction');
const Invest = mongoose.model('Payment');
const level2 = 'LEVEL-2';
const level3 = 'LEVEL-3';
const level4 = 'LEVEL-4';


postUserToLevel2 = async (req, res, next) => {
    console.log('FIRE USER TO LEVEL2');
    // ####### SHARING PROFIT
     let getDocumentID = req.params.id;
     const funds_from4 = 4000;
     let dividend =  (funds_from4 * 0.3) ;
     let re_investment = (funds_from4 * 0.5);
     let marketer_share = ( funds_from4 * 0.2);
     
     
    //  console.log('dividend', dividend);
     console.log('re invest', re_investment);
    //  console.log('marketer share ', marketer_share);

    //  # update user LEVEL
     await User.updateOne({_id: getDocumentID}, {$set: {level : level2}}).then((result)=> {
          console.log('USER RESULT', result);
      });
    //   #update user account
    await Invest.updateOne({user_id: getDocumentID},{$set: {investment: re_investment}});
    await Invest.updateOne({user_id : getDocumentID},{$inc : {earnings:dividend}});

     await User.findOne({_id : getDocumentID }, (err, user) => {
      if(user.ref != null){
      console.log(user.ref);
        Invest.findOne({user: user.ref}, {$inc : {earnings: marketer_share}});
      }else{
        console.log('REF IS empty');

      }
  });

  User.find(
            {$and: [
              {role: 'INVESTOR'},
              {level: 'LEVEL-1'},
              {$where: 'this.downline.length >= 4' },
              {$where: 'this.downline.length  < 16' },
              {activate: true}
            ]}
          ).then((docs)=> {
            res.status(200).send({docs, status: true});        
                  });


}

postUserToLevel3 = async (req, res, next) => {
    console.log('FIRE USER TO LEVEL3');
    // ####### SHARING PROFIT
     let getDocumentID = req.params.id;
     const funds_from4 = 32000;
     let dividend =  (funds_from4 * 0.7) ;
     let re_investment = (funds_from4 * 0.3);
     
    //  # update user LEVEL
     await User.updateOne({_id: getDocumentID}, {$set: {level : level3}}).then((result)=> {
          console.log('USER RESULT', result);
      });
    //   #update user account
    await Invest.updateOne({user_id: getDocumentID},{$set: {investment: re_investment}});
    await Invest.updateOne({user_id : getDocumentID},{$inc : {earnings:dividend}});

    //    Return document to client;
    await User.find(
        {$and: [
          {role: 'INVESTOR'},
          {level: 'LEVEL-2'},
          {$where: 'this.downline.length >= 16' },
          {$where: 'this.downline.length  < 64' },
          {activate: true}
        ]}
      ).then((docs)=> {

            res.status(200).send({docs, status: true});        
                  });
}
postUserToLevel4 = async (req, res, next) => {
    // ####### SHARING PROFIT
     let getDocumentID = req.params.id;
     const funds_from4 = 614400;
     let dividend =  (funds_from4 * 0.4) ;
     let re_investment = (funds_from4 * 0.1);
     
    //  # update user LEVEL
     await User.updateOne({_id: getDocumentID}, {$set: {level : level4}}).then((result)=> {
          console.log('USER RESULT', result);
      });
    //   #update user account
    await Invest.updateOne({user_id: getDocumentID},{$set: {investment: re_investment}});
    await Invest.updateOne({user_id : getDocumentID},{$inc : {earnings:dividend}});

    //    Return document to client;
    await User.find(
        {$and: [
          {role: 'INVESTOR'},
          {level: 'LEVEL-3'},
          {$where: 'this.downline.length >= 64' },
          {$where: 'this.downline.length  < 256' },
          {activate: true}
        ]}
      ).then((docs)=> {

            res.status(200).send({docs, status: true});        
                  });
}



module.exports = {postUserToLevel2, postUserToLevel3, postUserToLevel4}