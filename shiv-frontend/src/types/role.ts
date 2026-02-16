// Role types - 4 distinct roles
export type Role = "student" | "professor" | "club" | "admin";

// User interface for authentication
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  
  // Student specific
  department?: string;
  year?: string;
  rollNo?: string;
  hostel?: string;
  
  // Professor specific
  designation?: string;
  areas?: string[];
  
  // Club specific
  club?: string;
  position?: string;
  
  // Admin specific
  adminLevel?: string;
}

// Grievance types
export type GrievanceCategory = "Hostel" | "Academics" | "Mess" | "Infrastructure" | "Club";
export type GrievanceStatus = "Pending" | "In Review" | "In Progress" | "Resolved";
export type GrievancePriority = "Low" | "Medium" | "High" | "Critical";

export interface GrievanceUpdate {
  id: string;
  text: string;
  timestamp: string;
  by: string;
}

export interface Grievance {
  id: string;
  title: string;
  description: string;
  category: GrievanceCategory;
  subCategory?: string;
  priority: GrievancePriority;
  status: GrievanceStatus;
  lastUpdated: string;
  createdBy: string;
  assignedTo?: string;
  updates: GrievanceUpdate[];
}

// Internship types
export type InternshipType = "Company" | "Research" | "Club";
export type InternshipStatus = "Open" | "Deadline Soon" | "Closed";

export interface Internship {
  id: string;
  title: string;
  company: string;
  type: string;
  deadline: string;
  status: InternshipStatus;
  postedBy: "Company" | "Professor" | "Club";
  professor?: string;
  club?: string;
  stipend?: string;
  duration?: string;
  skills?: string[];
  applicants?: number;
  applied?: boolean;
}

// Lost & Found types
export interface LostFoundItem {
  id: string;
  title: string;
  description: string;
  type: "Lost" | "Found";
  location: string;
  contact: string;
  image?: string;
  status: "Lost" | "Found" | "Resolved";
  postedBy: string;
  date: string;
}

// Course types
export interface Course {
  id: string;
  name: string;
  code: string;
  professor: string;
  attendance: number;
  grade: string;
  credits: number;
  schedule?: string;
  venue?: string;
}

// Assignment types
export interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  priority: "low" | "medium" | "high";
  totalMarks?: number;
  submittedBy?: string;
  submittedOn?: string;
}

// Study Material types
export interface StudyMaterial {
  id: string;
  title: string;
  course: string;
  type: "pdf" | "video" | "link";
  uploadedBy: string;
  size?: string;
  duration?: string;
  url: string;
}

// Club Event types
export interface ClubEvent {
  id: string;
  title: string;
  club: string;
  date: string;
  venue: string;
  description: string;
  registered: number;
  maxParticipants?: number;
}

// Notification types
export interface Notification {
  id: string;
  message: string;
  type: "grievance" | "internship" | "comment" | "lostfound";
  read: boolean;
  timestamp: string;
  link?: string;
}

// Analytics types
export interface AnalyticsData {
  grievancesByMonth: { month: string; count: number }[];
  grievancesByCategory: { name: string; value: number }[];
  resolutionRate: number;
  avgResponseTime: string;
  activeUsers: number;
  totalGrievances: number;
  resolvedGrievances: number;
  pendingGrievances: number;
}