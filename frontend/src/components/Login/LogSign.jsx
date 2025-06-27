import React, { useState } from "react";
import { FaGoogle, FaChevronLeft } from "react-icons/fa";
import OtpInput from "react-otp-input";
import { RiBox3Fill } from "react-icons/ri";
import { toast } from "sonner";
import axios from "axios";
import { useCookies } from "react-cookie";
import Cookies from "js-cookie";
import { useMainDashContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { API_URL } from '../../api';
import { signInWithGoogle } from "../../config/firebase";

// Configure axios defaults
const axiosInstance = axios.create({
  baseURL: `${API_URL}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const LogSign = () => {
  const navigate = useNavigate();
  const { setProfile, setAskuserName } = useMainDashContext();
  const [cookies, setCookie] = useCookies(["user"]);
  const [oncontinue, setOncontinue] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [mailloading, setMailloading] = useState(false);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setMailloading(true);

    try {
      const response = await axiosInstance.post('/login/send-otp', { email });
      
      if (response.data) {
        toast.success("OTP sent successfully");
        setOncontinue(true);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      const errorMessage = error.response?.data?.message || "Failed to send OTP. Please try again.";
      toast.error(errorMessage);
    } finally {
      setMailloading(false);
    }
  };

  const handleEmail = (e) => {
    setEmail(e);
  };

  const handleOtpSubmitForm = async () => {
    try {
      const response = await axiosInstance.post('/login/verify-otp', { otp, email });
      
      if (response.data.success) {
        const { token, user } = response.data;
        Cookies.set("token", token, { expires: 1 / 24 });
        toast.success("OTP verified successfully");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        };

        const userResponse = await axiosInstance.get('/me', config);
        setCookie("user", userResponse.data, { path: "/" });
        setProfile(userResponse.data);

        if (userResponse.data.decodedjwt.user === null) {
          toast.info("Please set your username");
          setAskuserName(true);
        }

        navigate("/dashboard");
      } else {
        toast.error(response.data.message || "OTP verification failed");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      if (error.response?.status === 401) {
        toast.error("Invalid OTP. Please try again.");
      } else if (error.response?.status === 500) {
        toast.error("OTP has expired. Please request a new OTP.");
        setOncontinue(false);
      } else {
        const errorMessage = error.response?.data?.message || "Failed to verify OTP. Please try again.";
        toast.error(errorMessage);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Show loading state
      setMailloading(true);
      
      // Trigger Google sign-in popup
      const result = await signInWithGoogle();
      
      // Extract user info from Google
      const user = result.user;
      const googleToken = await user.getIdToken();
      
      console.log('Google user:', user);
      console.log('Google token:', googleToken);
      
      // Send Google token to your backend for verification
      const response = await axiosInstance.post('/login/google-auth', {
        idToken: googleToken,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        googleId: user.uid
      });
      
      if (response.data.success) {
        const { token, user: userData } = response.data;
        
        // Store your app's JWT token (same as OTP flow)
        Cookies.set("token", token, { expires: 1 / 24 });
        toast.success("Google sign-in successful!");
        
        // Get user profile and set up session (same as OTP flow)
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        };
        
        const userResponse = await axiosInstance.get('/me', config);
        setCookie("user", userResponse.data, { path: "/" });
        setProfile(userResponse.data);
        
        // Check if user needs to set username
        if (userResponse.data.decodedjwt.user === null) {
          toast.info("Please set your username");
          setAskuserName(true);
        }
        
        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        toast.error(response.data.message || "Google sign-in failed");
      }
      
    } catch (error) {
      console.error("Google sign-in error:", error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        toast.info("Sign-in cancelled");
      } else if (error.code === 'auth/popup-blocked') {
        toast.error("Popup was blocked. Please allow popups and try again.");
      } else {
        toast.error("Google sign-in failed. Please try again.");
      }
    } finally {
      setMailloading(false);
    }
  };

  return (
    <>
      <div className="flex fixed top-0 left-0 z-10 w-full h-full items-center bg-black/50 backdrop-blur-md justify-center">
        <motion.div
          className="absolute backdrop-blur-2xl shadow-xl border-white/40 border px-8 py-12 rounded-2xl bg-[#212325]/80 text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {!oncontinue ? (
            <div className="flex flex-col items-center justify-between gap-10">
              <div className="flex items-center group justify-center cursor-default">
                <RiBox3Fill className="text-5xl transform mr-2 group-hover:rotate-180 transition-all" />
                <h1 className="text-5xl">re:</h1>
                <h1 className="text-5xl bg-gradient-to-r from-white/50 to-pink-500 text-transparent bg-clip-text">
                  Event
                </h1>
              </div>
              <div className="flex flex-col items-center gap-2">
                <h1 className="text-3xl">Welcome to re:Event</h1>
                <h2 className="text-md">Please use your email below</h2>
              </div>
              <div className="flex flex-col">
                <h1 className="mb-2 tracking-wider text-sm font-bold">Email</h1>
                <form className="flex flex-col gap-5" onSubmit={handleSubmitForm}>
                  <input
                    className="focus:border-1 outline-none bg-transparent border-gray-500 rounded-md pl-4 w-[300px] py-2 border-[1px]"
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => handleEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="bg-white rounded-md text-black/90 px-10 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={mailloading}
                  >
                    {mailloading ? "Sending OTP..." : "Continue with Email"}
                  </button>
                  <hr className="border-gray-400" />
                  <button 
                    type="button"
                    className="rounded-md flex bg-[#212325] border-white/30 border px-8 py-2 items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleGoogleSignIn}
                     disabled={mailloading}
                    >

                    <FaGoogle className="text-gray-200" />
                    <h1 className="text-gray-200">
                      {mailloading ? "Signing in..." : "Continue with Google"}
                      </h1>
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
                <div className="flex flex-col gap-5">
                  <div
                    className="rounded-xl flex items-center cursor-pointer justify-center -mt-6 border border-gray-500 w-8 h-8"
                    onClick={() => setOncontinue(false)}
                  >
                    <FaChevronLeft className="text-lg text-white/60" />
                  </div>
                  <h1 className="text-2xl text-white">Enter Code</h1>
                  <div className="flex flex-col gap-1 mb-5">
                    <h2 className="text-sm text-white/80">
                      Please enter the 5 digit code sent to
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
                        type="button"
                        className="mt-4 border bg-gray-600 border-gray-500 text-white py-2 px-4 rounded-md shadow-md font-semibold tracking-wider"
                        onClick={handleOtpSubmitForm}
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
