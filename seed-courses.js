require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const mongoose = require("mongoose");
const Course = require("./models/Course");

const courses = [
  // ===== UNDERGRADUATE — Computer Science / Computing / ICT =====
  { title: "BSc Computer Science", university: "University of Manchester", country: "United Kingdom", countryFlag: "🇬🇧", level: "Undergraduate", duration: "3 years", tuitionFee: "", description: "A comprehensive programme covering algorithms, software engineering, AI, and data science.", intake: "September", featured: true },
  { title: "BSc Software Engineering", university: "University of Sheffield", country: "United Kingdom", countryFlag: "🇬🇧", level: "Undergraduate", duration: "3 years", tuitionFee: "", description: "Learn to design, develop, and maintain complex software systems using modern engineering practices." },
  { title: "BSc Artificial Intelligence", university: "University of Edinburgh", country: "United Kingdom", countryFlag: "🇬🇧", level: "Undergraduate", duration: "4 years", tuitionFee: "", description: "Study machine learning, neural networks, robotics, and intelligent systems at a world-leading AI research centre.", featured: true },
  { title: "BSc Cybersecurity", university: "Royal Holloway, University of London", country: "United Kingdom", countryFlag: "🇬🇧", level: "Undergraduate", duration: "3 years", tuitionFee: "", description: "Specialise in information security, cryptography, network defence, and ethical hacking." },
  { title: "BSc Information Technology", university: "University of Toronto", country: "Canada", countryFlag: "🇨🇦", level: "Undergraduate", duration: "4 years", tuitionFee: "", description: "A broad IT programme covering systems administration, databases, networking, and web technologies." },
  { title: "BSc Data Science", university: "University of Warwick", country: "United Kingdom", countryFlag: "🇬🇧", level: "Undergraduate", duration: "3 years", tuitionFee: "", description: "Combine statistics, programming, and domain expertise to extract insights from complex data." },

  // ===== UNDERGRADUATE — Engineering =====
  { title: "BSc Civil Engineering", university: "Imperial College London", country: "United Kingdom", countryFlag: "🇬🇧", level: "Undergraduate", duration: "3 years", tuitionFee: "", description: "Design and build the infrastructure of the future, from bridges and buildings to transport networks." },
  { title: "BSc Mechanical Engineering", university: "University of British Columbia", country: "Canada", countryFlag: "🇨🇦", level: "Undergraduate", duration: "4 years", tuitionFee: "", description: "Top-ranked engineering programme with co-op work placements covering thermodynamics, materials, and design." },
  { title: "BSc Electrical/Electronic Engineering", university: "University of Southampton", country: "United Kingdom", countryFlag: "🇬🇧", level: "Undergraduate", duration: "3 years", tuitionFee: "", description: "Study circuits, power systems, signal processing, and communications at a leading research university." },
  { title: "BSc Chemical Engineering", university: "University of Birmingham", country: "United Kingdom", countryFlag: "🇬🇧", level: "Undergraduate", duration: "3 years", tuitionFee: "", description: "Learn to transform raw materials into valuable products through chemical and biological processes." },
  { title: "BEng Aerospace Engineering", university: "University of Bristol", country: "United Kingdom", countryFlag: "🇬🇧", level: "Undergraduate", duration: "4 years", tuitionFee: "", description: "Design and develop aircraft, spacecraft, and satellite systems at a top aerospace engineering school." },
  { title: "BEng Biomedical Engineering", university: "University of Glasgow", country: "United Kingdom", countryFlag: "🇬🇧", level: "Undergraduate", duration: "4 years", tuitionFee: "", description: "Apply engineering principles to healthcare, from prosthetics and implants to medical imaging devices." },

  // ===== UNDERGRADUATE — Business & Management =====
  { title: "BSc Business Management", university: "King's College London", country: "United Kingdom", countryFlag: "🇬🇧", level: "Undergraduate", duration: "3 years", tuitionFee: "", description: "Develop strong foundations in management, strategy, finance, and organisational behaviour." },
  { title: "BSc International Business", university: "University of Leeds", country: "United Kingdom", countryFlag: "🇬🇧", level: "Undergraduate", duration: "3 years", tuitionFee: "", description: "Study global trade, cross-cultural management, and international market strategies." },
  { title: "BSc Business Analytics", university: "University of Bath", country: "United Kingdom", countryFlag: "🇬🇧", level: "Undergraduate", duration: "4 years", tuitionFee: "", description: "Combine business knowledge with data analytics and quantitative decision-making skills." },
  { title: "BSc Marketing", university: "University of Strathclyde", country: "United Kingdom", countryFlag: "🇬🇧", level: "Undergraduate", duration: "4 years", tuitionFee: "", description: "Learn consumer behaviour, brand strategy, digital marketing, and market research." },
  { title: "BSc Economics", university: "Boston University", country: "United States", countryFlag: "🇺🇸", level: "Undergraduate", duration: "4 years", tuitionFee: "", description: "Study economics at a top US university with strong industry connections." },
  { title: "BSc Accounting & Finance", university: "London School of Economics", country: "United Kingdom", countryFlag: "🇬🇧", level: "Undergraduate", duration: "3 years", tuitionFee: "", description: "World-class programme in accounting, corporate finance, and financial markets." },

  // ===== UNDERGRADUATE — Law =====
  { title: "LLB Law", university: "University of Bristol", country: "United Kingdom", countryFlag: "🇬🇧", level: "Undergraduate", duration: "3 years", tuitionFee: "", description: "A qualifying law degree covering contract law, criminal law, constitutional law, and legal reasoning." },
  { title: "LLB International Law", university: "SOAS University of London", country: "United Kingdom", countryFlag: "🇬🇧", level: "Undergraduate", duration: "3 years", tuitionFee: "", description: "Study international legal frameworks, human rights law, and global governance." },

  // ===== UNDERGRADUATE — Healthcare & Life Sciences =====
  { title: "BSc Nursing", university: "University of Melbourne", country: "Australia", countryFlag: "🇦🇺", level: "Undergraduate", duration: "3 years", tuitionFee: "", description: "Globally recognised nursing programme with clinical placements in hospitals and community settings." },
  { title: "BSc Public Health", university: "University of Leeds", country: "United Kingdom", countryFlag: "🇬🇧", level: "Undergraduate", duration: "3 years", tuitionFee: "", description: "Study disease prevention, health promotion, epidemiology, and population health strategies." },
  { title: "BSc Biomedical Science", university: "University of Manchester", country: "United Kingdom", countryFlag: "🇬🇧", level: "Undergraduate", duration: "3 years", tuitionFee: "", description: "Explore human biology, disease mechanisms, and laboratory science at a research-intensive university." },
  { title: "BSc Pharmacy", university: "University of Nottingham", country: "United Kingdom", countryFlag: "🇬🇧", level: "Undergraduate", duration: "4 years", tuitionFee: "", description: "Train to become a pharmacist with a programme covering pharmacology, medicinal chemistry, and clinical practice." },
  { title: "BSc Psychology", university: "University of Exeter", country: "United Kingdom", countryFlag: "🇬🇧", level: "Undergraduate", duration: "3 years", tuitionFee: "", description: "Study human behaviour, cognition, neuroscience, and developmental psychology." },
  { title: "BSc Physiotherapy", university: "University of Birmingham", country: "United Kingdom", countryFlag: "🇬🇧", level: "Undergraduate", duration: "3 years", tuitionFee: "", description: "Learn to assess, diagnose, and treat movement disorders through evidence-based physical therapy." },

  // ===== FOUNDATION =====
  { title: "Foundation in Engineering", university: "University of Exeter", country: "United Kingdom", countryFlag: "🇬🇧", level: "Foundation", duration: "1 year", tuitionFee: "", description: "Pathway programme for students who need to meet entry requirements for engineering degrees." },
  { title: "Foundation in Business", university: "INTO Manchester", country: "United Kingdom", countryFlag: "🇬🇧", level: "Foundation", duration: "1 year", tuitionFee: "", description: "Business pathway programme with guaranteed progression to partner universities." },
  { title: "Foundation in Science", university: "University of Liverpool", country: "United Kingdom", countryFlag: "🇬🇧", level: "Foundation", duration: "1 year", tuitionFee: "", description: "Prepare for undergraduate science and healthcare programmes with core modules in biology, chemistry, and mathematics." },
  { title: "Foundation in Computing", university: "Coventry University", country: "United Kingdom", countryFlag: "🇬🇧", level: "Foundation", duration: "1 year", tuitionFee: "", description: "Entry pathway for computing and IT degrees, covering programming fundamentals and mathematics." },

  // ===== POSTGRADUATE =====
  { title: "MSc Data Science", university: "Technical University of Munich", country: "Germany", countryFlag: "🇪🇺", level: "Postgraduate", duration: "2 years", tuitionFee: "", description: "One of Europe's top data science programmes combining statistics, machine learning, and big data engineering.", featured: true },
  { title: "MSc Artificial Intelligence", university: "University of Edinburgh", country: "United Kingdom", countryFlag: "🇬🇧", level: "Postgraduate", duration: "1 year", tuitionFee: "", description: "World-leading AI programme from one of the birthplaces of artificial intelligence.", featured: true },
  { title: "MSc Computer Science", university: "University of Oxford", country: "United Kingdom", countryFlag: "🇬🇧", level: "Postgraduate", duration: "1 year", tuitionFee: "", description: "Advanced computer science at one of the world's most prestigious universities." },
  { title: "MBA", university: "University of Warwick", country: "United Kingdom", countryFlag: "🇬🇧", level: "Postgraduate", duration: "1 year", tuitionFee: "", description: "A globally ranked MBA programme developing strategic leadership and business management skills.", featured: true },
  { title: "MSc International Business", university: "University of Toronto", country: "Canada", countryFlag: "🇨🇦", level: "Postgraduate", duration: "2 years", tuitionFee: "", description: "Develop global business acumen with this internationally recognised programme." },
  { title: "MSc Project Management", university: "University of Manchester", country: "United Kingdom", countryFlag: "🇬🇧", level: "Postgraduate", duration: "1 year", tuitionFee: "", description: "Master the tools and techniques of project planning, risk management, and stakeholder engagement." },
  { title: "MSc Public Health", university: "London School of Hygiene & Tropical Medicine", country: "United Kingdom", countryFlag: "🇬🇧", level: "Postgraduate", duration: "1 year", tuitionFee: "", description: "A world-renowned public health programme covering epidemiology, health policy, and global health challenges." },
  { title: "MSc Global Healthcare Management", university: "University College London", country: "United Kingdom", countryFlag: "🇬🇧", level: "Postgraduate", duration: "1 year", tuitionFee: "", description: "Combine healthcare leadership with management skills to improve health systems worldwide." },
  { title: "MSc Strategic Digital Marketing", university: "University of Glasgow", country: "United Kingdom", countryFlag: "🇬🇧", level: "Postgraduate", duration: "1 year", tuitionFee: "", description: "Learn digital strategy, social media marketing, analytics, and consumer engagement in the digital age." },
  { title: "LLM International Law", university: "University of Cambridge", country: "United Kingdom", countryFlag: "🇬🇧", level: "Postgraduate", duration: "1 year", tuitionFee: "", description: "Advanced study of international law, human rights, and global legal systems at a world-leading institution." },
  { title: "MSc Cybersecurity", university: "University of Bristol", country: "United Kingdom", countryFlag: "🇬🇧", level: "Postgraduate", duration: "1 year", tuitionFee: "", description: "Advanced study of information security, cryptographic systems, and cyber threat intelligence." },
  { title: "MSc Nursing", university: "University of Manchester", country: "United Kingdom", countryFlag: "🇬🇧", level: "Postgraduate", duration: "2 years", tuitionFee: "", description: "Advanced nursing practice programme for registered nurses seeking leadership and specialist clinical roles." },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Remove all existing courses and replace with new list
    await Course.deleteMany({});
    console.log("Cleared existing courses");

    await Course.insertMany(courses);
    console.log(`Seeded ${courses.length} courses`);

    console.log("\nBreakdown:");
    const levels = ["Foundation", "Undergraduate", "Postgraduate"];
    for (const level of levels) {
      const count = courses.filter(c => c.level === level).length;
      console.log(`  ${level}: ${count}`);
    }

    console.log("\nSeed complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seed();
