import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";

export default function VotersMonitoring({ setIsLoggedIn }) {
  const [users, setUsers] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedBarangayId, setSelectedBarangayId] = useState("");
  const [nameSearch, setNameSearch] = useState("");

  useEffect(() => {
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
          { headers: { Authorization: `${token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch cities");
        const data = await res.json();
        setCities(data);
      } catch {
        setError("Failed to load cities");
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "https://smartvote-backend.onrender.com/admins/usersList",
          { headers: { Authorization: `${token}` } }
        );
        setUsers(res.data);
        console.log(res.data);
      } catch {
        setError("Failed to load users");
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchCities(), fetchUsers()]);
      setLoading(false);
    };

    fetchAll();
  }, []);

  // Defensive filtered users calculation:
  const filteredUsers = users.filter((user) => {
    const cityMatch = selectedCityId ? user.city_id === selectedCityId : true;
    const barangayMatch = selectedBarangayId
      ? user.baranggay_id === selectedBarangayId
      : true;
    const nameLower = nameSearch.toLowerCase();
    const nameMatch = nameSearch
      ? (
          (user.first_name?.toLowerCase() ?? "").includes(nameLower) ||
          (user.last_name?.toLowerCase() ?? "").includes(nameLower)
        )
      : true;
    return cityMatch && barangayMatch && nameMatch;
  });

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

  const barangaysForSelectedCity = selectedCityId
    ? cities.find((c) => c._id === selectedCityId)?.barangays || []
    : [];



  if (error) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-red-600 text-xl">{error}</p>
      </main>
    );
  }

  return (
    <main className="flex flex-row min-h-screen bg-gray-100">
      <Sidebar page={"dashboard"} setIsLoggedIn={setIsLoggedIn} />

      <div className="flex flex-col p-8 flex-grow bg-gray-100 gap-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Voters' Monitoring</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            className="border border-gray-300 rounded px-3 py-2"
            value={selectedCityId}
            onChange={(e) => {
              setSelectedCityId(e.target.value);
              setSelectedBarangayId("");
            }}
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city._id} value={city._id}>
                {city.name}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-300 rounded px-3 py-2"
            value={selectedBarangayId}
            onChange={(e) => setSelectedBarangayId(e.target.value)}
            disabled={!selectedCityId}
          >
            <option value="">All Barangays</option>
            {barangaysForSelectedCity.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search by first or last name"
            className="border border-gray-300 rounded px-3 py-2 flex-grow min-w-[200px]"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-white shadow overflow-auto max-h-[600px]">
          {filteredUsers.length === 0 ? (
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
                {filteredUsers.map((user, idx) => (
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
