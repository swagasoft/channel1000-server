const mongoose = require('mongoose');

var paymentSchema = mongoose.Schema({
    account: {
        type: Number, default: 0
    },
    investment: {
        type: Number
    },
    cashout: {
        type: Number, default: 0
    },
});

mongoose.model('Payment', paymentSchema);