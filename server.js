require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/auth");
const enquiryRoutes = require("./routes/enquiries");
const courseRoutes = require("./routes/courses");
const eventRoutes = require("./routes/events");
const blogRoutes = require("./routes/blog");
const newsletterRoutes = require("./routes/newsletter");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/newsletter", newsletterRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Dashboard stats — admin overview
const auth = require("./middleware/auth");
const Enquiry = require("./models/Enquiry");
const Course = require("./models/Course");
const Event = require("./models/Event");
const BlogPost = require("./models/BlogPost");
const Subscriber = require("./models/Subscriber");

app.get("/api/dashboard", auth, async (req, res) => {
  try {
    const [
      totalEnquiries, newEnquiries,
      totalCourses, activeCourses,
      totalEvents, upcomingEvents,
      totalPosts, publishedPosts,
      totalSubscribers, activeSubscribers,
    ] = await Promise.all([
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: "new" }),
      Course.countDocuments(),
      Course.countDocuments({ isActive: true }),
      Event.countDocuments(),
      Event.countDocuments({ isActive: true, date: { $gte: new Date() } }),
      BlogPost.countDocuments(),
      BlogPost.countDocuments({ isPublished: true }),
      Subscriber.countDocuments(),
      Subscriber.countDocuments({ isActive: true }),
    ]);

    const recentEnquiries = await Enquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email country level status createdAt");

    res.json({
      stats: {
        enquiries: { total: totalEnquiries, new: newEnquiries },
        courses: { total: totalCourses, active: activeCourses },
        events: { total: totalEvents, upcoming: upcomingEvents },
        blog: { total: totalPosts, published: publishedPosts },
        subscribers: { total: totalSubscribers, active: activeSubscribers },
      },
      recentEnquiries,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
