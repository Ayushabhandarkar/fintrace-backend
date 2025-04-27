const express = require("express");
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
    // Get page, limit, transactionType, and eventTypeId from query parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 10; // Default to 10 transactions per page
    const { transactionType, eventTypeId } = req.query;

    // Calculate the skip value
    const skip = (page - 1) * limit;

    // Build the query object
    const query = {};
    if (transactionType) {
      query.transactionType = transactionType;
    }
    if (eventTypeId) {
      query.eventTypeId = eventTypeId;
    }

    // Fetch transactions with pagination, sorting, and filtering
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 }) // Sort by date, closest to current date first
      .skip(skip)
      .limit(limit);

    // Get the total count of transactions for pagination (with the same filter)
    const totalTransactions = await Transaction.countDocuments(query);

    res.json({
      transactions,
      currentPage: page,
      totalPages: Math.ceil(totalTransactions / limit),
      totalTransactions,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Transaction
app.put("/transactions/:id", async (req, res) => {
  try {
    const transactionId = req.params.id;

    // Find the transaction by ID and update it with the request body
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      req.body, // The request body contains the updated fields
      { new: true, runValidators: true } // Return the updated transaction and run validators
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(updatedTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get Transaction by ID
app.get("/transactions/:id", async (req, res) => {
  try {
    const transactionId = req.params.id; // Get the transaction ID from the request parameters

    // Find the transaction by ID
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Return the transaction if found
    res.json(transaction);
  } catch (err) {
    // Handle invalid ObjectId or other errors
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid transaction ID format' });
    }
    res.status(500).json({ message: err.message });
  }
});

// Delete Transaction by ID
app.delete("/transactions/:id", async (req, res) => {
  try {
    const transactionId = req.params.id; // Get the transaction ID from the request parameters

    // Find the transaction by ID and delete it
    const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);

    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Return a success message after deletion
    res.json({ message: "Transaction deleted successfully", deletedTransaction });
  } catch (err) {
    // Handle invalid ObjectId or other errors
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid transaction ID format' });
    }
    res.status(500).json({ message: err.message });
  }
});

// Create Event
// Create a new event (POST)
app.post("/events", async (req, res) => {
  try {
    const { description, eventDate, location } = req.body;

    if (!description || !location) {
      return res.status(400).json({ message: "Description and location are required" });
    }

    const event = new Event({
      description,
      eventDate: eventDate || Date.now(), // Use provided date or default to now
      location,
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all events (GET)
app.get("/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }); // Sorted by creation time
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an event (PUT)
app.put("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description, eventDate, location } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Update the fields only if provided in the request body
    if (description) event.description = description;
    if (eventDate) event.eventDate = eventDate;
    if (location) event.location = location;

    await event.save();
    res.status(200).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Get one event (GET by ID)
app.get("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = app;
