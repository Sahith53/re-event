// export const API_URL = 'http://localhost:3000';

export const API_URL = import.meta.env.PROD 
  ? 'https://re-event-1.onrender.com' 
  : 'http://localhost:3000';