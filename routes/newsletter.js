const express = require("express");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const Subscriber = require("../models/Subscriber");
const auth = require("../middleware/auth");
const { sendSubscriberWelcome } = require("../config/email");

const router = express.Router();

// Rate limit subscriptions (3 per hour per IP)
const subscribeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { error: "Too many subscription attempts. Please try again later." },
});

// POST /api/newsletter/subscribe — public
router.post("/subscribe", subscribeLimiter, [
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email } = req.body;
    const existing = await Subscriber.findOne({ email });

    if (existing) {
      if (existing.isActive) {
        return res.json({ message: "You're already subscribed!" });
      }
      // Re-activate
      existing.isActive = true;
      await existing.save();
      return res.json({ message: "Welcome back! Your subscription has been reactivated." });
    }

    const subscriber = new Subscriber({ email, source: req.body.source || "website" });
    await subscriber.save();

    sendSubscriberWelcome(email);

    res.status(201).json({ message: "Successfully subscribed!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to subscribe" });
  }
});

// POST /api/newsletter/unsubscribe — public
router.post("/unsubscribe", [
  body("email").isEmail().normalizeEmail(),
], async (req, res) => {
  try {
    const subscriber = await Subscriber.findOneAndUpdate(
      { email: req.body.email },
      { isActive: false },
      { new: true }
    );
    if (!subscriber) return res.status(404).json({ error: "Email not found" });
    res.json({ message: "Successfully unsubscribed" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/newsletter/subscribers — admin: list subscribers
router.get("/subscribers", auth, async (req, res) => {
  try {
    const { active } = req.query;
    const filter = active !== undefined ? { isActive: active === "true" } : {};
    const subscribers = await Subscriber.find(filter).sort({ createdAt: -1 });
    const total = await Subscriber.countDocuments(filter);
    res.json({ subscribers, total });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
