const mongoose = require('mongoose');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const lodash = require('lodash');

const User = mongoose.model('User');
const nodemailer = require("nodemailer");
const Base_link = 'http://localhost:4200/#/link/';

// output mail
const output= ` <div style="text-align: center">
 <p>  Hello </p>  <br>
<p> Thank you for choosing channel1000, you a step
away from becoming our millioniare.</p> <br>

<a href="www.channel1000.com">start now!</a>
</div>`

// email section
 function emailUser(address, username){
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
  from: 'Channnel1000',
  to:  address,
  subject: 'Welcome to channel1000',
  text: 'invetment for the future',
  html: output
};

// node mailer system
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
    let ref_username = req.body.ref_username;
    console.log('referal',ref_username);

    // User.findOne().sort({date: 1}).limit(1).then( doc => {
    //   console.log(doc.downline);
    // })

// convert all m to lower case.
let getEmail = req.body.email;
let email_lower = getEmail.toLowerCase();
let getUsername= req.body.username;
let usernameToLower = getUsername.toLowerCase();
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
user.ref = 'swagasoft';
user.downline.push('username2');
user.password = hashValue;
user.activate = false;

user.save((err, doc) => {
    if(!err){
       console.log('user details saved in database');
       res.status(201).send(['Registration succesful']);
      emailUser(doc.email, doc.username);
    }else  if(err.errors.email) {
    res.status(442).send(['User already exist!']);
    }else if(err.errors.username){
        res.status(422).send(['Username has been taken']);
      }else{
        res.status(404).send(['error saving user doc']);
        return next(err);      
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
