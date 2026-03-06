const express = require("express");
const { body, validationResult } = require("express-validator");
const Course = require("../models/Course");
const auth = require("../middleware/auth");

const router = express.Router();

// GET /api/courses — public: list active courses
router.get("/", async (req, res) => {
  try {
    const { level, search, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };
    if (level && level !== "All") filter.level = level;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { university: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
      ];
    }

    const courses = await Course.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Course.countDocuments(filter);

    res.json({ courses, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/courses/all — admin: list all courses (including inactive)
router.get("/all", auth, async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/courses/:id — public: get single course
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/courses — admin: create course
router.post("/", auth, [
  body("title").trim().notEmpty(),
  body("university").trim().notEmpty(),
  body("country").trim().notEmpty(),
  body("level").isIn(["Foundation", "Undergraduate", "Postgraduate", "PhD"]),
  body("duration").trim().notEmpty(),
  body("tuitionFee").trim().notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/courses/:id — admin: update course
router.put("/:id", auth, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/courses/:id — admin: delete course
router.delete("/:id", auth, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
