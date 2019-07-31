require('./config/config');
require('./models/db'); 
require('./config/passportConfig');
require('./config/jwt_helper');
const passport = require('passport');


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routeController = require('./routes/register_route');

var app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use('/api', routeController);



// error handler
app.use((err, req, res, next) =>{
    if(err.name == 'ValidationError'){
        var valError = [];
        Object.keys(err.errors).forEach(key => valError.push(err.errors[key].message));
        res.status(422).send(valError);
    }
})



// start server
app.listen(process.env.PORT, ()=> console.log(`server started at port: ${process.env.PORT}`))