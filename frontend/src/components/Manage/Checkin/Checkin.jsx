import React, { useEffect, useState } from "react";
import { PiExport } from "react-icons/pi";
import { IoIosSearch } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import { RiBox3Fill } from "react-icons/ri";
import GuestListItem from "./GuestListItem";
import GuestDetailsPopup from "./GuestDetailsPopup";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import { CSVLink } from "react-csv";

const Checkin = () => {
  const { id } = useParams();
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [isScanModalOpen, setScanModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [guestsData, setGuestsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (data === null) return;

    const makeScanCall = async () => {
      try {
        const response = await axios.post(
          `https://re-event-backend.onrender.com/events/qrscancall/${id}`,
          { scannedData: data }
        );
        if (response.data) {
          setSelectedGuest(response.data);
          setScanModalOpen(false);
          setData(null);
        } else {
          console.log("Check-in failed");
        }
      } catch (error) {
        console.error("Error making API call:", error);
      }
    };
    if (data) {
      makeScanCall();
    }
  }, [data]);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await axios.get(
          `https://re-event-backend.onrender.com/events/getcheckinusers/${id}`
        );
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

  const handleScan = async (decodedText) => {
    if (decodedText) {
      setData(decodedText);
    }
  };

  const closePopup = () => {
    setSelectedGuest(null);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <Link to={`/manage/${id}`} className="text-gray-600 hover:text-gray-800">
            <RiBox3Fill size={24} />
          </Link>
          <h1 className="text-2xl font-semibold">Check-in</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <IoIosSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button
            onClick={openScanModal}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaCamera size={20} />
            Scan QR
          </button>
          <CSVLink {...exportData}>
            <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
              <PiExport size={20} />
              Export
            </button>
          </CSVLink>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {filteredGuests && filteredGuests.map((guest) => (
          <GuestListItem
            key={guest._id}
            guest={guest}
            onSelect={() => setSelectedGuest(guest)}
          />
        ))}
      </div>

      {isScanModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Scan QR Code</h2>
              <button
                onClick={closeScanModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="w-full aspect-square">
              <Html5QrcodeScanner
                fps={10}
                qrbox={250}
                onResult={handleScan}
                onError={(err) => console.error(err)}
              />
            </div>
          </div>
        </div>
      )}

      {selectedGuest && (
        <GuestDetailsPopup
          guest={selectedGuest}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default Checkin;
