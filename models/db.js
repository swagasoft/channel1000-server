const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, (err) => {
    if(!err) console.log('mongodb connection successful..');
    else
    console.log("error in connection"+ JSON.stringify(err, undefined, 2));
});

require('./user.models');
require('./model_trans');
require('./payment_model');