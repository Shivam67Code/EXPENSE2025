const mongoose = require("mongoose");

const IncomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
},
  { timestamps: true });

module.exports = mongoose.model("Income", IncomeSchema);