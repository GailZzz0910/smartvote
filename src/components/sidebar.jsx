import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Home,
  ChartArea,
  Bell,
  SettingsIcon,
  PlusIcon,
  ChevronDown,
  ChevronUp,
  User,
  Building,
  UserPlus,
  TrendingUp,
  MonitorCog,
  UserCog,
  VoteIcon,
} from "lucide-react";
import { useState } from "react";

import "../globals.css";

function Sidebar(props) {
  const { setIsLoggedIn } = props;
  const navigate = useNavigate();

  const [isMonitorDropdownOpen, setMonitorDropdownVisibility] = useState(false);
  const [isSettingsDropdownOpen, setSettingsDropdownVisibility] = useState(false);
  const [activeButton, setActiveButton] = useState(""); // Track active button globally

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="flex flex-col 2xl:basis-[20%] basis-[30%] rounded-tr-3xl rounded-br-3xl min-h-screen px-4 py-8 bg-[#DBDEF1] gap-4 justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-3xl font-bold my-8">LOGO</h1>

        <button
          className="flex items-center p-6 bg-white shadow-md rounded-[50px] text-[#111B56] hover:bg-[#111B56] hover:text-white cursor-pointer transition-all duration-300 gap-4 w-fit"
          onClick={() => {
            navigate("/add-candidate");
            setActiveButton("create-election");
          }}
        >
          <UserPlus />
          <h1 className="text-base font-semibold">Create Election</h1>
        </button>

        <div className="flex flex-col gap-2">

{/* DASHBOARD */}
          <button
            onClick={() => {
              navigate("/home");
              setActiveButton("dashboard");
            }}
            className={`flex flex-row items-center p-4 rounded-3xl cursor-pointer transition-all delay-0 duration-300 gap-4 ${
              activeButton === "dashboard"
                ? "bg-blue-950 text-blue-50"
                : "text-blue-900 hover:bg-blue-200"
            }`}
          >
            <Home />
            <h1>Dashboard</h1>
          </button>

{/* MONITORING */}
          <div className={`relative ${isMonitorDropdownOpen ? "mb-40" : ""}`}>
            <button
              className={`flex flex-row items-center justify-between p-4 w-full rounded-3xl cursor-pointer transition-all delay-0 duration-300 gap-4 ${
                activeButton === "monitoring"
                  ? "bg-blue-950 text-blue-50"
                  : "text-blue-900 hover:bg-blue-200"
              }`}
              onClick={() => {
                setMonitorDropdownVisibility(!isMonitorDropdownOpen);
                setActiveButton("monitoring"); 
              }}
            >
              <div className="flex flex-row items-center gap-4">
                <MonitorCog />
                <h1>Monitoring</h1>
              </div>
              {isMonitorDropdownOpen ? <ChevronUp /> : <ChevronDown />}
            </button>

            {isMonitorDropdownOpen && (
              <div className="absolute flex flex-col gap-2 left-0 p-4 bg-blue-900/10 mt-2 w-full rounded-xl ring-opacity-5 z-50">
                {/* Voters Monitoring */}
                <button
                  onClick={() => {
                    navigate("/voters-monitoring");
                    setMonitorDropdownVisibility(false);
                    setActiveButton("voters-monitoring"); 
                  }}
                  className="flex flex-row items-center p-4 rounded-3xl cursor-pointer transition-all delay-0 duration-300 hover:bg-blue-100 text-blue-900 gap-4 w-full"
                >
                  <User />
                  <h1>Voters Monitoring</h1>
                </button>

                {/* Election Monitoring */}
                <button
                  onClick={() => {
                    navigate("/get-barangay");
                    setMonitorDropdownVisibility(false);
                    setActiveButton("election-monitoring"); 
                  }}
                  className="flex flex-row items-center p-4 rounded-3xl cursor-pointer transition-all delay-0 duration-300 hover:bg-blue-100 text-blue-900 gap-4 w-full"
                >
                  <VoteIcon />
                  <h1>Election Monitoring</h1>
                </button>
              </div>
            )}
          </div>

{/* SETTINGS */}
          <div className="relative">
            <button
              className={`flex flex-row items-center justify-between p-4 w-full rounded-3xl cursor-pointer transition-all delay-0 duration-300 gap-4 ${
                activeButton === "settings"
                  ? "bg-blue-950 text-blue-50"
                  : "text-blue-900 hover:bg-blue-200"
              }`}
              onClick={() => {
                setSettingsDropdownVisibility(!isSettingsDropdownOpen);
                setActiveButton("settings");
              }}
            >
              <div className="flex flex-row items-center gap-4">
                <SettingsIcon />
                <h1>Settings</h1>
              </div>
              {isSettingsDropdownOpen ? <ChevronUp /> : <ChevronDown />}
            </button>

            {isSettingsDropdownOpen && (
              <div className="absolute flex flex-col gap-4 left-0 p-4 bg-blue-900/10 mt-2 w-full rounded-xl ring-opacity-5 z-50">
                <button
                  onClick={() => {
                    navigate("/profile");
                  }}
                  className="flex flex-row items-center p-4 rounded-3xl cursor-pointer transition-all delay-0 duration-300 hover:bg-blue-100 text-blue-900 gap-4 w-full"
                >
                  <UserCog />
                  <h1>Profile</h1>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex flex-row items-center p-4 rounded-3xl cursor-pointer transition-all delay-0 duration-300 bg-red-500 text-blue-100 gap-4 w-full"
                >
                  <LogOut />
                  <h1>Log-out</h1>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
