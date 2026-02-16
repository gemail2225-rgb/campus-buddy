# Campus Buddy – Unified Campus Platform

Campus Buddy is a unified campus management platform that centralizes grievances, internships, lost & found, and academic tracking into a single dashboard.

Built as a hackathon MVP with role-based dashboards and a clean modular architecture.

---

## 🚀 Overview

Campus systems are often fragmented across multiple platforms.  
Campus Buddy integrates governance, opportunities, and student interaction into one cohesive ecosystem.

The platform supports:
- Student Dashboard
- Authority Dashboard
- Admin Dashboard

Each role has controlled access to relevant features.

---

## ✨ Core Features

### Grievance Management
- Submit grievances
- Track status (Pending / In Review / Resolved)
- Authority can update status and add comments
- Timeline view for updates

### Internship Portal
- View internship listings
- Status badges (Open / Closing Soon / Closed)
- Admin can add internships

### Lost & Found
- Post lost or found items
- Filter by type
- Mark items as resolved

### Academic Overview (Student)
- Enrolled courses
- Attendance percentage
- GPA display
- Resource links

### Admin Analytics
- Total grievances
- Resolution rate
- Grievances by category
- Lost vs Found statistics

---

## 🛠 Tech Stack

Frontend:
- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

Backend:
- Node.js
- Express

---

## 🖥 Running Locally

### 1. Clone Repository
git clone <your-repo-url>
cd krackhack

### 2. Install Dependencies
npm install

### 3. Start Development Server
npm run dev

Open in browser:
http://localhost:5173

---

## 🔐 Role Simulation

For demo purposes:
- Role switching is handled in the frontend
- Backend validates role using request header:

x-role: student | authority | admin

---

## 🎯 Purpose

Campus Buddy simplifies campus digital infrastructure by providing a single, integrated platform for governance, opportunities, and student engagement.

---

## 👥 Team

- Your Name – Role
- Member 2 – Role
- Member 3 – Role

---

Hackathon MVP – Demo Ready
