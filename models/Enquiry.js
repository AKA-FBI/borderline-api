const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  country: { type: String, trim: true },
  level: { type: String, enum: ["Foundation", "Undergraduate", "Postgraduate", "PhD", ""], default: "" },
  message: { type: String, trim: true },
  status: { type: String, enum: ["new", "contacted", "in-progress", "closed"], default: "new" },
  notes: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model("Enquiry", enquirySchema);
