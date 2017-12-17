const mongoose = require('mongoose');

let priceSchema = new mongoose.Schema({
    price: Number,
    dateCrawled: Date
});

let Price = mongoose.model('Price', priceSchema);

module.exports = Price;