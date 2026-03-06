require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const Admin = require("./models/Admin");
const Course = require("./models/Course");
const Event = require("./models/Event");
const BlogPost = require("./models/BlogPost");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Create admin user
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existingAdmin) {
      await Admin.create({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        name: "Admin",
        role: "admin",
      });
      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }

    // Seed courses
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      await Course.insertMany([
        { title: "BSc Computer Science", university: "University of Manchester", country: "United Kingdom", countryFlag: "🇬🇧", level: "Undergraduate", duration: "3 years", tuitionFee: "£24,000/yr", description: "A comprehensive programme covering algorithms, software engineering, AI, and data science.", intake: "September", featured: true },
        { title: "MBA International Business", university: "University of Toronto", country: "Canada", countryFlag: "🇨🇦", level: "Postgraduate", duration: "2 years", tuitionFee: "CA$45,000/yr", description: "Develop global business acumen with this internationally recognised MBA programme.", intake: "September, January" },
        { title: "Foundation in Engineering", university: "University of Exeter", country: "United Kingdom", countryFlag: "🇬🇧", level: "Foundation", duration: "1 year", tuitionFee: "£18,500/yr", description: "Pathway programme for students who need to meet entry requirements for engineering degrees." },
        { title: "MSc Data Science", university: "Technical University of Munich", country: "Germany", countryFlag: "🇪🇺", level: "Postgraduate", duration: "2 years", tuitionFee: "€3,000/yr", description: "One of Europe's top data science programmes with minimal tuition fees.", featured: true },
        { title: "BA Economics", university: "Boston University", country: "United States", countryFlag: "🇺🇸", level: "Undergraduate", duration: "4 years", tuitionFee: "$56,000/yr", description: "Study economics at a top US university with strong industry connections." },
        { title: "BSc Nursing", university: "University of Melbourne", country: "Australia", countryFlag: "🇦🇺", level: "Undergraduate", duration: "3 years", tuitionFee: "AU$38,000/yr", description: "Globally recognised nursing programme with clinical placements." },
        { title: "Foundation in Business", university: "INTO Manchester", country: "United Kingdom", countryFlag: "🇬🇧", level: "Foundation", duration: "1 year", tuitionFee: "£16,000/yr", description: "Business pathway programme with guaranteed progression to partner universities." },
        { title: "MSc Artificial Intelligence", university: "University of Edinburgh", country: "United Kingdom", countryFlag: "🇬🇧", level: "Postgraduate", duration: "1 year", tuitionFee: "£34,000/yr", description: "World-leading AI programme from one of the birthplaces of artificial intelligence.", featured: true },
        { title: "BEng Mechanical Engineering", university: "University of British Columbia", country: "Canada", countryFlag: "🇨🇦", level: "Undergraduate", duration: "4 years", tuitionFee: "CA$42,000/yr", description: "Top-ranked engineering programme with co-op work placements." },
      ]);
      console.log("Courses seeded");
    }

    // Seed events
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      await Event.insertMany([
        { title: "Study Abroad Expo — Lagos", description: "Meet university representatives from the UK, Canada, and Australia. Get on-the-spot application reviews, scholarship guidance, and visa consultations.", date: new Date("2026-03-22"), time: "10:00 AM — 4:00 PM", location: "Eko Hotels, Lagos", tag: "Free Entry", capacity: 500, featured: true },
        { title: "Scholarship Workshop — Accra", description: "A hands-on workshop teaching you how to find, apply for, and win fully-funded scholarships worldwide. Includes personal statement review.", date: new Date("2026-04-10"), time: "9:00 AM — 1:00 PM", location: "British Council, Accra", tag: "Limited Seats", capacity: 50 },
        { title: "UK Visa Masterclass — Virtual", description: "Everything you need to know about the UK Tier 4 student visa process. Tips on financial documents, interviews, and common pitfalls.", date: new Date("2026-05-05"), time: "2:00 PM WAT", location: "Zoom Webinar", tag: "Online", capacity: 200 },
        { title: "Canada Education Fair — Lagos", description: "Explore study opportunities in Canada. Representatives from 30+ Canadian universities and colleges will be present.", date: new Date("2026-05-20"), time: "11:00 AM — 5:00 PM", location: "Four Points Sheraton, Lagos", tag: "Free Entry", capacity: 400 },
        { title: "IELTS Preparation Bootcamp", description: "An intensive 2-day bootcamp covering all four IELTS modules. Practice tests and personalised feedback included.", date: new Date("2026-06-08"), time: "9:00 AM — 3:00 PM", location: "Borderline Office, Ado-Ekiti", tag: "Paid", capacity: 30 },
        { title: "Pre-Departure Orientation", description: "For admitted students travelling in September. Covers accommodation, banking, cultural adaptation, and packing essentials.", date: new Date("2026-06-22"), time: "10:00 AM WAT", location: "Virtual + In-Person", tag: "Admitted Students" },
      ]);
      console.log("Events seeded");
    }

    // Seed blog posts
    const blogCount = await BlogPost.countDocuments();
    if (blogCount === 0) {
      await BlogPost.insertMany([
        { title: "Top 10 Scholarships for African Students in 2026", slug: "top-10-scholarships-african-students-2026", excerpt: "A curated list of the most competitive and fully-funded scholarship opportunities available to African students this year.", content: "Full article content goes here. This is a placeholder that should be replaced with the actual article.", category: "Scholarships", author: "Borderline Team", isPublished: true, featured: true, tags: ["scholarships", "africa", "funding"] },
        { title: "How to Write a Winning Personal Statement", slug: "how-to-write-winning-personal-statement", excerpt: "Your personal statement can make or break your application. Here's a step-by-step guide to crafting one that stands out.", content: "Full article content goes here.", category: "Tips", author: "Borderline Team", isPublished: true, tags: ["personal statement", "application", "tips"] },
        { title: "UK vs Canada: Which Is Better for International Students?", slug: "uk-vs-canada-international-students", excerpt: "Comparing tuition costs, post-study work options, quality of life, and immigration pathways in the UK and Canada.", content: "Full article content goes here.", category: "Guides", author: "Borderline Team", isPublished: true, tags: ["uk", "canada", "comparison"] },
        { title: "Student Visa Interview Tips: What You Need to Know", slug: "student-visa-interview-tips", excerpt: "Nervous about your visa interview? These proven tips from our immigration team will help you walk in with confidence.", content: "Full article content goes here.", category: "Visa", author: "Borderline Team", isPublished: true, tags: ["visa", "interview", "tips"] },
        { title: "5 Mistakes to Avoid When Applying to Study Abroad", slug: "5-mistakes-study-abroad-application", excerpt: "Common application mistakes that cost students their dream university placement — and how to avoid them.", content: "Full article content goes here.", category: "Tips", author: "Borderline Team", isPublished: true, tags: ["mistakes", "application", "advice"] },
        { title: "Understanding IELTS: Scores, Prep, and What Universities Want", slug: "understanding-ielts-scores-prep", excerpt: "Everything you need to know about the IELTS exam, from band score requirements to our recommended preparation strategies.", content: "Full article content goes here.", category: "Guides", author: "Borderline Team", isPublished: true, tags: ["ielts", "english", "exam"] },
      ]);
      console.log("Blog posts seeded");
    }

    console.log("Seed complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seed();
