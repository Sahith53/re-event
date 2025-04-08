import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const MainDashContext = createContext();

export const MainDashProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [openlogin, setOpenlogin] = useState(false);
  const [managetab, setManagetab] = useState("Overview");
  const [activemenuItem, setActivemenuItem] = useState("zoom");
  const [EventHeader, setEventHeader] = useState("Add Guests");
  const [RegisterClick, setRegisterClick] = useState(false);

  // Add these to your context provider's state
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get("user"));
  
  // Add this effect to check authentication on load
  useEffect(() => {
    const token = Cookies.get("user");
    if (token) {
      try {
        const userData = JSON.parse(token);
        setProfile(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Invalid token format", error);
        Cookies.remove("user");
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);
  const [editedEvent, setEditedEvent] = useState({});

  const [userProfileMenu, setUserprofilemenu] = useState("Myevents");

  const [askuserName, setAskuserName] = useState(false);

  const [newevent, setNewEvent] = useState({
    eventname: "",
    eventdate: "",
    eventtime: "",
    eventbanner: "",
    description: "",
    eventlocation: "",
    eventcreatedby: "",
    eventtype: "online",
    registrationstatus: "open",
    eventstatus: "upcoming",
    eventurl: "",
    eventticketprice: "",
    visibility: "",
    questions: [],
    registeredusers: []
  });


  return (
    <MainDashContext.Provider
      value={{
        activeTab,
        setActiveTab,
        openlogin,
        setOpenlogin,

        activemenuItem,
        setActivemenuItem,
        EventHeader,
        setEventHeader,

        managetab,
        setManagetab,

        RegisterClick,
        setRegisterClick,

        profile,
        setProfile,
        // Add these to the provider value
        isAuthenticated,
        setIsAuthenticated,

        newevent,
        setNewEvent,

        editedEvent,
        setEditedEvent,

        userProfileMenu,
        setUserprofilemenu,

        askuserName,
        setAskuserName
        
      }}
    >
      {children}
    </MainDashContext.Provider>
  );
};

export const useMainDashContext = () => {
  const context = useContext(MainDashContext);
  if (!context) {
    throw new Error(
      "useMainDashContext must be used within a MainDashProvider"
    );
  }
  return context;
};
