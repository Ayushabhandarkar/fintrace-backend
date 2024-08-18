const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["travel", "necessity", "food", "entertainment", "desire", "wants"],
    },
    eventTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    payeeName: String,
    description: String,
    transactionType: {
      type: String,
      enum: ["transaction", "monthly payment", "income"],
    },
    amount: Number,
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
