const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventSchema = new Schema(
  {
    description: String,
    eventDate: { type: Date, default: Date.now },
    location: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
