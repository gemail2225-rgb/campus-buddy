const API_URL = 'http://localhost:5000/api';

export const MOCK_USER = {
  id: '6991cc6e86d1e861f5cc426e', // your professor ID
  role: 'professor',
};

export const getHeaders = (user?: { id: string; role: string }) => {
  const currentUser = user || MOCK_USER;
  return {
    'Content-Type': 'application/json',
    'x-user-id': currentUser.id,
    'x-user-role': currentUser.role,
  };
};

export default API_URL;