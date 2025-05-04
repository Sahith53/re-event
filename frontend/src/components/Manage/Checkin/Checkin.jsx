import React, { useEffect, useState } from "react";
import { PiExport } from "react-icons/pi";
import { IoIosSearch } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import { RiBox3Fill } from "react-icons/ri";
import GuestListItem from "./GuestListItem";
import GuestDetailsPopup from "./GuestDetailsPopup";
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from "axios";
import { CSVLink } from "react-csv";
import { toast } from 'sonner';
import { API_ENDPOINTS } from '../../../config/api';

const Checkin = () => {
  const { id } = useParams();
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [isScanModalOpen, setScanModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [guestsData, setGuestsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    const success = async (result) => {
      scanner.clear();
      setScanResult(result);
      try {
        await axios.post(API_ENDPOINTS.QR_SCAN(id), {
          qrData: result,
        });
        toast.success('User checked in successfully');
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error checking in user');
      }
    };

    const error = (err) => {
      console.warn(err);
    };

    scanner.render(success, error);

    return () => {
      scanner.clear();
    };
  }, [id]);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.GET_CHECKIN_USERS(id));
        console.log(response.data);
        setGuestsData(response.data);
      } catch (error) {
        console.error("Error fetching guests:", error);
      }
    };
    fetchGuests();
  }, [selectedGuest]);

  const openScanModal = () => {
    setScanModalOpen(true);
  };

  const closeScanModal = () => {
    setScanModalOpen(false);
  };

  const filteredGuests = guestsData && guestsData.filter((guest) => {
    return (
      guest.email && guest.email.toLowerCase().includes(searchQuery.toLowerCase())
    )}
  );
  console.log(filteredGuests);
  const exportData = {
    filename: "guests.csv",
    data: guestsData.map((guest) => ({
      Email: guest.email,
      Time: guest.registeredDate,
      userid: guest.userid,
      approveStatus: guest.approveStatus,
      checkinStatus: guest.checkinStatus,
    })),
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(API_ENDPOINTS.GET_CHECKIN_USERS(id));
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleGuestItemClick = (guest) => {
    setSelectedGuest(guest);
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className={`${selectedGuest ? "fixed" : ""
          } w-full flex p-12 justify-center`}
      >
        <Link
          to={`/manage/${id}`}
          className="text-xl items-center  group font-semibold hidden fixed top-[5rem]  -left-6 md:flex -rotate-90"
        >
          <RiBox3Fill className="text-2xl transform mr-2 group-hover:rotate-180 transition-all " />
          Re:
          <h1 className="bg-gradient-to-r from-white/50 to-pink-500 text-transparent bg-clip-text">
            Event
          </h1>
        </Link>
        <div className={`  w-3/4 flex flex-col gap-3`}>
          <div className="flex items-center justify-between w-full">
            <p>Check in Guests - {id} </p>
            <div className="flex gap-2">
              <CSVLink {...exportData} className="px-6 bg-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-100/80 hover:text-black flex items-center transition-all text-center py-1.5">
                Export
                <PiExport className="ml-2 text-xl" />
              </CSVLink>
              <button
                onClick={openScanModal}
                className="px-6 bg-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-100/80 hover:text-black flex items-center transition-all text-center py-1.5"
              >
                Scan
                <FaCamera className="ml-2 text-xl" />
              </button>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2">
            <div className="flex gap-2 items-center justify-between w-full">
              <IoIosSearch className="p-1 bg-zinc-800 border border-zinc-200/20 text-4xl rounded-lg" />
              <input
                type="text"
                className="w-full px-4 py-1.5 my-3 text-zinc-200 rounded-lg outline-none focus:border border-[1px] border-zinc-200/20 bg-zinc-800"
                placeholder="Search in guests ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {filteredGuests.map((guest, index) => (
              <div key={index} onClick={() => handleGuestItemClick(guest)}>
                <GuestListItem
                  name={guest.name}
                  email={guest.email}
                  time={guest.time}
                  status={guest.approveStatus}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedGuest && (
        <GuestDetailsPopup guest={selectedGuest} onClose={() => setIsModalOpen(false)} />
      )}

      {isScanModalOpen && (
        <div className="fixed inset-0 w-full z-10 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-75"
            onClick={closeScanModal}
          ></div>
          <div className="z-20 w-2/6 flex flex-col bg-white p-4 rounded-lg shadow-md">
            <h1 className="text-black">{data}</h1>
            <div id="reader" className="w-full max-w-md"></div>
            {scanResult && (
              <div className="mt-4 p-4 bg-green-100 rounded-lg">
                <p className="text-green-800">Scanned: {scanResult}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {isModalOpen && selectedGuest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-zinc-800 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Guest Details</h3>
            <div className="space-y-2">
              <p><span className="font-semibold">Email:</span> {selectedGuest.email}</p>
              <p><span className="font-semibold">Name:</span> {selectedGuest.name}</p>
              <p><span className="font-semibold">Check-in Time:</span> {new Date(selectedGuest.checkinTime).toLocaleString()}</p>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkin;
