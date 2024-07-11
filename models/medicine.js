const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  medicine: String,
  price: Number,
  date: Date,
  description:String,

});

const medicine = mongoose.model('', medicineSchema);

module.exports = medicine;