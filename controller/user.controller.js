const mongoose = require('mongoose');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const lodash = require('lodash');

const User = mongoose.model('User');
const Invest = mongoose.model('Payment');
const nodemailer = require("nodemailer");
const Base_link = 'http://localhost:4200/#/link/';
const MARKETER = 'MARKETER';


var dashboardInfo = {};
var investInfo = {};

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
    let checkRole =  req.body.role;

// convert all m to lower case.
let getEmail = req.body.email;
let email_lower = getEmail.toLowerCase();
let getUsername= req.body.username;
let usernameToLower = getUsername.toLowerCase();
  // hash user password
  let hashValue = cryptr.encrypt(req.body.password);

  // ===================
 

  if(ref_username != null){
    User.findOne({username:ref_username}).then( result => {
      result.save();
      result.downline.push(usernameToLower);

    });
  }else{
    console.log('REFERRAL IS NOT DEFINE.')
  }

  // =========================

 User.findOne({}, {},{sort : {'date': -1}}, (err, file)=> {
  console.log('LAST MAN IN DATABASE', file.username);
 });
  // let intValue = new_Cust_id + 1;
  let intValue = 0000;

user.fullname = req.body.fullname;
user.username = usernameToLower;
user.email = email_lower;
user.ref_link = Base_link+req.body.username;
user.cust_id = intValue;
user.role =  req.body.role;
user.ref = ref_username;
user.downline.push();
user.password = hashValue;
user.activate = false;

user.save().then((doc) => {
    if(doc){
      // ####### create account for marketer
      if (checkRole === MARKETER){
        console.log(' USER IS A MARKETER...');
        console.log(doc._id);
        newAccount = new Invest();
        newAccount.cashout = 0;
        newAccount.user = doc.username;
        newAccount.user_id = doc._id;
        newAccount.save().then((saved) => console.log(saved));

      }

       res.status(201).send(['Registration succesful']);
    }else  if(err.errors.email) {
    res.status(442).send(['User already exist!']);
    }else if(err.errors.username){
        res.status(422).send(['Username has been taken']);
      }else{
        res.status(404).send(['error saving user doc']);
        return next(err);      
      }
    
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
      // send user role to client...
      res.json({"token":token ,  doc: lodash.pick(user, ['role'])});

    }else{
      res.status(401).send([' Wrong password.']);
    }
}
});
}


const userDashboard = (req, res, next) =>{
User.findOne({_id: req._id}, (err, doc) => {
 dashboardInfo = doc;
}).then( ()=> {
  Invest.findOne({user_id: req._id}, (err, doc) => {
    investInfo = doc;
  });
}).then(()=> {
res.status(200).json({status: true, 
  user: lodash.pick(dashboardInfo,
    ['email','fullname', 'username','role', 'ref_link',
    'cust_id','cust_id','activate','level', 'downline'])});

});

}

const editAccount = (req, res, next) => {
User.findOne({_id: req._id}, (err, doc) => {
  if(!doc){
    return res.status(204).json({status: false, message: 'record not found'});
  }else{
    return res.status(200).json({status: true, 
      user: lodash.pick(doc,['username','fullname', 
      'email','role','cust_id', 'ref_link'])});
  }
});
}

module.exports = { register, index, authenticate, userDashboard, editAccount}
