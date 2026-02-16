import { Grievance, Internship, LostFoundItem, Course, Notification, Assignment, StudyMaterial, User } from "@/types/role";

// Mock Users for authentication
export const users: User[] = [
  {
    id: "507f1f77bcf86cd799439011",
    name: "Rahul Sharma",
    email: "rahul.sharma@campus.edu",
    role: "student",
    avatar: "RS",
    department: "Computer Science",
    year: "3rd Year",
    rollNo: "CS21001",
    hostel: "Hostel A, Room 204"
  },
  {
    id: "507f1f77bcf86cd799439012",
    name: "Prof. Anjali Verma",
    email: "anjali.verma@campus.edu",
    role: "professor",
    avatar: "AV",
    department: "Computer Science",
    designation: "Associate Professor",
    areas: ["Algorithms", "Data Structures"]
  },
  {
    id: "507f1f77bcf86cd799439013",
    name: "Arjun Singh",
    email: "arjun.singh@campus.edu",
    role: "club",
    avatar: "AS",
    club: "Programming Club",
    position: "Coordinator"
  },
  {
    id: "507f1f77bcf86cd799439014",
    name: "Admin User",
    email: "admin@campus.edu",
    role: "admin",
    avatar: "AU",
    department: "Administration"
  }
];

// Grievances with realistic data and proper categorization
export const initialGrievances: Grievance[] = [
  {
    id: "g1",
    title: "Water leakage in Hostel Block A, Room 204",
    description: "Continuous water leakage from ceiling near bathroom. Already reported twice but no action taken.",
    category: "Hostel",
    subCategory: "Maintenance",
    priority: "High",
    status: "In Progress",
    lastUpdated: "2026-02-12",
    createdBy: "Rahul Sharma",
    assignedTo: "Hostel Warden",
    updates: [
      { id: "u1", text: "Grievance submitted", timestamp: "2026-02-10 09:30", by: "Student" },
      { id: "u2", text: "Assigned to maintenance team", timestamp: "2026-02-11 10:15", by: "Authority" },
      { id: "u3", text: "Plumber scheduled for tomorrow", timestamp: "2026-02-12 14:20", by: "Maintenance" },
    ],
  },
  {
    id: "g2",
    title: "Mess food quality - Stale rotis served",
    description: "Rotis served during dinner were stale and undercooked. Several students fell ill.",
    category: "Mess",
    subCategory: "Food Quality",
    priority: "Critical",
    status: "In Review",
    lastUpdated: "2026-02-11",
    createdBy: "Priya Patel",
    assignedTo: "Mess Committee",
    updates: [
      { id: "u4", text: "Grievance submitted", timestamp: "2026-02-09 20:15", by: "Student" },
      { id: "u5", text: "Under investigation by mess committee", timestamp: "2026-02-10 11:30", by: "Authority" },
      { id: "u6", text: "Meeting called with catering vendor", timestamp: "2026-02-11 09:45", by: "Mess Committee" },
    ],
  },
  {
    id: "g3",
    title: "Broken projector in LH-3 (CS Department)",
    description: "The projector in Lecture Hall 3 is not working since last week. Affecting CS301 classes.",
    category: "Infrastructure",
    subCategory: "Equipment",
    priority: "Medium",
    status: "Resolved",
    lastUpdated: "2026-02-09",
    createdBy: "Prof. Anjali Verma",
    assignedTo: "IT Department",
    updates: [
      { id: "u7", text: "Grievance submitted", timestamp: "2026-02-05 10:00", by: "Professor" },
      { id: "u8", text: "Technician assigned", timestamp: "2026-02-06 09:30", by: "IT Dept" },
      { id: "u9", text: "Projector bulb replaced", timestamp: "2026-02-08 15:20", by: "Technician" },
      { id: "u10", text: "Resolved - Working properly", timestamp: "2026-02-09 11:00", by: "Professor" },
    ],
  },
  {
    id: "g4",
    title: "Club registration portal not working",
    description: "Unable to register for Coding Club events through the portal. Getting 404 error.",
    category: "Club",
    subCategory: "Technical",
    priority: "High",
    status: "In Progress",
    lastUpdated: "2026-02-13",
    createdBy: "Arjun Singh",
    assignedTo: "IT Team",
    updates: [
      { id: "u11", text: "Grievance submitted", timestamp: "2026-02-12 16:30", by: "Club Coordinator" },
      { id: "u12", text: "IT team investigating", timestamp: "2026-02-13 10:15", by: "Authority" },
    ],
  },
  {
    id: "g5",
    title: "Library fine discrepancy",
    description: "Library showing fine of ₹500 for book returned on time. Receipt attached.",
    category: "Academics",
    subCategory: "Library",
    priority: "Medium",
    status: "Pending",
    lastUpdated: "2026-02-13",
    createdBy: "Neha Gupta",
    assignedTo: "Library Staff",
    updates: [
      { id: "u13", text: "Grievance submitted", timestamp: "2026-02-13 14:20", by: "Student" },
    ],
  },
];

// Internships with professor-posted opportunities
export const initialInternships: Internship[] = [
  // Company Internships
  { 
    id: "i1", 
    title: "Software Development Intern", 
    company: "Google", 
    type: "Remote", 
    deadline: "2026-03-15", 
    status: "Open",
    postedBy: "Company",
    stipend: "₹50,000/month",
    duration: "3 months",
    skills: ["React", "Node.js", "TypeScript"],
    applicants: 45
  },
  { 
    id: "i2", 
    title: "Data Science Intern", 
    company: "Microsoft", 
    type: "On-site", 
    deadline: "2026-02-20", 
    status: "Deadline Soon",
    postedBy: "Company",
    stipend: "₹60,000/month",
    duration: "2 months",
    skills: ["Python", "ML", "SQL"],
    applicants: 78
  },
  { 
    id: "i3", 
    title: "UI/UX Design Intern", 
    company: "Adobe", 
    type: "Hybrid", 
    deadline: "2026-01-30", 
    status: "Closed",
    postedBy: "Company",
    stipend: "₹45,000/month",
    duration: "3 months",
    skills: ["Figma", "Adobe XD", "UI Design"],
    applicants: 92
  },
  
  // Professor Research Internships
  { 
    id: "i4", 
    title: "ML Research Assistant", 
    company: "AI Lab", 
    type: "Research", 
    deadline: "2026-04-01", 
    status: "Open",
    postedBy: "Professor",
    professor: "Dr. Sharma",
    stipend: "₹15,000/month",
    duration: "6 months",
    skills: ["Python", "PyTorch", "Research"],
    applicants: 12
  },
  { 
    id: "i5", 
    title: "Quantum Computing Research", 
    company: "Physics Dept", 
    type: "Research", 
    deadline: "2026-02-28", 
    status: "Deadline Soon",
    postedBy: "Professor",
    professor: "Dr. Verma",
    stipend: "₹12,000/month",
    duration: "4 months",
    skills: ["Quantum Mechanics", "Python"],
    applicants: 8
  },
  { 
    id: "i6", 
    title: "NLP Research Assistant", 
    company: "CSE Dept", 
    type: "Research", 
    deadline: "2026-03-10", 
    status: "Open",
    postedBy: "Professor",
    professor: "Dr. Gupta",
    stipend: "₹15,000/month",
    duration: "5 months",
    skills: ["NLP", "Python", "Transformers"],
    applicants: 15
  },
  
  // Club/Organizer Opportunities
  { 
    id: "i7", 
    title: "Coding Club - Teaching Assistant", 
    company: "Programming Club", 
    type: "Club", 
    deadline: "2026-03-05", 
    status: "Open",
    postedBy: "Club",
    club: "Programming Club",
    stipend: "Unpaid (Certificate)",
    duration: "Semester",
    skills: ["DSA", "Teaching"],
    applicants: 23
  },
  { 
    id: "i8", 
    title: "Robotics Workshop Coordinator", 
    company: "Robotics Club", 
    type: "Club", 
    deadline: "2026-02-25", 
    status: "Deadline Soon",
    postedBy: "Club",
    club: "Robotics Club",
    stipend: "Honorarium",
    duration: "2 months",
    skills: ["Robotics", "Event Management"],
    applicants: 7
  },
];

// Lost & Found Items with realistic data
export const initialLostFound: LostFoundItem[] = [
  { 
    id: "lf1", 
    title: "Blue Nike Backpack", 
    description: "Lost near Central Library. Has a laptop sleeve and water bottle pocket.", 
    type: "Lost", 
    location: "Central Library Entrance", 
    contact: "rahul.sharma@campus.edu", 
    status: "Lost", 
    postedBy: "current-user",
    date: "2026-02-10",
    image: "🎒"
  },
  { 
    id: "lf2", 
    title: "Student ID Card - CS21045", 
    description: "Found in Main Cafeteria near the juice counter.", 
    type: "Found", 
    location: "Main Cafeteria", 
    contact: "lostfound@campus.edu", 
    status: "Found", 
    postedBy: "other",
    date: "2026-02-12",
    image: "🆔"
  },
  { 
    id: "lf3", 
    title: "TI-84 Calculator", 
    description: "Found after Mathematics exam in Exam Hall B. Left on desk.", 
    type: "Found", 
    location: "Exam Hall B", 
    contact: "math.dept@campus.edu", 
    status: "Resolved", 
    postedBy: "other",
    date: "2026-02-08",
    image: "🧮"
  },
  { 
    id: "lf4", 
    title: "Water Bottle - Milton", 
    description: "Lost in Sports Complex after basketball practice.", 
    type: "Lost", 
    location: "Sports Complex", 
    contact: "arjun.singh@campus.edu", 
    status: "Lost", 
    postedBy: "current-user",
    date: "2026-02-13",
    image: "💧"
  },
  { 
    id: "lf5", 
    title: "iPhone Charger", 
    description: "Found in LH-3, left near projector setup.", 
    type: "Found", 
    location: "Lecture Hall 3", 
    contact: "cse.office@campus.edu", 
    status: "Found", 
    postedBy: "other",
    date: "2026-02-11",
    image: "🔌"
  },
];

// Courses with professors and materials
export const courses: Course[] = [
  { 
    id: "c1", 
    name: "Data Structures", 
    code: "CS201", 
    professor: "Dr. Anjali Verma",
    attendance: 92, 
    grade: "A", 
    credits: 4,
    schedule: "Mon/Wed 10-11:30 AM",
    venue: "LH-3"
  },
  { 
    id: "c2", 
    name: "Operating Systems", 
    code: "CS301", 
    professor: "Dr. Rajesh Kumar",
    attendance: 85, 
    grade: "A-", 
    credits: 4,
    schedule: "Tue/Thu 2-3:30 PM",
    venue: "LH-5"
  },
  { 
    id: "c3", 
    name: "Database Systems", 
    code: "CS302", 
    professor: "Prof. Priya Singh",
    attendance: 78, 
    grade: "B+", 
    credits: 3,
    schedule: "Mon/Wed 2-3:30 PM",
    venue: "LH-2"
  },
  { 
    id: "c4", 
    name: "Linear Algebra", 
    code: "MA201", 
    professor: "Dr. Suresh Gupta",
    attendance: 88, 
    grade: "A", 
    credits: 3,
    schedule: "Tue/Fri 10-11:30 AM",
    venue: "LH-1"
  },
  { 
    id: "c5", 
    name: "Technical Writing", 
    code: "HS101", 
    professor: "Dr. Meera Nair",
    attendance: 95, 
    grade: "A+", 
    credits: 2,
    schedule: "Thu 3-5 PM",
    venue: "LH-4"
  },
];

// Assignments with realistic deadlines
export const assignments: Assignment[] = [
  { 
    id: "a1", 
    title: "Binary Search Tree Implementation", 
    course: "CS201", 
    dueDate: "2026-03-15", 
    status: "pending", 
    priority: "high",
    totalMarks: 20,
    submittedBy: null
  },
  { 
    id: "a2", 
    title: "Algorithm Analysis Report", 
    course: "CS301", 
    dueDate: "2026-03-20", 
    status: "pending", 
    priority: "medium",
    totalMarks: 15,
    submittedBy: null
  },
  { 
    id: "a3", 
    title: "SQL Query Optimization", 
    course: "CS302", 
    dueDate: "2026-03-10", 
    status: "submitted", 
    priority: "high",
    totalMarks: 25,
    submittedBy: "Rahul Sharma",
    submittedOn: "2026-03-09"
  },
  { 
    id: "a4", 
    title: "Network Topology Design", 
    course: "CS304", 
    dueDate: "2026-03-25", 
    status: "pending", 
    priority: "low",
    totalMarks: 30,
    submittedBy: null
  },
  { 
    id: "a5", 
    title: "Process Scheduling Assignment", 
    course: "CS305", 
    dueDate: "2026-03-18", 
    status: "pending", 
    priority: "medium",
    totalMarks: 20,
    submittedBy: null
  },
];

// Study Materials
export const studyMaterials: StudyMaterial[] = [
  { 
    id: "sm1", 
    title: "Binary Trees Lecture Notes", 
    course: "CS201", 
    type: "pdf", 
    uploadedBy: "Dr. Anjali Verma", 
    size: "2.4 MB",
    url: "#"
  },
  { 
    id: "sm2", 
    title: "OS Concepts - Deadlocks", 
    course: "CS301", 
    type: "video", 
    uploadedBy: "Dr. Rajesh Kumar", 
    duration: "45 mins",
    url: "#"
  },
  { 
    id: "sm3", 
    title: "SQL Cheat Sheet", 
    course: "CS302", 
    type: "link", 
    uploadedBy: "Prof. Priya Singh", 
    url: "#"
  },
  { 
    id: "sm4", 
    title: "Linear Algebra - Matrix Operations", 
    course: "MA201", 
    type: "pdf", 
    uploadedBy: "Dr. Suresh Gupta", 
    size: "1.8 MB",
    url: "#"
  },
  { 
    id: "sm5", 
    title: "Technical Writing Guide", 
    course: "HS101", 
    type: "pdf", 
    uploadedBy: "Dr. Meera Nair", 
    size: "3.1 MB",
    url: "#"
  },
  { 
    id: "sm6", 
    title: "Algorithm Visualization", 
    course: "CS201", 
    type: "link", 
    uploadedBy: "Dr. Anjali Verma", 
    url: "#"
  },
];

// Notifications with realistic messages
export const notifications: Notification[] = [
  { 
    id: "n1", 
    message: "Your water leakage grievance has been assigned to maintenance team", 
    type: "grievance", 
    read: false, 
    timestamp: "2 hours ago",
    link: "/grievances/g1"
  },
  { 
    id: "n2", 
    message: "New ML Research Assistant position posted by Prof. Sharma", 
    type: "internship", 
    read: false, 
    timestamp: "5 hours ago",
    link: "/internships/i4"
  },
  { 
    id: "n3", 
    message: "Maintenance commented on your grievance: 'Plumber scheduled tomorrow'", 
    type: "comment", 
    read: true, 
    timestamp: "1 day ago",
    link: "/grievances/g1"
  },
  { 
    id: "n4", 
    message: "Your broken projector grievance has been resolved", 
    type: "grievance", 
    read: true, 
    timestamp: "2 days ago",
    link: "/grievances/g3"
  },
  { 
    id: "n5", 
    message: "Coding Club TA position deadline approaching", 
    type: "internship", 
    read: false, 
    timestamp: "1 day ago",
    link: "/internships/i7"
  },
  { 
    id: "n6", 
    message: "New lost item reported: iPhone Charger in LH-3", 
    type: "lostfound", 
    read: false, 
    timestamp: "3 hours ago",
    link: "/lost-found/lf5"
  },
];

// Analytics Data
export const analyticsData = {
  grievancesByMonth: [
    { month: "Jan", count: 12 },
    { month: "Feb", count: 19 },
    { month: "Mar", count: 15 },
    { month: "Apr", count: 22 },
    { month: "May", count: 18 },
    { month: "Jun", count: 24 },
  ],
  grievancesByCategory: [
    { name: "Hostel", value: 35 },
    { name: "Academics", value: 25 },
    { name: "Mess", value: 20 },
    { name: "Infrastructure", value: 15 },
    { name: "Club", value: 5 },
  ],
  resolutionRate: 78,
  avgResponseTime: "2.4 days",
  activeUsers: 1250,
  totalGrievances: 145,
  resolvedGrievances: 113,
  pendingGrievances: 32,
};

// Club Events
export const clubEvents = [
  {
    id: "e1",
    title: "Hackathon 2026",
    club: "Programming Club",
    date: "2026-03-20",
    venue: "CS Department",
    description: "24-hour coding competition with prizes worth ₹50k",
    registered: 45
  },
  {
    id: "e2",
    title: "Robotics Workshop",
    club: "Robotics Club",
    date: "2026-03-15",
    venue: "Innovation Lab",
    description: "Learn to build and program Arduino robots",
    registered: 28
  },
];

// Export everything as default as well (optional)
export default {
  users,
  initialGrievances,
  initialInternships,
  initialLostFound,
  courses,
  assignments,
  studyMaterials,
  notifications,
  analyticsData,
  clubEvents
};