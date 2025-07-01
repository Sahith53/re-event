export const API_BASE_URL = 'http://localhost:3000' || 'https://re-event-1.onrender.com';

export const API_ENDPOINTS = {
    // Auth endpoints
    SEND_OTP: `${API_BASE_URL}/login/send-otp`,
    VERIFY_OTP: `${API_BASE_URL}/login/verify-otp`,
    GET_USER: `${API_BASE_URL}/login/me2`,
    SET_USERNAME: `${API_BASE_URL}/login/setusername`,

    // Event endpoints
    GET_ALL_EVENTS: `${API_BASE_URL}/events/getevents`,
    GET_EVENT_BY_ID: (id) => `${API_BASE_URL}/events/geteventbyid/${id}`,
    GET_EVENTS_BY_USER: (email) => `${API_BASE_URL}/events/geteventsbyuserid/${email}`,
    CREATE_EVENT: `${API_BASE_URL}/events/newevent`,
    ADD_EVENT_TO_CREATOR: `${API_BASE_URL}/events/addeventtocreatoruser`,
    EDIT_EVENT: (id) => `${API_BASE_URL}/events/editevent/${id}`,
    DELETE_EVENT: (id) => `${API_BASE_URL}/events/deleteevent/${id}`,
    CHECK_USER_EVENT: (eventId, userId) => `${API_BASE_URL}/events/checkuserev/${eventId}/${userId}`,
    ADD_USER_TO_EVENT: (id) => `${API_BASE_URL}/events/neweventAddUser/${id}`,
    TRACK_EVENT_VIEW: `${API_BASE_URL}/events/trackEventPageView/`,

    // Questions endpoints
    GET_QUESTIONS: (id) => `${API_BASE_URL}/events/geteventbyid/${id}`,
    EDIT_QUESTIONS: (id) => `${API_BASE_URL}/events/editquestionsforevent/${id}`,
    ADD_QUESTIONS: (id) => `${API_BASE_URL}/events/addquestionstoevent/${id}`,

    // Host endpoints
    ADD_NEW_EVENT_TO_HOST: `${API_BASE_URL}/events/addneweventtohost`,
    ADD_NEW_HOST_TO_EVENT: `${API_BASE_URL}/addnewhostotevent`,

    // Check-in endpoints
    QR_SCAN: (id) => `${API_BASE_URL}/events/qrscancall/${id}`,
    GET_CHECKIN_USERS: (id) => `${API_BASE_URL}/events/getcheckinusers/${id}`,
};

export const GOOGLE_MAPS_API = {
    GEOCODING: (lat, lng, key) => `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`,
    STATIC_MAP: (lat, lng, key) => `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=300x150&markers=${lat},${lng}&key=${key}`,
    PLACES: (key) => `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`,
}; 