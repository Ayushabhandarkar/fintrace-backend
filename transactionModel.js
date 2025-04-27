const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    type: {
      type: String,
      enum: [
        "travel",
        "necessity",
        "food",
        "entertainment",
        "luxury",
        "comfort",
      ],
      required: true, // Type is required
    },
    eventTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: null,
      validate: {
        validator: function (v) {
          return v === null || mongoose.Types.ObjectId.isValid(v);
        },
        message: (props) => `${props.value} is not a valid ObjectId!`,
      },
      set: function (v) {
        return v === null || mongoose.Types.ObjectId.isValid(v) ? v : null;
      },
    },
    payeeName: {
      type: String,
      required: true, // payeeName is required
    },
    description: String, // Description is optional
    transactionType: {
      type: String,
      enum: ["transaction", "monthly payment", "income"],
      required: true, // transactionType is required
    },
    amount: {
      type: Number,
      required: true, // Amount is required
    },
    date: {
      type: Date,
      required: true, // Date is required
      default: Date.now, // Set the default date to the current date
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
