const express = require("express");
const { body, validationResult } = require("express-validator");
const Event = require("../models/Event");
const auth = require("../middleware/auth");

const router = express.Router();

// GET /api/events — public: list upcoming active events
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const filter = { isActive: true, date: { $gte: new Date() } };

    const events = await Event.find(filter)
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Event.countDocuments(filter);

    res.json({ events, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/events/all — admin: list all events
router.get("/all", auth, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/events/:id — public: get single event
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/events — admin: create event
router.post("/", auth, [
  body("title").trim().notEmpty(),
  body("description").trim().notEmpty(),
  body("date").isISO8601(),
  body("location").trim().notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/events/:id — admin: update event
router.put("/:id", auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/events/:id — admin: delete event
router.delete("/:id", auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
