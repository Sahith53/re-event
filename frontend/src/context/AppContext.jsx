import React, { createContext, useContext, useState } from 'react';

const MainDashContext = createContext();

export const MainDashProvider = ({ children }) => {
  const [openlogin, setOpenlogin] = useState(false);
  const [profile, setProfile] = useState(null);
  const [askuserName, setAskuserName] = useState(false);

  return (
    <MainDashContext.Provider
      value={{
        openlogin,
        setOpenlogin,
        profile,
        setProfile,
        askuserName,
        setAskuserName,
      }}
    >
      {children}
    </MainDashContext.Provider>
  );
};

export const useMainDashContext = () => useContext(MainDashContext);
