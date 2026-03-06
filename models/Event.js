const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, trim: true },
  location: { type: String, required: true, trim: true },
  tag: { type: String, trim: true, default: "Free Entry" },
  capacity: { type: Number },
  registrations: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
