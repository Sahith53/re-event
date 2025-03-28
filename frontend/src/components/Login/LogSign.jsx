import React, { useState, useEffect } from "react";
import { FaGoogle, FaChevronLeft } from "react-icons/fa";
import OtpInput from "react-otp-input";
import { RiBox3Fill } from "react-icons/ri";
import { toast, Toaster } from "sonner";
import axios from "axios";
import { CookiesProvider, useCookies } from "react-cookie";
import Cookies from "js-cookie";
import { useMainDashContext } from "../../context/AppContext";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

const LogSign = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { profile, setProfile, askuserName, setAskuserName } =
    useMainDashContext();

  const [cookies, setCookie] = useCookies(["user"]);
  const [oncontinue, setOncontinue] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [mailloading, setMailloading] = useState(false);
  // const [askuserName, setAskuserName] = useState(false);

  useEffect(() => {
    // Check for token in URL parameters (Google auth callback)
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      handleGoogleAuthSuccess(token);
    }
  }, [location]);

  const handleGoogleAuthSuccess = async (token) => {
    try {
      Cookies.set("token", token, { expires: 1 / 24 });
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${API_URL}/login/me2`,
        config
      );
      
      setCookie("user", response.data, { path: "/" });
      setProfile(response.data);
      
      if (response.data.decodedjwt.user === null) {
        toast.info("Please set your username");
        setAskuserName(true);
      }

      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed");
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    setOncontinue(true);
    setMailloading(true);

    try {
      const response = await axios.post(
        `${API_URL}/login/send-otp`,
        { email }
      );
      
      toast.success('OTP sent successfully');
      setMessage(response.data);
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error(error.response?.data?.error || 'Failed to send OTP. Please try again.');
      setMessage(error.response?.data?.error || 'Failed to send OTP');
    } finally {
      setMailloading(false);
    }
  };

  const handleEmail = (e) => {
    setEmail(e);
  };

  const handleOtpSubmitForm = async () => {
    try {
      console.log(otp, email);
      const response = await axios.post(
        `${API_URL}/login/verify-otp`,
        { otp, email }
      );
      const token = response.data.token;
      const user = response.data.user;

      Cookies.set("token", token, { expires: 1 / 24 });

      toast.success(response.data.message); // Update this line to use the correct property

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const userResponse = await axios.get(
        `${API_URL}/login/me2`,
        config
      );
      setCookie("user", userResponse.data, { path: "/" });
      setProfile(userResponse.data);
      // console.log(response.data.decodedjwt.user);
      if (userResponse.data.decodedjwt.user === null) {
        toast.info("Please set your username");
        setAskuserName(true);
      }

      // navigate("/askusername");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response.data.message); // Update this line to use the correct property
      setMessage(error.response.data.message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/login/google`;
  };

  const handleSendOtp = async () => {
    try {
      const response = await axios.post(`${API_URL}/login/send-otp`, {
        email,
      });
      if (response.data.success) {
        setOncontinue(true);
        toast.success("OTP sent successfully");
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(`${API_URL}/login/verify-otp`, {
        email,
        otp,
      });
      if (response.data.success) {
        const token = response.data.token;
        Cookies.set("token", token, { expires: 1 / 24 });
        const userResponse = await axios.get(`${API_URL}/login/me2`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const decodedJwtString = JSON.stringify(userResponse.data);
        Cookies.set("user", decodedJwtString, { expires: 1 / 24 });
        toast.success("Login successful");
        setAskuserName(true);
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to verify OTP");
    }
  };

  return (
    <>
      <div className="flex fixed top-0 left-0 z-10 w-full h-full items-center  bg-black/50 backdrop-blur-md  justify-center">
        <motion.div
          className=" absolute    backdrop-blur-2xl  shadow-xl border-white/40  border  px-8 py-12  rounded-2xl  bg-[#212325]/80 text-white  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {!oncontinue ? (
            <div className="flex flex-col  items-center justify-between  gap-10 ">
              <div className="flex items-center group justify-center  cursor-default">
                <RiBox3Fill className="text-5xl  transform mr-2 group-hover:rotate-180 transition-all  " />
                <h1 className=" text-5xl">re:</h1>
                <h1 className=" text-5xl  bg-gradient-to-r from-white/50 to-pink-500 text-transparent bg-clip-text">
                  Event
                </h1>
              </div>
              <div className=" flex flex-col  items-center gap-2">
                <h1 className="  text-3xl">Welcome to re:Event</h1>
                <h2 className=" text-md">Please use your email below</h2>
              </div>
              <div className="flex flex-col">
                <h1 className="mb-2 tracking-wider text-sm font-bold">Email</h1>
                <form
                  className="flex flex-col gap-5"
                  onSubmit={handleSubmitForm}
                >
                  <input
                    className="focus:border-1 outline-none bg-transparent border-gray-500 rounded-md pl-4 w-[300px] py-2 border-[1px]"
                    type="text"
                    placeholder="email"
                    onChange={(e) => handleEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="bg-white rounded-md text-black/90 px-10 py-2"
                    // onClick={() => {
                    //   setOncontinue(true);
                    // }}
                  >
                    Continue with Email
                  </button>
                  <hr className="    border-gray-400  " />
                  <button 
                    className="rounded-md flex bg-[#212325] border-white/30 border px-8 py-2 items-center justify-center gap-2"
                    onClick={handleGoogleLogin}
                  >
                    <FaGoogle className="text-gray-200" />
                    <h1 className="text-gray-200">Continue with Google</h1>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <>
              <motion.div
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col gap-5 ">
                  <div
                    className="rounded-xl flex items-center cursor-pointer justify-center -mt-6 border border-gray-500 w-8 h-8"
                    onClick={() => setOncontinue(false)}
                  >
                    <FaChevronLeft className="text-lg text-white/60 " />
                  </div>
                  <h1 className="text-2xl text-white">Enter Code </h1>
                  <h1>{otp}</h1>
                  <div className="flex flex-col gap-1 mb-5">
                    <h2 className="text-sm text-white/80">
                      Please enter the 5 digit code sent to{" "}
                    </h2>
                    <h3 className="text-sm">{email}</h3>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-10">
                  <div className="w-full flex items-center justify-center flex-col">
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={5}
                      renderSeparator={<div className="ml-5"> </div>}
                      renderInput={(props) => <input {...props} />}
                      inputStyle={{
                        width: "40px",
                        height: "40px",
                        border: "1px",
                        borderRadius: "5px",
                        backgroundColor: "black",
                        textAlign: "center",
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    />
                    <div className="flex gap-2 mt-4">
                      <button
                        type="submit"
                        // onClick={handleSubmit}
                        className="mt-4 border bg-gray-600 border-gray-500 text-white py-2 px-4 rounded-md shadow-md font-semibold tracking-wider"
                        onClick={handleVerifyOtp}
                      >
                        Verify & Login
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default LogSign;
