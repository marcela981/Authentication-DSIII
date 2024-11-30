import axios from 'axios';
import { getAuth } from 'firebase/auth';

const API_URL = 'http://localhost:5000/api/auth'; // Asegúrate de que la URL sea correcta

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/authenticate`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const register = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

const fetchProtectedData = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user) {
      const idToken = await user.getIdToken();
  
      const response = await axios.post(
        'http://localhost:5000/api/protected-endpoint',
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
  
      console.log(response.data);
    } else {
      console.log('No user is authenticated');
    }
  };