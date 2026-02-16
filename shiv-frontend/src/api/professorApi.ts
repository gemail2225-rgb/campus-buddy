import API_URL, { getHeaders } from './config';

// ==================== Types ====================

export interface Course {
  _id: string;
  courseCode: string;
  courseName: string;
  semester: string;
  credits: number;
  professor: { _id: string; name: string };
  students: Array<{ _id: string; name: string; email: string }>;
  attendance: number;
  grade?: string;
  createdAt: string;
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  course: { _id: string; courseCode: string; courseName: string };
  dueDate: string;
  totalMarks: number;
  submissions: Array<{
    student: { _id: string; name: string };
    submittedAt: string;
    fileUrl?: string;
    marks?: number;
    feedback?: string;
  }>;
  createdAt: string;
}

// Input type for creating an assignment (course is just the ID)
export interface CreateAssignmentInput {
  title: string;
  description?: string;
  course: string; // course ID
  dueDate: string;
  totalMarks?: number;
}

export interface StudyMaterial {
  _id: string;
  title: string;
  description?: string;
  course: { _id: string; courseCode: string; courseName: string };
  fileUrl: string;
  uploadedBy: { _id: string; name: string };
  createdAt: string;
}

export interface ResearchInternship {
  _id: string;
  title: string;
  description: string;
  professor: { _id: string; name: string };
  duration: string;
  stipend: string;
  requiredSkills: string[];
  deadline: string;
  applicants: Array<{
    student: { _id: string; name: string };
    appliedAt: string;
    status: 'pending' | 'accepted' | 'rejected';
  }>;
  createdAt: string;
}

// ==================== Courses ====================

export const fetchCourses = async (user?: { id: string; role: string }): Promise<Course[]> => {
  const res = await fetch(`${API_URL}/courses`, { headers: getHeaders(user) });
  if (!res.ok) throw new Error('Failed to fetch courses');
  return res.json();
};

export const createCourse = async (data: Partial<Course>): Promise<Course> => {
  const res = await fetch(`${API_URL}/courses`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create course');
  return res.json();
};

export const updateCourse = async (id: string, data: Partial<Course>): Promise<Course> => {
  const res = await fetch(`${API_URL}/courses/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update course');
  return res.json();
};

export const deleteCourse = async (id: string): Promise<{ msg: string }> => {
  const res = await fetch(`${API_URL}/courses/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete course');
  return res.json();
};

// ==================== Assignments ====================

export const fetchAssignments = async (user?: { id: string; role: string }): Promise<Assignment[]> => {
  const res = await fetch(`${API_URL}/assignments`, { headers: getHeaders(user) });
  if (!res.ok) throw new Error('Failed to fetch assignments');
  return res.json();
};

// Updated to accept CreateAssignmentInput
export const createAssignment = async (data: CreateAssignmentInput): Promise<Assignment> => {
  const res = await fetch(`${API_URL}/assignments`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create assignment');
  return res.json();
};

export const updateAssignment = async (id: string, data: Partial<Assignment>): Promise<Assignment> => {
  const res = await fetch(`${API_URL}/assignments/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update assignment');
  return res.json();
};

export const deleteAssignment = async (id: string): Promise<{ msg: string }> => {
  const res = await fetch(`${API_URL}/assignments/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete assignment');
  return res.json();
};

// ==================== Study Materials ====================

export const fetchStudyMaterials = async (user?: { id: string; role: string }): Promise<StudyMaterial[]> => {
  const res = await fetch(`${API_URL}/study-materials`, { headers: getHeaders(user) });
  if (!res.ok) throw new Error('Failed to fetch study materials');
  return res.json();
};

export const createStudyMaterial = async (data: Partial<StudyMaterial>): Promise<StudyMaterial> => {
  const res = await fetch(`${API_URL}/study-materials`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create study material');
  return res.json();
};

export const deleteStudyMaterial = async (id: string): Promise<{ msg: string }> => {
  const res = await fetch(`${API_URL}/study-materials/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete study material');
  return res.json();
};

// ==================== Research Internships ====================

export const fetchResearchInternships = async (user?: { id: string; role: string }): Promise<ResearchInternship[]> => {
  const res = await fetch(`${API_URL}/research`, { headers: getHeaders(user) });
  if (!res.ok) throw new Error('Failed to fetch research internships');
  return res.json();
};

export const createResearchInternship = async (data: Partial<ResearchInternship>): Promise<ResearchInternship> => {
  const res = await fetch(`${API_URL}/research`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create research internship');
  return res.json();
};

export const updateResearchInternship = async (id: string, data: Partial<ResearchInternship>): Promise<ResearchInternship> => {
  const res = await fetch(`${API_URL}/research/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update research internship');
  return res.json();
};

export const deleteResearchInternship = async (id: string): Promise<{ msg: string }> => {
  const res = await fetch(`${API_URL}/research/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete research internship');
  return res.json();
};

export const fetchApplicants = async (id: string) => {
  const res = await fetch(`${API_URL}/research/${id}/applicants`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch applicants');
  return res.json();
};

export const updateApplicantStatus = async (researchId: string, applicantId: string, status: 'accepted' | 'rejected') => {
  const res = await fetch(`${API_URL}/research/${researchId}/applicants/${applicantId}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update applicant status');
  return res.json();
};