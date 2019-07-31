const mongoose = require('mongoose');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const lodash = require('lodash');

const User = mongoose.model('User');


const register = (req, res, next) => {
var user = new User();

// convert all mail to lower case.
let ChangeEmailToLow = req.body.email;
  let email_lower =  ChangeEmailToLow.toLowerCase();

  // hash user password
  let hashValue = cryptr.encrypt(req.body.password);

  User.findOne().sort({date: -1}).limit(1).then( result => {

var new_Cust_id = parseInt(result.cust_id);
console.log('last customer id stored', new_Cust_id);
  let intValue = new_Cust_id + 1;

user.fullname = req.body.fullname;
user.number = req.body.number;
user.email = email_lower;
user.cust_id = intValue;
user.role =  req.body.role;
user.password = hashValue;
user.activate = false;
user.save((err, doc) => {
    if(!err){
        res.send(doc);
        console.log('credentials saved in database')
    }else {
      if(err.code == 11000){
      res.status(442).send(['Duplicate email address found!'])

      }else{
          return next(err);
      }
    }
});

  });
}




// index controller
const index = (req, res)=> {
  res.send(' i just gave you a good reply..')
}



// login controller
const authenticate = (req, res, done)=> {
let email = req.body.email.toLowerCase();
let password = req.body.password;
User.findOne({email:email},(errr, user)=> {
  //  unknown user
  if(!user){
    res.status(404).send([' User not found.']);
  }else{
let databaseUser = user.email;
let databasePassword = user.password;
let decrypePass = cryptr.decrypt(databasePassword);

    if(decrypePass === password){
      token = user.generateJwt(user);
      res.status(200);
      res.json({"token":token});

    }else{
      res.status(401).send([' Wrong password.']);
    }
}
});
}


const userDashboard = (req, res, next) =>{
User.findOne({_id: req._id}, (err, doc) => {
  if(!doc)
  return res.status(400).json({status: false, message: 'user record not found'});
  else{
    return res.status(200).json({status: true, user: lodash.pick(doc,['email', 'fullname','role'])});
  }
});
}

const editAccount = (req, res, next) => {
  console.log('recieved from client');
  console.log(req._id);
User.findOne({_id: req._id}, (err, doc) => {
  console.log('find in database');
  if(!doc){
    console.log('error fatching data')
    return res.status(204).json({status: false, message: 'record not found'});
  }else{
    console.log(doc);
    return res.status(200).json({status: true, user: lodash.pick(doc,['fullname','number', 'email','role','cust_id'])});
  }
});
}

module.exports = { register, index, authenticate, userDashboard, editAccount}
