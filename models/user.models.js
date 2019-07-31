const mongoose = require('mongoose');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const jwt = require('jsonwebtoken');


// isInvestor: {
//     type: Boolean,

// },
// isMarketer: {
//     type: Boolean,
// },
var userSchema = mongoose.Schema({

    fullname: {
        type: String,
        required:'fullname can\t be empty'
    },
   
    email: {
        type: String,
        required:'email can\t be empty',
        unique: true

    },
    number: {
        type: Number,
        required:'number can\t be empty',


    },
    password: {
        type: String,
        required:'password is required',
        minlength : [6, 'password must be at least 6 character']

    } ,
    cust_id: {
        type: Number,

    } ,
    role: {
        type: String,

    } ,
    activate: {
        type: Boolean,
    },
    date: {
        type: Date, default: Date.now()
    },
});

// custom validation
userSchema.path('email').validate((val)=> {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'invalid email');

// methods

// generate jwt token...
userSchema.methods.generateJwt = (user)=> {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return jwt.sign({_id: user._id, email: user.email,
        exp: parseInt(expiry.getTime() / 1000),},
         process.env.JWT_SECRET);
}

mongoose.model('User', userSchema);
