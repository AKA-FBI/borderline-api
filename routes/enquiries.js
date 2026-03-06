const express = require("express");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const Enquiry = require("../models/Enquiry");
const auth = require("../middleware/auth");
const { sendEnquiryNotification, sendEnquiryConfirmation } = require("../config/email");

const router = express.Router();

// Rate limit for public submissions (5 per hour per IP)
const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: "Too many submissions. Please try again later." },
});

// POST /api/enquiries — public: submit an enquiry
router.post("/", submitLimiter, [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("phone").optional().trim(),
  body("country").optional().trim(),
  body("level").optional().trim(),
  body("message").optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const enquiry = new Enquiry(req.body);
    await enquiry.save();

    // Send emails (don't block response)
    sendEnquiryNotification(enquiry);
    sendEnquiryConfirmation(enquiry);

    res.status(201).json({ message: "Enquiry submitted successfully", id: enquiry._id });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit enquiry" });
  }
});

// GET /api/enquiries — admin: list all enquiries
router.get("/", auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const enquiries = await Enquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Enquiry.countDocuments(filter);

    res.json({ enquiries, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/enquiries/:id — admin: get single enquiry
router.get("/:id", auth, async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ error: "Enquiry not found" });
    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/enquiries/:id — admin: update status/notes
router.put("/:id", auth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(notes !== undefined && { notes }) },
      { new: true }
    );
    if (!enquiry) return res.status(404).json({ error: "Enquiry not found" });
    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/enquiries/:id — admin: delete enquiry
router.delete("/:id", auth, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ error: "Enquiry not found" });
    res.json({ message: "Enquiry deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
