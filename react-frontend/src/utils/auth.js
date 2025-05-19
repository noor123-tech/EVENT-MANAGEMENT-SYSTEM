export const getToken = () => localStorage.getItem('token');

export const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});
