import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreateNew from "./pages/CreateNew";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "sonner";
import EventPage from "./pages/EventPage";
import EventConfrom from "./pages/EventConfrom";
import ManageEvent from "./pages/ManageEvent";
import Footer from "./components/Footer";
import Explore from "./pages/Explore";
import { CookiesProvider, useCookies } from "react-cookie";
import { useMainDashContext } from "./context/AppContext";
import Cookies from "js-cookie";
import LoginNavbar from "./components/LoginNavBar";
import Checkin from './components/Manage/Checkin/Checkin';
import axios from 'axios';
import SmallProfile from "./components/Login/SmallProfile";
import Profile from './pages/Profile';
import LogSign from './components/Login/LogSign';
import { MainDashProvider } from './context/AppContext';
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, setProfile } = useMainDashContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const hideNavbar = ['/manage/', '/create'];
  const shouldHideNavbar = hideNavbar.some((path) => location.pathname.includes(path));
  const hideFooter = ['/checkin'];
  const shouldHideFooter = hideFooter.some((path) => location.pathname.includes(path));

  useEffect(() => {
    const validateAuth = async () => {
      try {
        const cookie = Cookies.get("user");
        const token = Cookies.get("token");
        
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Validate token with backend
        const response = await axios.get(`${API_URL}/api/auth/validate-token`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.valid) {
          setIsAuthenticated(true);
          setProfile(response.data.user);
        } else {
          // Clear invalid tokens
          Cookies.remove("token");
          Cookies.remove("user");
          setIsAuthenticated(false);
          if (location.pathname !== '/login' && location.pathname !== '/') {
            toast.error("Session expired. Please login again.");
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Auth validation error:', error);
        // Clear tokens on error
        Cookies.remove("token");
        Cookies.remove("user");
        setIsAuthenticated(false);
        
        if (location.pathname !== '/login' && location.pathname !== '/') {
          if (error.response?.status === 401) {
            toast.error("Session expired. Please login again.");
          } else {
            toast.error("Authentication failed. Please login again.");
          }
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    validateAuth();
  }, [setProfile, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex flex-col">
        {isAuthenticated ? (
          <>
            {!shouldHideNavbar ? <LoginNavbar /> : <SmallProfile />}
            <Routes>
              <Route path="/create" element={<CreateNew width={"75%"} saveName={"Create Event"} mt={"15%"} />} />
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<div className="flex items-center justify-center h-full w-full">Not Found</div>} />
              <Route path="/e/:id" element={<EventPage />} />
              <Route path="/create/conform" element={<EventConfrom />} />
              <Route path="/manage/:id" element={<ManageEvent />} />
              <Route path="/e/:id" element={<EventPage />} />
              <Route path="/manage/:id/checkin" element={<Checkin />} />
              <Route path="/manage/:id" element={<ManageEvent />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </>
        ) : (
          <>
            {!shouldHideNavbar ? <Navbar /> : null}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/login" element={<LogSign />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </>
        )}

        <Toaster position="top-center" richColors />
      </div>

      {!shouldHideFooter ? <Footer /> : null}
    </>
  );
}

export default App;