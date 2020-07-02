const {Schema, model} = require('mongoose');

const schema = new Schema({
    id: {type: Number, required: true},
    date: {type: Date, required: true},
    country: {type: String, required: true},
    city: {type: String, required: true},
    transactions: {type: Number, required: true},
    amount: {type: Number, required: true},
});

module.exports = model('Transactions', schema);
