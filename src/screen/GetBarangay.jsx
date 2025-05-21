import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Sidebar from "../components/sidebar";
import { InfoIcon, LoaderIcon, Search, ShieldAlert } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function GetBarangay({ setIsLoggedIn }) {
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedBarangay, setSelectedBarangay] = useState("");
    const [barangays, setBarangays] = useState([]);
    const [elections, setElections] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [liveResults, setLiveResults] = useState(null);
    const [activeElectionId, setActiveElectionId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCities = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                setError("Please log in to access this feature");
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(
                    `https://smart-vote-backend.vercel.app/locations/fetchCitiesAll`,
                    {
                        headers: { Authorization: `${token}` },
                    }
                );

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem("authToken");
                        navigate("/login");
                        return;
                    }
                    throw new Error("Failed to fetch cities");
                }

                const data = await response.json();
                console.log(data)
                setCities(data);
            } catch (err) {
                console.error("Error fetching cities:", err);
                setError(err.message || "Failed to load city data");
            } finally {
                setLoading(false);
            }
        };
        fetchCities();
    }, [navigate]);

    useEffect(() => {
        if (selectedCity) {
            const city = cities.find((c) => c._id === selectedCity);
            if (city) {
                setBarangays(city.barangays);
                setSelectedBarangay("");
            }
        } else {
            setBarangays([]);
            setSelectedBarangay("");
        }
    }, [selectedCity, cities]);

    const fetchElections = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            setError("Please log in to access this feature");
            navigate("/login");
            return;
        }

        if (!selectedCity || !selectedBarangay) {
            setError("Please select both City and Barangay");
            return;
        }
        setElections([]);
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                `https://smart-vote-backend.vercel.app/elections/getByLocation/${selectedCity}/${selectedBarangay}`,
                {
                    headers: { Authorization: `${token}` },
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem("authToken");
                    navigate("/login");
                    return;
                }
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Failed to fetch elections"
                );
            }

            const data = await response.json();
            setElections(data);
        } catch (err) {
            console.error("Error fetching elections:", err);
            setError(
                err.message || "No elections found for the selected location"
            );
        } finally {
            setLoading(false);
        }
    };

    const connectToSocket = async (electionId) => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            setError("Please log in to view election results");
            return;
        }

        setLiveResults(null);
        setActiveElectionId(electionId);
        setShowModal(true);

        try {
            const response = await fetch(
                `https://smart-vote-backend.vercel.app/elections/results/${electionId}`,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch current election results");
            }

            const currentResults = await response.json();
            setLiveResults(currentResults);
        } catch (err) {
            console.error("Error fetching current results:", err);
            setError(err.message || "Unable to fetch current results");
        }

        const newSocket = io("https://smartvote-backend.onrender.com", {
            transports: ["websocket"],
        });

        newSocket.on("connect", () => {
            console.log("Connected to server:", newSocket.id);
            newSocket.emit("joinElectionRoom", electionId);
        });

        newSocket.on("electionResults", (data) => {
            console.log("📢 New update:", data);
            setLiveResults(data);
        });

        newSocket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        setSocket(newSocket);
    };

    const closeModal = () => {
        if (socket) {
            socket.disconnect();
        }
        setShowModal(false);
        setLiveResults(null);
        setActiveElectionId(null);
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    const chartData =
        liveResults?.results?.map((item) => ({
            name: item.candidateName,
            votes: item.voteCount,
        })) || [];

    if (loading && !selectedCity) {
        return (
            <main className="flex flex-row min-h-screen bg-gray-100">
                <Sidebar page={"get-barangay"} setIsLoggedIn={setIsLoggedIn} />
                <div className="flex flex-col p-12 basis-[70%] bg-gray-100 gap-4 items-center justify-center">
                    <LoaderIcon size={64} />
                    <p className="text-4xl text-blue-500">Loading...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-row min-h-screen bg-gray-100">
            <Sidebar page={"get-barangay"} setIsLoggedIn={setIsLoggedIn} />
            <div className="flex flex-col p-12 basis-[70%] bg-gray-100 gap-12 w-full">
                {/* --- SEARCH SECTION --- */}
                <div className="flex flex-col gap-4 w-full">
                    <h2 className="text-4xl font-extrabold text-blue-500">
                        Election Monitoring
                    </h2>
                    <div className="flex flex-col gap-6 p-6 bg-white rounded-xl w-full border border-gray-300 shadow">
                        <h1 className="font-bold text-[#111B56]">
                            Search Elections by Location
                        </h1>
                        <div className="grid grid-cols-3 gap-4">
                            <select
                                value={selectedCity}
                                onChange={(e) =>
                                    setSelectedCity(e.target.value)
                                }
                                disabled={loading}
                                className="w-full border border-gray-300 px-6 py-4 rounded-xl"
                            >
                                <option value="">City</option>
                                {cities.map((city) => (
                                    <option key={city._id} value={city._id}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={selectedBarangay}
                                onChange={(e) =>
                                    setSelectedBarangay(e.target.value)
                                }
                                disabled={!selectedCity || loading}
                                className="w-full border border-gray-300 px-6 py-4 rounded-xl"
                            >
                                <option value="">Barangay</option>
                                {barangays.map((barangay) => (
                                    <option
                                        key={barangay._id}
                                        value={barangay._id}
                                    >
                                        {barangay.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={fetchElections}
                                disabled={
                                    !selectedCity ||
                                    !selectedBarangay ||
                                    loading
                                }
                                className="bg-[#111B56]/[0.83] text-white rounded-full p-4 cursor-pointer flex items-center justify-center w-12 h-12"
                            >
                                {loading ? (
                                    <div className="animate-spin">
                                        <Search size={20} />
                                    </div>
                                ) : (
                                    <Search size={20} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- ELECTION TABLE --- */}
                {elections.length > 0 && (
                    <div className="flex flex-col gap-4">
                        <h1 className="text-xl font-bold text-[#059669]">
                            Result
                        </h1>
                        <div className="overflow-x-auto bg-white rounded-2xl p-4 shadow border border-gray-200 h-[520px]">
                            <table className="min-w-full table-auto">
                                <thead className="bg-gray-100 sticky top-0 z-10">
                                    <tr className="border-b border-gray-300">
                                        <th className="px-6 py-4 text-left">
                                            Election Name
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            Description
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            Candidate Name
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            Partylist
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            Live Results
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {elections.map((election) =>
                                        election.candidates?.length > 0 ? (
                                            election.candidates.map(
                                                (candidate, index) => {
                                                    const isLast =
                                                        index ===
                                                        election.candidates
                                                            .length -
                                                            1;
                                                    return (
                                                        <tr
                                                            key={candidate._id}
                                                            className={
                                                                isLast
                                                                    ? "border-b border-gray-300"
                                                                    : ""
                                                            }
                                                        >
                                                            {index === 0 && (
                                                                <>
                                                                    <td
                                                                        className="px-6 py-4"
                                                                        rowSpan={
                                                                            election
                                                                                .candidates
                                                                                .length
                                                                        }
                                                                    >
                                                                        {
                                                                            election.name
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        className="px-6 py-4"
                                                                        rowSpan={
                                                                            election
                                                                                .candidates
                                                                                .length
                                                                        }
                                                                    >
                                                                        {
                                                                            election.description
                                                                        }
                                                                    </td>
                                                                </>
                                                            )}
                                                            <td className="px-6 py-4">
                                                                {candidate.name}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {
                                                                    candidate.party
                                                                }
                                                            </td>
                                                            {index === 0 && (
                                                                <td
                                                                    className="px-6 py-4"
                                                                    rowSpan={
                                                                        election
                                                                            .candidates
                                                                            .length
                                                                    }
                                                                >
                                                                    <button
                                                                        onClick={() =>
                                                                            connectToSocket(
                                                                                election._id
                                                                            )
                                                                        }
                                                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                                                    >
                                                                        View
                                                                        Results
                                                                    </button>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    );
                                                }
                                            )
                                        ) : (
                                            <tr
                                                key={election._id}
                                                className="border-b-2 border-gray-300"
                                            >
                                                <td className="px-6 py-2">
                                                    {election.name}
                                                </td>
                                                <td className="px-6 py-2">
                                                    {election.description}
                                                </td>
                                                <td
                                                    colSpan={2}
                                                    className="px-6 py-2 italic text-gray-400"
                                                >
                                                    No candidates found
                                                </td>
                                                <td className="px-6 py-2">
                                                    <button
                                                        onClick={() =>
                                                            connectToSocket(
                                                                election._id
                                                            )
                                                        }
                                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                                    >
                                                        View Results
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- ERROR DISPLAY --- */}
                {error && (
                    <div className="flex flex-row gap-2 items-center p-4 bg-red-500 w-fit rounded-3xl">
                        <ShieldAlert size={24} className="text-white" />
                        <p className="text-white font-black">{error}</p>
                    </div>
                )}

                {/* --- MODAL WITH LIVE CHART --- */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-[700px] max-h-[90vh] overflow-y-auto relative">
                            <button
                                onClick={closeModal}
                                className="absolute top-2 right-4 text-gray-600 font-bold text-2xl"
                            >
                                &times;
                            </button>
                            <h2 className="text-2xl font-bold mb-4 text-blue-600">
                                Live Election Results
                            </h2>

                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="votes" fill="#1E40AF" />
                                </BarChart>
                            </ResponsiveContainer>

                            <h3 className="text-sm font-semibold mt-4 text-gray-500">
                                Total Votes: {liveResults?.totalVotes ?? 0}
                            </h3>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
