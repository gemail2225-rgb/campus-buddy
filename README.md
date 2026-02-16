# Campus Buddy 🎓

Campus Buddy is a **unified campus management platform** built to streamline academic life for students, professors, club organizers, and administrators. It provides a centralized hub for courses, events, research opportunities, grievances, and lost & found – all in one place.

This project was developed as a full-stack monorepo with a React + TypeScript frontend and a Node.js + Express + MongoDB backend.

## ✨ Key Features

Campus Buddy offers role-based dashboards and functionalities for four distinct user types:

### 👨‍🎓 Student
- **Academic Dashboard**: View registered courses, track GPA, attendance, and grades.
- **Assignments & Materials**: See pending assignments and download study materials uploaded by professors.
- **Events**: Discover and register for campus events hosted by clubs.
- **Internships**: Browse and apply for research internships posted by professors.
- **Grievances**: Submit and track the status of campus-related issues.
- **Lost & Found**: Post lost items or report found belongings.
- **Announcements**: Stay updated with announcements from clubs and admin.
- **extra feature **:live bus tracking seat updation full working mode must check login to student in dashboard go to bus icon then click on open it will open section with two option student and driver where student had to login via student then go to bus select they see live seat updation bus location live all this data is updated via drivers mobile 

### 👨‍🏫 Professor
- **Professor Dashboard**: Overview of courses taught, student performance metrics, and quick access to class management.
- **Course Management**: View a list of your courses with student enrollment and average attendance.
- **Assignment Management**: Create, edit, and review assignments for your courses. View submission status.
- **Study Materials**: Upload and manage course notes, presentations, and resources for students.
- **Research Internships**: Post and manage research opportunities. Review and manage student applicants.

### 🎉 Club Organizer
- **Club Dashboard**: Key metrics for your club, including event registrations and announcements.
- **Event Management**: Create, edit, and delete club events. View and manage event registrations.
- **Announcement Management**: Post, pin, and manage announcements for the campus community.

### 🛠️ Administrator
- **Platform Overview**: High-level analytics including total users, grievance resolution rates, and activity summaries.
- **User Management**: View, edit, and suspend user accounts across all roles.
- **Content Moderation**: Oversee and manage all internships, grievances, and lost & found posts.
- **Platform Analytics**: Visual charts for grievances by category and lost/found item statistics.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling & UI**:
  - [Tailwind CSS](https://tailwindcss.com/)
  - [shadcn/ui](https://ui.shadcn.com/) (component library)
  - [Lucide React](https://lucide.netlify.app/) (icons)
- **State Management**: React Context API
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **HTTP Client**: Native `fetch` API

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ODM
- **Authentication**: Mock authentication using request headers (`x-user-id`, `x-user-role`) for development.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, or a MongoDB Atlas connection string.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/gemail2225-rgb/campus-buddy.git
    cd campus-buddy
    ```

2.  **Set up the Backend**
    ```bash
    cd om-backend
    npm install
    ```
    - Create a `.env` file in the `om-backend` directory and add your MongoDB connection string:
      ```
      MONGO_URI=mongodb://localhost:27017/campusbuddy
      PORT=5000
      ```
    - Seed the database with initial mock data:
      ```bash
      npm run seed
      ```
    - Start the backend server:
      ```bash
      npm run dev
      ```
    The server will run on `http://localhost:5000`.

3.  **Set up the Frontend**
    Open a new terminal.
    ```bash
    cd shiv-frontend
    npm install
    npm run dev
    ```
    The frontend development server will start, usually on `http://localhost:5173`.

## 🧪 Testing the Application

Since the project uses mock authentication, you can test different user roles by changing the `MOCK_USER` object in `shiv-frontend/src/api/config.ts`.

1.  Obtain the user IDs from your seeded database. You can use the provided `getUserId.js` script or similar methods (e.g., `node -e "require('./models/User.js').findOne({email:'arjun@club.com'}).then(u => console.log(u._id))"` from the `om-backend` directory).
2.  In `config.ts`, update the `id` and `role` for the desired user:
    ```typescript
    export const MOCK_USER = {
      id: 'PASTE_THE_USER_ID_HERE',
      role: 'student', // or 'professor', 'club', 'admin'
    };
    ```
3.  Restart the frontend and navigate through the application to test features specific to that role.

4.  for login data are as follow:
         
       student - rahul.sharma@campus.edu  pass-any
    
       club    - arjun.singh@campus.edu
    
       profesor- anjali.verma@campus.edu
    
       admin   - admin@campus.edu


## 📁 Project Structure
campus-buddy/
│
├── frontend/ 

├── backend/ 

├── database/ # Database configuration

├── public/ # Static files

├── .env.example # Sample environment variables

└── README.md



---




