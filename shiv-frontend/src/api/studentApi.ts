import API_URL, { getHeaders } from './config';

export interface ResearchInternship {
  _id: string;
  title: string;
  description: string;
  professor: { _id: string; name: string };
  duration: string;
  stipend: string;
  requiredSkills: string[];
  deadline: string;
  applicants?: number;
  status?: 'Open' | 'Closed';
  postedBy?: 'Professor';
}

export const fetchResearchInternships = async (user?: { id: string; role: string }): Promise<ResearchInternship[]> => {
  const res = await fetch(`${API_URL}/research`, { headers: getHeaders(user) });
  if (!res.ok) throw new Error('Failed to fetch research internships');
  return res.json();
};

// For now, we'll just have this one endpoint.
// In a real app, you'd also have endpoints for company internships.