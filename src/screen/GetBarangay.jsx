import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { InfoIcon, LoaderIcon, Search, ShieldAlert } from "lucide-react";

export default function GetBarangay({ setIsLoggedIn }) {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [barangays, setBarangays] = useState([]);
  const [elections, setElections] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_KEY;
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
            headers: {
              Authorization: `${token}`,
            },
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
        setCities(data);
      } catch (err) {
        console.error("Error fetching cities:", err);
        setError(err.message || "Failed to load city data");
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, [apiUrl, navigate]);

  // Update barangays when city changes
  useEffect(() => {
    if (selectedCity) {
      const city = cities.find((c) => c._id === selectedCity);
      if (city) {
        setBarangays(city.barangays);
        setSelectedBarangay(""); // Reset barangay selection when city changes
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

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://smart-vote-backend.vercel.app/elections/getByLocation/${selectedCity}/${selectedBarangay}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/login");
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch elections");
      }

      const data = await response.json();
      setElections(data);
    } catch (err) {
      console.error("Error fetching elections:", err);
      setError(err.message || "No elections found for the selected location");
    } finally {
      setLoading(false);
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  if (loading && !selectedCity) {
    return (
      <main className="flex flex-row min-h-screen bg-gray-100">
        <Sidebar page={"get-barangay"} setIsLoggedIn={setIsLoggedIn} />
        <div className="flex flex-col p-12 2xl:basis-[80%] basis-[70%] bg-gray-100 gap-4 items-center justify-center">
          <LoaderIcon size={64} />
          <p className="text-4xl text-blue-500">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-row min-h-screen bg-gray-100">
      <Sidebar page={"get-barangay"} setIsLoggedIn={setIsLoggedIn} />
      <div className="flex flex-col p-12 2xl:basis-[80%] basis-[70%] bg-gray-100 gap-12">
        <div className="flex flex-col gap-4 w-full">
          <h2 className="text-4xl font-extrabold text-blue-500">
            Election Monitoring
          </h2>
          {loading && !selectedCity && <p>Loading cities...</p>}
          <div className="flex flex-col gap-6 p-6 bg-white rounded-xl w-full border border-gray-300 shadow">
            <h1 className="font-bold text-[#111B56]">
              Search Elections by Location
            </h1>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <select
                  id="city-select"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={loading}
                  className="w-full border border-gray-300 px-6 py-4 rounded-xl"
                >
                  <option value="" className="text-gray-200">
                    City
                  </option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <select
                  id="barangay-select"
                  value={selectedBarangay}
                  onChange={(e) => setSelectedBarangay(e.target.value)}
                  disabled={!selectedCity || loading}
                  className="w-full border border-gray-300 px-6 py-4 rounded-xl"
                >
                  <option value="" className="text-gray-200">
                    Barangay
                  </option>
                  {barangays.map((barangay) => (
                    <option key={barangay._id} value={barangay._id}>
                      {barangay.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={fetchElections}
                disabled={!selectedCity || !selectedBarangay || loading}
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
        {elections.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-xl font-bold text-[#059669]">Result</h1>

            
            <div className="overflow-x-auto bg-white rounded-2xl p-4 shadow border border-gray-200 h-[520px]">
              <div className="overflow-y-auto rounded-md shadow-sm">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr className="border-b border-gray-300">
                      <th className="px-6 py-4 text-left">Election Name</th>
                      <th className="px-6 py-4 text-left">Description</th>
                      <th className="px-6 py-4 text-left">Candidate Name</th>
                      <th className="px-6 py-4 text-left">Partylist</th>
                    </tr>
                  </thead>
                  <tbody>
                    {elections.map((election) =>
                      election.candidates?.length > 0 ? (
                        election.candidates.map((candidate, index) => {
                          const isLast =
                            index === election.candidates.length - 1;

                          return (
                            <tr
                              key={candidate._id}
                              className={
                                isLast ? "border-b border-gray-300" : ""
                              }
                            >
                              {index === 0 && (
                                <>
                                  <td
                                    className="px-6 py-4"
                                    rowSpan={election.candidates.length}
                                  >
                                    {election.name}
                                  </td>
                                  <td
                                    className="px-6 py-4"
                                    rowSpan={election.candidates.length}
                                  >
                                    {election.description}
                                  </td>
                                </>
                              )}
                              <td className="px-6 py-4">{candidate.name}</td>
                              <td className="px-6 py-4">{candidate.party}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr
                          key={election._id}
                          className="border-b-2 border-gray-300"
                        >
                          <td className="px-6 py-2">{election.name}</td>
                          <td className="px-6 py-2">{election.description}</td>
                          <td
                            className="px-6 py-2 italic text-gray-400"
                            colSpan={2}
                          >
                            No candidates found
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="flex flex-row gap-2 items-center p-4 bg-red-500 w-fit rounded-3xl">
            <ShieldAlert size={24} className="text-white" />
            <p className="text-white font-black">{error}</p>
          </div>
        )}
      </div>
    </main>
  );
}
