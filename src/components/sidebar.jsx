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
} from "lucide-react";
import { useState } from "react";

import "../globals.css";

function Sidebar(props) {
  const { page, setIsLoggedIn } = props;
  const navigate = useNavigate();

  const [isSettingsDropdownOpen, setSettingsDropdownVisibility] =
    useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false); // ✅ Log out the user
    navigate("/"); // ✅ Redirect to login page
  };

  return (
    <div className="flex flex-col 2xl:basis-[20%] basis-[30%] rounded-tr-3xl rounded-br-3xl min-h-screen px-4 py-8 bg-[#DBDEF1] gap-4 justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-3xl font-bold my-8">LOGO</h1>

        <button
          className="flex flex-row items-center py-6  px-8 bg-white shadow-md rounded-[50px]   text-[#111B56] hover:bg-[#111B56] hover:text-white cursor-pointer transition-all delay-0 duration-300 gap-4"
          onClick={() => navigate("/add-candidate")}
        >
          <UserPlus />
          <h1>Create Election</h1>
        </button>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate("/home")}
            className={`flex flex-row items-center p-4 rounded-3xl cursor-pointer transition-all delay-0 duration-300 gap-4  ${
              page === "dashboard"
                ? "bg-blue-950 text-blue-50"
                : "text-blue-900 hover:bg-blue-200"
            }`}
          >
            <Home />
            <h1>Dashboard</h1>
          </button>

          <button
            onClick={() => navigate("/result")}
            className={`flex flex-row items-center p-4 rounded-3xl cursor-pointer transition-all delay-0 duration-300 gap-4  ${
              page === "result"
                ? "bg-blue-950 text-blue-50"
                : "text-blue-900 hover:bg-blue-200"
            }`}
          >
            <ChartArea />
            <h1>Result</h1>
          </button>

          <button
            onClick={() => navigate("/get-barangay")}
            className={`flex flex-row items-center p-4 rounded-3xl cursor-pointer transition-all delay-0 duration-300 gap-4  ${
              page === "get-barangay"
                ? "bg-blue-950 text-blue-50"
                : "text-blue-900 hover:bg-blue-200"
            }`}
          >
            <Bell />
            <h1>Monitoring</h1>
          </button>

          <div className="relative">
            <button
              className={`flex flex-row items-center justify-between p-4 w-full rounded-3xl cursor-pointer transition-all delay-0 duration-300 gap-4 ${
                page === "settings"
                  ? "bg-blue-950 text-blue-50"
                  : "text-blue-900 hover:bg-blue-200"
              }`}
              onClick={() =>
                setSettingsDropdownVisibility(!isSettingsDropdownOpen)
              }
            >
              <div className="flex flex-row items-center gap-4">
                <SettingsIcon />
                <h1>Settings</h1>
              </div>
              {isSettingsDropdownOpen ? <ChevronUp /> : <ChevronDown />}
            </button>

            {isSettingsDropdownOpen && (
              <div className="absolute flex flex-col gap-4 left-0 p-4 bg-blue-900/10 mt-2 w-full rounded-xl ring-opacity-5 z-50">
                <button className="flex flex-row items-center p-4 rounded-3xl cursor-pointer transition-all delay-0 duration-300 hover:bg-blue-100 text-blue-900 gap-4 w-full">
                  <User />
                  <h1>Profile</h1>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex flex-row items-center p-4 rounded-3xl cursor-pointer transition-all delay-0 duration-300 hover:bg-blue-100 text-blue-900 gap-4 w-full"
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
