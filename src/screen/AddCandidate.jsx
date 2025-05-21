import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, X } from "lucide-react";

import Sidebar from "../components/sidebar";
import axios from "axios";

function AddCandidate({ setIsLoggedIn }) {
    const [formData, setFormData] = useState({
        name: "",
        city_id: "",
        baranggay_id: "",
        description: "",
        start_date: "",
        end_date: "",
        candidates: [{ name: "", party: "" }], // limit to 5, check line 82 to 89
    });
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState({
        name: false,
        city_id: false,
        baranggay_id: false
    });
    const apiUrl = import.meta.env.VITE_API_KEY;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCities = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(
                    "https://smart-vote-backend.vercel.app/locations/fetchCitiesAll",
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );

                setCities(response.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    localStorage.removeItem("authToken");
                    return;
                }
                setError(
                    err.response?.data?.message || "Failed to fetch cities"
                );
            } finally {
                setLoading(false);
            }
        };
        fetchCities();
    }, [navigate]);

    // Update barangays when city changes
    useEffect(() => {
        if (formData.city_id) {
            const city = cities.find((c) => c._id === formData.city_id);
            setBarangays(city?.barangays || []);
            setFormData((prev) => ({ ...prev, baranggay_id: "" }));
            setValidationErrors(prev => ({ ...prev, city_id: false }));
        } else {
            setBarangays([]);
        }
    }, [formData.city_id, cities]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Clear validation error when field is being edited
        if (validationErrors[name]) {
            setValidationErrors({ ...validationErrors, [name]: false });
        }
        
        setFormData({ ...formData, [name]: value });
    };

    const handleCandidateChange = (index, e) => {
        const { name, value } = e.target;
        const newCandidates = [...formData.candidates];
        newCandidates[index][name] = value;
        setFormData({ ...formData, candidates: newCandidates });
    };

    const addCandidate = () => {
        if (formData.candidates.length <= 4) {
            setFormData({
                ...formData,
                candidates: [...formData.candidates, { name: "", party: "" }],
            });
        }
    };

    const removeCandidate = (index) => {
        if (formData.candidates.length <= 1) return;
        const newCandidates = formData.candidates.filter((_, i) => i !== index);
        setFormData({ ...formData, candidates: newCandidates });
    };

     const validateForm = () => {
        const errors = {};
        let isValid = true;

        // Check required fields
        if (!formData.name) {
            errors.name = true;
            isValid = false;
        }

        if (!formData.city_id) {
            errors.city_id = true;
            isValid = false;
        }

        if (formData.city_id && !formData.baranggay_id) {
            errors.baranggay_id = true;
            isValid = false;
        }

        if (!formData.description.trim()) {
        errors.description = true;
        isValid = false;
         }

        if (!formData.start_date) {
            errors.start_date = true;
            isValid = false;
        }

        if (!formData.end_date) {
            errors.end_date = true;
            isValid = false;
        }

        setValidationErrors(errors);
        return isValid;
    };

    const handleNextStep = () => {
        if (validateForm()) {
            setIndex(1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");
        if (!token) {
            return;
        }

        if (!validateForm()) {
            setIndex(0); // Go back to first page if there are validation errors
            return;
        }

        // Filter empty candidates
        const filledCandidates = formData.candidates.filter(
            (c) => c.name.trim() && c.party.trim()
        );

        if (!filledCandidates.length) {
            setError("Please add at least one candidate");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                "https://smart-vote-backend.vercel.app/elections",
                {
                    ...formData,
                    candidates: filledCandidates,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            alert("Election created successfully!");
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to create election"
            );
        } finally {
            setLoading(false);
        }
    };

    const [index, setIndex] = useState(0);
    const pages = [
        <>
            <div className="flex flex-1 flex-col gap-2">
                <p>Election Name</p>
                <select
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`bg-gray-50 border ${validationErrors.name ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 p-3`}
                >
                    <option value="">Select an election</option>
                    <option value="SK Chairman">SK Chairman</option>
                    <option value="SK Kagawad">SK Kagawad</option>
                    <option value="Barangay Chairman">Barangay Chairman</option>
                    <option value="Barangay Kagawad">Barangay Kagawad</option>
                    {/*Dugang Candidates Here*/}
                </select>
                {validationErrors.name && (
                    <p className="text-red-500 text-sm mt-1">Please select an election</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-1 flex-col gap-2">
                    <p>City</p>
                    <select
                        name="city_id"
                        value={formData.city_id}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className={`w-full border ${validationErrors.city_id ? 'border-red-500' : 'border-gray-300'} p-3 bg-gray-50 rounded-xl`}
                    >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                            <option key={city._id} value={city._id}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                    {validationErrors.city_id && (
                        <p className="text-red-500 text-sm mt-1">Please select a city</p>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <p>Barangay</p>
                    <select
                        name="baranggay_id"
                        value={formData.baranggay_id}
                        onChange={handleChange}
                        disabled={!formData.city_id || loading}
                        className={`w-full border ${validationErrors.baranggay_id ? 'border-red-500' : 'border-gray-300'} p-3 bg-gray-50 rounded-xl`}
                    >
                        <option value="">Select Barangay</option>
                        {barangays.map((brgy) => (
                            <option key={brgy._id} value={brgy._id}>
                                {brgy.name}
                            </option>
                        ))}
                    </select>
                    {validationErrors.baranggay_id && formData.city_id && (
                        <p className="text-red-500 text-sm mt-1">Please select a barangay</p>
                    )}
                </div>
            </div>
            <p>Description</p>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Enter election description"
                    className={`bg-gray-50 border ${validationErrors.description ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 p-3 resize-none`}
                ></textarea>
                {validationErrors.description && (
                    <p className="text-red-500 text-sm mt-1">Description cannot be empty</p>
                )}

            <h1 className="font-extrabold text-[#EA580C] text-base">
                Election Period
            </h1>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <p>Start Date</p>
                    <input
                        type="datetime-local"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        required
                        className={`w-full border ${validationErrors.start_date ? 'border-red-500' : 'border-gray-300'} p-3 bg-gray-50 rounded-xl`}
                    />
                    {validationErrors.start_date && (
                        <p className="text-red-500 text-sm mt-1">Please select a start date </p>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <p>End Date</p>
                    <input
                        type="datetime-local"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        required
                        className={`w-full border ${validationErrors.end_date ? 'border-red-500' : 'border-gray-300'} p-3 bg-gray-50 rounded-xl`}
                    />
                    {validationErrors.start_date && (
                        <p className="text-red-500 text-sm mt-1">Please select an end date </p>
                    )}
                </div>

            </div>
            <button
                type="button"
                disabled={loading}
                className="p-4 bg-[#111B56] rounded-xl text-white cursor-pointer"
                onClick={handleNextStep}
            >
                Next
            </button>
        </>,
        <>
            <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-3xl">
                <button
                    type="button"
                    onClick={addCandidate}
                    className="px-4 py-2 flex flex-row gap-4 w-fit rounded-[10px] bg-[#21C179] text-white cursor-pointer"
                >
                    <UserPlus />
                    <p>Add candidate</p>
                </button>

                {formData.candidates.map((candidate, index) => (
                    <div
                        key={index}
                        className="flex flex-row gap-4 items-center"
                    >
                        <input
                            type="text"
                            name="name"
                            value={candidate.name}
                            onChange={(e) => handleCandidateChange(index, e)}
                            placeholder="Candidate name"
                            required
                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 p-3"
                        />
                        <input
                            type="text"
                            name="party"
                            value={candidate.party}
                            onChange={(e) => handleCandidateChange(index, e)}
                            placeholder="Partylist"
                            required
                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 p-3"
                        />
                        {formData.candidates.length > 1 && (
                            <X
                                size={24}
                                onClick={() => removeCandidate(index)}
                                color="red"
                                className="cursor-pointer shrink-0"
                            />
                        )}
                    </div>
                ))}

                <div className="relative h-80 w-full">
                    <div className="flex gap-4 absolute bottom-4 right-4">
                        <button
                            type="button"
                            className="p-4 px-6 rounded-xl text-gray-700 border border-gray-300 bg-gray-100 hover:bg-gray-200"
                            onClick={() => setIndex(0)}
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`p-4 px-6 rounded-xl text-white transition-all duration-300 
                            ${loading ? "bg-[#111B56a0] cursor-not-allowed" : "bg-[#111B56d4] hover:bg-[#111B56]"}`}
                        >
                            {loading ? "Creating..." : "Submit Entry"}
                        </button>
                    </div>
                </div>
            </div>
        </>,
    ];

    return (
        <main className="flex flex-row min-h-screen bg-gray-100">
            <Sidebar page={""} setIsLoggedIn={setIsLoggedIn} />
            <div className="flex items-center justify-center max-w-5xl mx-auto w-full">
                <form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col gap-4 p-8 rounded-xl border border-gray-300 shadow-lg bg-white"
                >
                    <div className="flex flex-col gap-4 border-b border-gray-300">
                        <h1 className="text-3xl font-black text-blue-900">
                            Create Entry
                        </h1>
                        <div className="flex flex-row gap-4 p-4">
                            <button
                                type="button"
                                className={
                                    index === 0
                                        ? "border-b-2 border-blue-800 px-4 pb-2 font-bold cursor-pointer"
                                        : "px-4 pb-2 cursor-pointer"
                                }
                                onClick={() => setIndex(0)}
                            >
                                Election
                            </button>

                            <button
                                type="button"
                                className={
                                    index === 1
                                        ? "border-b-2 border-blue-800 px-4 pb-2 font-bold cursor-pointer"
                                        : "px-4 pb-2 cursor-pointer"
                                }
                                onClick={() => index === 0 && validateForm() ? setIndex(1) : null}
                            >
                                Candidates
                            </button>
                        </div>
                    </div>
                    {pages[index]}
                    {error && <div className="p-4 bg-red-500 text-white rounded-lg mt-4">{error}</div>}
                </form>
            </div>
        </main>
    );
}

export default AddCandidate;