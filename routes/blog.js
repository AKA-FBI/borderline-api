const express = require("express");
const { body, validationResult } = require("express-validator");
const BlogPost = require("../models/BlogPost");
const auth = require("../middleware/auth");

const router = express.Router();

// GET /api/blog — public: list published posts
router.get("/", async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const posts = await BlogPost.find(filter)
      .select("-content")
      .sort({ featured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await BlogPost.countDocuments(filter);

    res.json({ posts, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/blog/all — admin: list all posts (including drafts)
router.get("/all", auth, async (req, res) => {
  try {
    const posts = await BlogPost.find().select("-content").sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/blog/:slug — public: get single post by slug
router.get("/:slug", async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, isPublished: true });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/blog — admin: create post
router.post("/", auth, [
  body("title").trim().notEmpty(),
  body("excerpt").trim().notEmpty(),
  body("content").trim().notEmpty(),
  body("category").isIn(["Scholarships", "Tips", "Guides", "Visa", "News", "Student Life"]),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // Generate slug from title
    if (!req.body.slug) {
      req.body.slug = req.body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const post = new BlogPost(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "A post with this slug already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/blog/:id — admin: update post
router.put("/:id", auth, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/blog/:id — admin: delete post
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
