const mongoose = require('mongoose');

var paymentSchema = mongoose.Schema({
   
    user: {
        type: String
    },
    user_id: {
        type: String
    },
    investment: {
        type: Number
    },
    cashout: {
        type: Number, default: 0
    },
    earnings: {
        type: Number, default: 0
    },
    date: {
        type: Date, default: Date.now()
    },
    history: [{
        type: Number
    }    
    ],
});

mongoose.model('Payment', paymentSchema);