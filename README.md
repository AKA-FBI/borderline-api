# Borderline Innovations — Backend API

## Quick Start

### 1. Set up MongoDB Atlas (free)
1. Go to https://cloud.mongodb.com and create an account
2. Create a free cluster (M0 Sandbox)
3. Go to **Database Access** → Add a database user (save the password)
4. Go to **Network Access** → Add IP `0.0.0.0/0` (allow from anywhere)
5. Go to **Clusters** → Connect → Drivers → Copy the connection string

### 2. Configure environment
```bash
cd backend
cp .env.example .env
```
Edit `.env` and fill in:
- `MONGODB_URI` — paste your Atlas connection string (replace `<password>`)
- `JWT_SECRET` — any random string (e.g. `mySecretKey123!@#`)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — your admin login credentials
- SMTP settings (optional, for email notifications)

### 3. Install and run
```bash
npm install
npm run seed    # Creates admin user + sample data
npm run dev     # Starts server on port 5000
```

### 4. Test it
Open http://localhost:5000/api/health — should return `{"status":"ok"}`

---

## API Endpoints

### Public (no auth required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/enquiries` | Submit enquiry form |
| GET | `/api/courses` | List courses (?level=Undergraduate&search=computing) |
| GET | `/api/courses/:id` | Get single course |
| GET | `/api/events` | List upcoming events |
| GET | `/api/events/:id` | Get single event |
| GET | `/api/blog` | List published posts (?category=Tips&search=visa) |
| GET | `/api/blog/:slug` | Get single post |
| POST | `/api/newsletter/subscribe` | Subscribe to newsletter |
| POST | `/api/newsletter/unsubscribe` | Unsubscribe |

### Admin (requires Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login → returns JWT token |
| GET | `/api/auth/me` | Get admin profile |
| GET | `/api/dashboard` | Dashboard stats overview |
| GET | `/api/enquiries` | List all enquiries (?status=new) |
| PUT | `/api/enquiries/:id` | Update enquiry status/notes |
| DELETE | `/api/enquiries/:id` | Delete enquiry |
| POST | `/api/courses` | Create course |
| GET | `/api/courses/all` | List all courses (inc. inactive) |
| PUT | `/api/courses/:id` | Update course |
| DELETE | `/api/courses/:id` | Delete course |
| POST | `/api/events` | Create event |
| GET | `/api/events/all` | List all events |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event |
| POST | `/api/blog` | Create blog post |
| GET | `/api/blog/all` | List all posts (inc. drafts) |
| PUT | `/api/blog/:id` | Update post |
| DELETE | `/api/blog/:id` | Delete post |
| GET | `/api/newsletter/subscribers` | List subscribers |

### Authentication
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@borderlineinnovations.com","password":"changeme123"}'

# Use the returned token for admin routes
curl http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Project Structure
```
backend/
  server.js           — Express server + dashboard route
  seed.js             — Database seeder (run once)
  .env.example        — Environment template
  config/
    db.js             — MongoDB connection
    email.js          — Email notifications (Nodemailer)
  middleware/
    auth.js           — JWT authentication
  models/
    Admin.js          — Admin users
    Enquiry.js        — Student enquiries
    Course.js         — University courses
    Event.js          — Events & workshops
    BlogPost.js       — Blog articles
    Subscriber.js     — Newsletter subscribers
  routes/
    auth.js           — Login / profile
    enquiries.js      — Enquiry CRUD
    courses.js        — Course CRUD
    events.js         — Event CRUD
    blog.js           — Blog CRUD
    newsletter.js     — Subscribe / unsubscribe
```
