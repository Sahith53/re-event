import React from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import arrow from '../assets/arrow.png';
import { motion } from 'framer-motion';
import { TbPhotoEdit } from "react-icons/tb";
import { MdManageAccounts } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { IoTicketOutline } from "react-icons/io5";

const HeroSection = () => {
  const token = Cookies.get("user");
  return (
    <>
      <div className="w-full flex items-center bg-gradient-to-r from-zinc-950 to-zinc-800 justify-center">

        <div className={
          `w-full max-w-[1600px] items-center lg:py-24 text-white justify-center px-8 lg:px-20 gap-5 md:gap-0 py-10 flex flex-col `}>
          <div className="w-full flex items-center lg:pt-12 flex-col md:flex-row">
            <div className="flex flex-col gap-4 w-full h-[80vh] md:h-[40vh] lg:w-1/2 p-2 items-center md:items-start justify-center">
              <h1 className="lg:text-8xl herofont text-4xl font-extrabold flex flex-col">
                Effortlessly{" "}
                <span className="bg-gradient-to-r text-7xl md:text-9xl from-amber-400 to-pink-500 text-transparent bg-clip-text">
                  Plan your Events.
                </span>
              </h1>
              <div className="flex flex-row  items-start gap-4">
                <div className="flex gap-4 items-start">
                  <img src={arrow} className="w-24 " />
                  <Link
                    to={token ? "/create" : "/"}
                    className="bg-white px-4 py-2 herofont tracking-wide rounded-2xl text-black shadow-lg hover:scale-105 transition-all"
                  >
                    Create
                  </Link>
                </div>
                {token && (
                  <Link
                    to="/dashboard"
                    className="bg-zinc-800 px-4 py-2 border border-zinc-600/60 rounded-2xl text-white shadow-lg hover:scale-105 transition-all"
                  >
                    Dashboard
                  </Link>
                )}
              </div>
            </div>
            <motion.div className="flex w-full lg:w-1/2 flex-col gap-4 lg:p-2"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="flex gap-3 w-full">
                <div className="w-1/3 rounded-2xl bg-pink-200 hover:bg-pink-600 transition-all cursor-pointer hover:scale-95 p-20"></div>
                <div className="w-2/3 rounded-2xl bg-yellow-200 hover:bg-yellow-600 transition-all cursor-pointer hover:scale-95 p-10"></div>
              </div>
              <div className="flex gap-3 w-full">
                <div className="w-2/3 rounded-2xl bg-blue-200 hover:bg-blue-600 transition-all cursor-pointer hover:scale-95 p-10"></div>
                <div className="w-1/3 rounded-2xl bg-emerald-200 hover:bg-emerald-600 transition-all cursor-pointer hover:scale-95 p-20"></div>
              </div>
              <div className="flex gap-3 w-full">
                <div className="w-1/4 rounded-2xl bg-purple-200 hover:bg-purple-600 transition-all cursor-pointer hover:scale-95 p-10"></div>
                <div className="w-3/4 rounded-2xl bg-red-200 hover:bg-red-600 transition-all cursor-pointer hover:scale-95 p-20"></div>
              </div>
            </motion.div>
          </div>

          {/* Feature section - replacing the commented out section */}
          <div className="w-full flex flex-col md:flex-row rounded-[3rem] gap-5 my-12">
            <motion.div 
              className="w-full md:w-1/3 bg-zinc-800 border flex flex-col border-zinc-400/40 relative rounded-3xl group shadow-xl shadow-zinc-600/20 text-white p-8"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              whileHover={{ scale: 1.02 }}
            >
              <TbPhotoEdit className="text-4xl p-1 bg-zinc-100 rounded-lg text-black mb-3" />
              <span className="herofont text-xl">Personalized Pages</span>
              <span className="text-sm">Create custom event pages with your branding, images, and details to engage your audience.</span>
            </motion.div>
            
            <motion.div 
              className="w-full md:w-1/3 bg-zinc-800 border flex flex-col border-zinc-400/40 relative rounded-3xl group shadow-xl shadow-zinc-600/20 text-white p-8"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              whileHover={{ scale: 1.02 }}
            >
              <MdManageAccounts className="text-4xl p-1 bg-zinc-100 rounded-lg text-black mb-3" />
              <span className="herofont text-xl">Event Management</span>
              <span className="text-sm">Powerful tools to manage registrations, attendees, and event communications all in one place.</span>
            </motion.div>
            
            <motion.div 
              className="w-full md:w-1/3 bg-zinc-800 border flex flex-col border-zinc-400/40 relative rounded-3xl group shadow-xl shadow-zinc-600/20 text-white p-8"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <IoTicketOutline className="text-4xl p-1 bg-zinc-100 rounded-lg text-black mb-3" />
              <span className="herofont text-xl">Check-in System</span>
              <span className="text-sm">Streamlined check-in process with QR codes for a seamless attendee experience.</span>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;

