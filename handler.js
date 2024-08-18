// const express = require("express");
// const serverless = require("serverless-http");

// const app = express();

// app.use(express.json()); // This middleware is essential for parsing JSON request bodies

// // Define your routes here
// app.get("/transactions", async (req, res) => {
//   // Handle GET /transactions
//   res.status(200).json({ message: "Transactions retrieved successfully" });
// });

// app.post("/transactions", async (req, res) => {
//   // Handle POST /transactions
//   console.log(req.body);
//   console.log(req.headers);
//   res.status(201).json({ message: "Transaction created successfully" });
// });

// app.get("/events", async (req, res) => {
//   // Handle GET /events
//   res.status(200).json({ message: "Events retrieved successfully" });
// });

// app.post("/events", async (req, res) => {
//   // Handle POST /events
//   res.status(201).json({ message: "Event created successfully" });
// });

// module.exports.app = serverless(app);

const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const connectDB = require("./db");
const Transaction = require("./transactionModel");
const Event = require("./eventModel");

const app = express();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Define your CRUD routes

// Create Transaction
app.post("/transactions", async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    console.log(transaction);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get All Transactions
app.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create Event
app.post("/events", async (req, res) => {
  try {
    const event = new Event(req.body);
    console.log(event);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get All Events
app.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Other routes for update, delete etc., can be added here.

// Wrap the Express app with serverless-http to run it on AWS Lambda
module.exports.app = serverless(app);
