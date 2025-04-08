import React from "react";
import HeroSection from "../components/HeroSection";
import Details from "../components/Details";
import LogSign from "../components/Login/LogSign";
import { useMainDashContext } from "../context/AppContext";
import Cookies from "js-cookie";

const Home = () => {
  const cookie = Cookies.get("user");
  const { openlogin } = useMainDashContext();
  
  return (
    <>
      <div className="w-full flex items-center flex-col justify-center">
        {!cookie && openlogin && <LogSign isModal={true} />}
        <HeroSection />
        <Details />
      </div>
    </>
  );
};

export default Home;
