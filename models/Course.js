const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  university: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  countryFlag: { type: String, default: "🌍" },
  level: { type: String, required: true, enum: ["Foundation", "Undergraduate", "Postgraduate", "PhD"] },
  duration: { type: String, required: true },
  tuitionFee: { type: String, default: "" },
  description: { type: String, trim: true },
  requirements: { type: String, trim: true },
  intake: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

// Index for search
courseSchema.index({ title: "text", university: "text", country: "text" });

module.exports = mongoose.model("Course", courseSchema);
