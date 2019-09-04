const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser : true}, (err) => {
    if(!err) console.log('mongodb connection successful..');
    else
    console.log("error in connection"+ JSON.stringify(err, undefined, 2));
});

require('./user.models');
require('./model_trans');
require('./invest_model');