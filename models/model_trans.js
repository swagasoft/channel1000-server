const mongoose = require('mongoose');



var paymentSchema = mongoose.Schema({
    amount: {
        type: Number,
    },
    reference: {
        type: Number,
    },
    status: {
        type: String,
    },
    transaction: {
        type: String,
    },
    message: {
        type: String,
    },
    user: {
        type: String,
    },
});

mongoose.model('Transaction', paymentSchema);