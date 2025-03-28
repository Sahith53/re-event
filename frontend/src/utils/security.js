import Cookies from 'js-cookie';

export const getToken = () => {
    return Cookies.get('user');
};

export const setToken = (token) => {
    Cookies.set('user', token, { expires: 7 }); // Token expires in 7 days
};

export const removeToken = () => {
    Cookies.remove('user');
};

export const isAuthenticated = () => {
    return !!getToken();
};

export const handleLogout = () => {
    removeToken();
    window.location.href = '/';
}; 