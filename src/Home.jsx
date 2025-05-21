<<<<<<< HEAD
import React, { useEffect } from "react";
=======
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
>>>>>>> be463b7a5ce3c07d9085cf8d4e4c3fdae6a3248c
import Sidebar from "./components/sidebar";
import dayjs from "dayjs";
import "./globals.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function Home({ isLoggedIn, setIsLoggedIn }) {
<<<<<<< HEAD
  
  const currentHour = new Date().getHours();
  let greeting = "Good evening";
=======
    const sampleDataForChart = {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
            {
                label: "# of Votes",
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const currentHour = new Date().getHours();
    let greeting = "Good evening";
>>>>>>> be463b7a5ce3c07d9085cf8d4e4c3fdae6a3248c

    if (currentHour >= 5 && currentHour < 12) greeting = "Good morning";
    else if (currentHour >= 12 && currentHour < 17) greeting = "Good afternoon";

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [filterBarangay, setFilterBarangay] = useState("");
    const [filterCity, setFilterCity] = useState("");
    const [citiesData, setCitiesData] = useState([]);
    const [barangayOptions, setBarangayOptions] = useState([]);

    useEffect(() => {
        setIsLoggedIn(true);
    }, [setIsLoggedIn]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const res = await axios.get(
                    "https://smartvote-backend.onrender.com/admins/usersList",
                    {
                        headers: { Authorization: token },
                    }
                );
                setUsers(res.data);
                setFilteredUsers(res.data);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };
        fetchUsers();
    }, []);

<<<<<<< HEAD
      <div className="flex flex-col p-12 2xl:basis-[80%] basis-[70%] bg-gray-100 gap-4">
        <div className="flex flex-col w-full bg-[#EFF6FF] border border-[#2563EB] basis-[12%] rounded-3xl p-[20px] justify-center gap-2">
          <p className="text-[#786F6F] font-bold">
            {dayjs(new Date()).format("dddd | MMMM DD, YYYY").toString()}
          </p>
          <h1 className="text-4xl font-bold">{greeting}, Admin!</h1>
        </div>
        <h1 className="font-bold text-2xl text-blue-600">Voters' Overview</h1>
        <div className="flex flex-row basis-[80%] gap-4">
          <div className="flex flex-1 bg-white rounded-3xl"></div>
          <div className="grid grid-rows-[1fr_1fr] gap-4">
            <div className="flex shrink bg-white rounded-3xl">
=======
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get(
                    "https://smartvote-backend.onrender.com/locations/fetchCitiesAll"
                );
                setCitiesData(response.data);
            } catch (error) {
                console.error("Failed to fetch cities:", error);
            }
        };
        fetchCities();
    }, []);

    useEffect(() => {
        if (filterCity === "") {
            setBarangayOptions([]);
            setFilterBarangay("");
            return;
        }

        const selectedCity = citiesData.find((city) => city._id === filterCity);
        if (selectedCity) {
            setBarangayOptions(selectedCity.barangays);
            setFilterBarangay("");
        } else {
            setBarangayOptions([]);
            setFilterBarangay("");
        }
    }, [filterCity, citiesData]);

    useEffect(() => {
        const filtered = users.filter((user) => {
            const fullName = (
                user.first_name +
                " " +
                user.last_name
            ).toLowerCase();
            const matchesSearch =
                searchText.trim() === "" ||
                fullName.includes(searchText.toLowerCase());
            const matchesBarangay =
                filterBarangay === "" || user.baranggay_id === filterBarangay;
            const matchesCity =
                filterCity === "" || user.city_id === filterCity;
            return matchesSearch && matchesBarangay && matchesCity;
        });

        setFilteredUsers(filtered);
    }, [searchText, filterBarangay, filterCity, users]);

    if (!isLoggedIn) {
        return (
            <div>
                <h1>You are not logged in.</h1>
>>>>>>> be463b7a5ce3c07d9085cf8d4e4c3fdae6a3248c
            </div>
        );
    }
    return (
        <main className="flex flex-row min-h-screen bg-gray-100">
            <Sidebar page={"dashboard"} setIsLoggedIn={setIsLoggedIn} />

            <div className="flex flex-col p-12 2xl:basis-[80%] basis-[70%] bg-gray-100 gap-4">
                <div className="flex flex-col w-full bg-[#EFF6FF] border border-[#2563EB] basis-[12%] rounded-3xl p-[20px] justify-center gap-2">
                    <p className="text-[#786F6F] font-bold">
                        {dayjs().format("dddd | MMMM DD, YYYY")}
                    </p>
                    <h1 className="text-4xl font-bold">{greeting}, Admin!</h1>
                </div>

                <h1 className="font-bold text-2xl text-blue-600">
                    Voters' Overview
                </h1>
                <div className="flex flex-row basis-[80%] gap-4">
                    <div className="flex flex-1 bg-white rounded-3xl"></div>
                    <div className="grid grid-rows-[1fr_1fr] gap-4">
                        <div className="flex shrink bg-white rounded-3xl">
                            <Pie
                                data={sampleDataForChart}
                                options={{
                                    aspectRatio: 1 / 1,
                                    responsive: true,
                                }}
                            />
                        </div>
                        <div className="flex grow bg-white rounded-3xl"></div>
                    </div>
                </div>

                {/* User List Section */}
                <h1 className="font-bold text-2xl text-blue-600 mt-8">Users</h1>
                <div className="p-4 bg-white rounded-2xl shadow-md">
                    <div className="flex gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="border rounded px-3 py-2 flex-grow"
                        />

                        <select
                            value={filterCity}
                            onChange={(e) => setFilterCity(e.target.value)}
                            className="border rounded px-3 py-2"
                        >
                            <option value="">Filter by City</option>
                            {citiesData.map((city) => (
                                <option key={city._id} value={city._id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filterBarangay}
                            onChange={(e) => setFilterBarangay(e.target.value)}
                            className="border rounded px-3 py-2"
                            disabled={barangayOptions.length === 0}
                        >
                            <option value="">Filter by Barangay</option>
                            {barangayOptions.map((brgy) => (
                                <option key={brgy._id} value={brgy._id}>
                                    {brgy.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <table className="min-w-full table-auto border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-blue-200">
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    First Name
                                </th>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    Last Name
                                </th>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    Barangay
                                </th>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    City
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="text-center py-4"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => {
                                    // Find the city object for this user
                                    const city = citiesData.find(
                                        (c) => c._id === user.city_id
                                    );
                                    // Find the barangay object within the city
                                    const barangay = city?.barangays.find(
                                        (b) => b._id === user.baranggay_id
                                    );

                                    return (
                                        <tr
                                            key={user._id}
                                            className="hover:bg-gray-100"
                                        >
                                            <td className="border border-gray-300 px-4 py-2">
                                                {user.first_name}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {user.last_name}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {barangay
                                                    ? barangay.name
                                                    : "N/A"}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {city ? city.name : "N/A"}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}

export default Home;
