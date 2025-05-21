import React, { useEffect, useState } from "react";
import Sidebar from "./components/sidebar";
import dayjs from "dayjs";
import axios from "axios";
import "./globals.css";

function Home({ isLoggedIn, setIsLoggedIn }) {
  const [users, setUsers] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentHour = new Date().getHours();
  let greeting = "Good evening";

  if (currentHour >= 5 && currentHour < 12) greeting = "Good morning";
  else if (currentHour >= 12 && currentHour < 17) greeting = "Good afternoon";

  useEffect(() => {
    setIsLoggedIn(true);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Unauthorized: No token found");
      setLoading(false);
      return;
    }

    const fetchCities = async () => {
      try {
        const res = await fetch(
          "https://smart-vote-backend.vercel.app/locations/fetchCitiesAll",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch cities");
        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.error("Error fetching cities:", err);
        setError("Failed to load cities");
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "https://smartvote-backend.onrender.com/admins/usersList",
          {
           headers: { Authorization: `${token}` },
          }
        );
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users");
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchCities(), fetchUsers()]);
      setLoading(false);
    };

    fetchAll();
  }, [setIsLoggedIn]);

  // Helpers
  const getCityName = (cityId) => {
    const city = cities.find((c) => c._id === cityId);
    return city ? city.name : "Unknown City";
  };

  const getBarangayName = (barangayId) => {
    for (const city of cities) {
      const barangay = city.barangays.find((b) => b._id === barangayId);
      if (barangay) return barangay.name;
    }
    return "Unknown Barangay";
  };

  // Analytics calculations
  const totalUsers = users.length;
  const uniqueCityIds = new Set(users.map((u) => u.city_id));
  const uniqueCitiesCount = uniqueCityIds.size;
  const uniqueBarangayIds = new Set(users.map((u) => u.baranggay_id));
  const uniqueBarangaysCount = uniqueBarangayIds.size;

  if (!isLoggedIn) {
    return (
      <div>
        <h1>You are not logged in.</h1>
      </div>
    );
  }

  // Icons (simple inline SVG)
  const UserIcon = () => (
    <svg className="w-8 h-8 text-blue-600" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#155dfc"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" fill="#ffffff"></path> <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" fill="#ffffff"></path> </g></svg>
  );

  const CityIcon = () => (
    <svg className="w-8 h-8 text-blue-600" fill="#00a63e" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M13,9a1,1,0,0,0-1-1H3A1,1,0,0,0,2,9V22H13ZM6,20H4V18H6Zm0-4H4V14H6Zm0-4H4V10H6Zm5,8H8V18h3Zm0-4H8V14h3Zm0-4H8V10h3Zm3.5-6H6V3A1,1,0,0,1,7,2H17a1,1,0,0,1,1,1v7H15V6.5A.5.5,0,0,0,14.5,6ZM22,13v9H19.5V18h-2v4H15V13a1,1,0,0,1,1-1h5A1,1,0,0,1,22,13Z"></path></g></svg>
  );

  const BarangayIcon = () => (
   <svg className="w-8 h-8 text-blue-600" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect width="48" height="48" fill="white" fill-opacity="0.01"></rect> <path d="M24 20C28.4183 20 32 16.4183 32 12C32 7.58172 28.4183 4 24 4C19.5817 4 16 7.58172 16 12C16 16.4183 19.5817 20 24 20Z" fill="#b82efa" stroke="#b82efa" stroke-width="4" stroke-linejoin="round"></path> <path d="M24 20V38" stroke="#b82efa" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M16 32H12L4 44H44L36 32H32" stroke="#b82efa" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
  );

  return (
    <main className="flex flex-row min-h-screen bg-gray-100">
      <Sidebar page={"dashboard"} setIsLoggedIn={setIsLoggedIn} />

      <div className="flex flex-col p-12 2xl:basis-[80%] basis-[70%] bg-gray-100 gap-4">
        <div className="flex flex-col w-full bg-[#EFF6FF] border border-[#2563EB] basis-[12%] rounded-3xl p-[20px] justify-center gap-2">
          <p className="text-[#786F6F] font-bold">
            {dayjs(new Date()).format("dddd | MMMM DD, YYYY")}
          </p>
          <h1 className="text-4xl font-bold">{greeting}, Admin!</h1>
        </div>

        <h1 className="font-bold text-2xl text-blue-600">Voters' Overview</h1>

        {/* Analytics Section */}
        <div className="flex gap-6 mb-6 max-w-4xl">
          <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow flex-1">
            <UserIcon />
            <div>
              <p className="text-gray-500 text-sm">Voters</p>
              <p className="text-2xl font-bold text-blue-600">{totalUsers}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow flex-1">
            <CityIcon />
            <div>
              <p className="text-gray-500 text-sm">Cities</p>
              <p className="text-2xl font-bold text-green-600">{uniqueCitiesCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow flex-1">
            <BarangayIcon />
            <div>
              <p className="text-gray-500 text-sm">Barangays</p>
              <p className="text-2xl font-bold text-purple-600">{uniqueBarangaysCount}</p>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white  shadow overflow-auto max-h-[520px]">
          {users.length === 0 ? (
            <p className="text-center p-6 text-gray-500">No users found.</p>
          ) : (
            <table className="table-auto w-full text-left border-collapse">
              <thead className="bg-blue-100 sticky top-0 z-10">
                <tr className="text-blue-800">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">First Name</th>
                  <th className="px-4 py-2">Last Name</th>
                  <th className="px-4 py-2">City</th>
                  <th className="px-4 py-2">Barangay</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr
                    key={user._id}
                    className="border-t hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{user.first_name}</td>
                    <td className="px-4 py-2">{user.last_name}</td>
                    <td className="px-4 py-2">{getCityName(user.city_id)}</td>
                    <td className="px-4 py-2">{getBarangayName(user.baranggay_id)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}

export default Home;
