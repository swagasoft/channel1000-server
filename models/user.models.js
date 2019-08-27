const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
var uniqueValidator = require('mongoose-unique-validator');



var userSchema = mongoose.Schema({

    fullname: {
        type: String,
        required:'fullname can\t be empty'
    },
   
    email: {
        type: String,
        required: true,
        unique: true,

    },
    username: {
        type: String,
        required: true,
        unique: true,

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
    ref_link: {
        type: String,
    } ,
    ref: {
        type: String,
    } ,
    level: {
        type: String, enum:['LEVEL-1','LEVEL-2', 'LEVEL-3', 'LEVEL-4','LEVEL-5','LEVEL-6'], default:'LEVEL-1'
    } ,
    downline:[{
        type: String
    }] ,
    activate: {
        type: Boolean,
    },
    date: {
        type: Date, default: Date.now()
    },
});

// Apply the uniqueValidator plugin to userSchema.
userSchema.plugin(uniqueValidator);

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
