const mongoose = require('mongoose');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const lodash = require('lodash');

const User = mongoose.model('User');
const nodemailer = require("nodemailer");
const Base_link = 'http://localhost:4200/#/';

const output= ` <p> you have a new email</p>`

// email section
 function emailUser(address){
var testAccount =  nodemailer.createTestAccount();
var transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  secure: false,
  auth: {
    user: 'ad9ff95ea298d6', // generated ethereal user
    pass: '7bf967715ae155' // generated ethereal password
  }
});

var mailOptions = {
  from: 'youremail@gmail.com',
  to:  address,
  subject: 'Sending Email using Node.js',
  text: 'That was easy!',
  html: output
};


transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info);
  }
});
}




const register = (req, res, next) => {
var user = new User();

// convert all mail to lower case.
let ChangeEmailToLow = req.body.email;
let usernameToLower = req.body.username;
  let email_lower =  ChangeEmailToLow.toLowerCase();

  // hash user password
  let hashValue = cryptr.encrypt(req.body.password);

  User.findOne().sort({date: -1}).limit(1).then( result => {

var new_Cust_id = parseInt(result.cust_id);
  let intValue = new_Cust_id + 1;

user.fullname = req.body.fullname;
user.username = usernameToLower;
user.email = email_lower;
user.ref_link = Base_link+req.body.username;
user.cust_id = intValue;
user.role =  req.body.role;
user.stage = 'newbies';
user.password = hashValue;

user.activate = false;
user.save((err, doc) => {
    if(!err){
        res.send(doc);
        emailUser(doc.email);
    }else {
      if(err.code == 11000){
      res.status(442).send(['Duplicate email address found!']);

      }else{
        res.status(422).send(['Username has been taken']);
          return next(err);
          
      }
    }
});

  });
}




// index controller
const index = (req, res)=> {
  res.render('index');
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
    // send dashboard informations
    return res.status(200).json({status: true, 
      user: lodash.pick(doc,
        ['email', 'username','role', 'ref_link','cust_id','cust_id','activate','stage'])});
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
    return res.status(200).json({status: true, 
      user: lodash.pick(doc,['username','number', 'email','role','cust_id', 'ref_link'])});
  }
});
}

module.exports = { register, index, authenticate, userDashboard, editAccount}
