import React from 'react';
import { Link } from 'react-router-dom';
import { RiBox3Fill } from "react-icons/ri";
import { useMainDashContext } from '../context/AppContext';

const Navbar = () => {
  const { openlogin, setOpenlogin } = useMainDashContext();

  const handleLoginClick = () => {
    setOpenlogin(true);
  };

  return (
    <div className="w-full z-50 flex fixed bg-zinc-900/80 items-center backdrop-blur-2xl justify-between px-12 py-4 border-b border-gray-600 text-white">
      <div className="flex">
        <Link to="/" className="text-xl flex items-center group font-semibold">
          <RiBox3Fill className="text-2xl transform mr-2 group-hover:rotate-180 transition-all" />
          Re:
          <h1 className="bg-gradient-to-r from-white/50 to-pink-500 text-transparent bg-clip-text">
            Event
          </h1>
        </Link>
      </div>
      <div className="hidden md:flex gap-8 lg:flex lg:items-center">
        <button
          onClick={handleLoginClick}
          className="text-sm bg-white/10 backdrop-blur-md rounded-xl shadow text-white px-4 py-1.5 hover:scale-105 hover:bg-white/20 border border-white/20 transition-all cursor-pointer"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Navbar;
