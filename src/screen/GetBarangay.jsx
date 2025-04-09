import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { InfoIcon, LoaderIcon } from "lucide-react";

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
        <div className="flex flex-col gap-4 max-w-xl">
          <h2 className="text-4xl font-black text-[#242424]">
            Search Elections by Location
          </h2>
          {loading && !selectedCity && <p>Loading cities...</p>}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <p>City</p>
              <select
                id="city-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={loading}
                className="w-full border border-gray-300 px-4 py-2 rounded-3xl"
              >
                <option value="">Select a city</option>
                {cities.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <p>Barangay</p>
              <select
                id="barangay-select"
                value={selectedBarangay}
                onChange={(e) => setSelectedBarangay(e.target.value)}
                disabled={!selectedCity || loading}
                className="w-full border border-gray-300 px-4 py-2 rounded-3xl"
              >
                <option value="">Barangay</option>
                {barangays.map((barangay) => (
                  <option key={barangay._id} value={barangay._id}>
                    {barangay.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={fetchElections}
            disabled={!selectedCity || !selectedBarangay || loading}
            className="bg-green-400 text-white rounded-3xl p-4 cursor-pointer"
          >
            {loading ? "Searching..." : "Search Elections"}
          </button>
        </div>

        {elections.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl">Election results</h1>
            <div className="grid grid-flow-col gap-4">
              {elections.map((election) => (
                <div
                  key={election._id}
                  className="border border-gray-300 rounded-3xl shadow p-6 flex flex-col gap-2"
                >
                  <h1 className="text-2xl font-black">{election.name}</h1>
                  <p className="text-gray-500">{election.description}</p>

                  {election.candidates?.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      <h5>Candidates</h5>
                      <ul className="flex">
                        {election.candidates.map((candidate) => (
                          <li
                            key={candidate._id}
                            className="p-4 rounded-3xl bg-blue-200"
                          >
                            <strong>{candidate.name}</strong> -{" "}
                            {candidate.party}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>No candidates found for this election</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>
    </main>
  );
}
