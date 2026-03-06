const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  excerpt: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  category: { type: String, required: true, enum: ["Scholarships", "Tips", "Guides", "Visa", "News", "Student Life"] },
  readTime: { type: String, trim: true },
  author: { type: String, default: "Borderline Team" },
  isPublished: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  tags: [{ type: String, trim: true }],
}, { timestamps: true });

// Auto-generate slug from title
blogPostSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  // Estimate read time
  if (this.isModified("content") && this.content) {
    const words = this.content.split(/\s+/).length;
    this.readTime = `${Math.max(1, Math.ceil(words / 200))} min read`;
  }
  next();
});

blogPostSchema.index({ title: "text", content: "text", tags: "text" });

module.exports = mongoose.model("BlogPost", blogPostSchema);
