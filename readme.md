#  Digital Marketing Portfolio (Full Stack)

A full-stack Digital Marketing Portfolio platform where admins can manage and showcase their work, industries served, testimonials, videos, and creative posts — all stored securely using AWS S3 and powered by a modern MERN-style architecture with Next.js frontend and Node.js + Express backend.

---

##  Features

###  Admin Dashboard
- Add / update / delete Industries
- Manage Testimonials
- Upload and manage Work Videos
- Create and manage Posts
- Secure admin-only access

###  Public Portfolio
- View industries served
- Browse marketing work & videos
- Explore client testimonials
- Clean, responsive UI for all devices

###  Media Handling
- Image & video uploads stored on AWS S3
- Optimized media delivery
- Secure file handling

---

##  Tech Stack

**Frontend**
- Next.js (App Router)
- Tailwind CSS
- React Context API
- React Hot Toast

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication

**Storage & Cloud**
- AWS S3 (Media Storage)

---

##  Modules

- Industries Management
- Testimonials System
- Video Portfolio Section
- Posts / Content Management
- Admin Panel

---

##  Authentication

- Admin login protected via JWT
- Role-based access control
- Secure API endpoints

---

##  Media Flow

1. Admin uploads image/video
2. File is stored in AWS S3
3. URL + metadata saved in MongoDB
4. Frontend fetches and displays content dynamically

---

## Installation

```bash
# Clone repo
git clone https://github.com/aquib-11/creative-agency-portfolio.git

# Install frontend
cd frontend
npm install


# Install backend
cd backend
npm install
npm run dev
```