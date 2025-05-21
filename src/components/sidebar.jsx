import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Home,
  SettingsIcon,
  ChevronDown,
  ChevronUp,
  User,
  UserPlus,
  MonitorCog,
  UserCog,
  VoteIcon,
  Menu,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

function Sidebar(props) {
  const { setIsLoggedIn } = props;
  const navigate = useNavigate();

  const [isMonitorDropdownOpen, setMonitorDropdownVisibility] = useState(false);
  const [isSettingsDropdownOpen, setSettingsDropdownVisibility] = useState(false);
  const [activeButton, setActiveButton] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    // Initialize on first render
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNavigation = (path, buttonName) => {
    navigate(path);
    setActiveButton(buttonName);
    if (isMobile) {
      setIsCollapsed(true);
    }
    setMonitorDropdownVisibility(false);
    setSettingsDropdownVisibility(false);
  };


  useEffect(() => {
    if (!isMobile || isCollapsed) return;

    const handleClickOutside = (event) => {
      const sidebar = document.querySelector('.sidebar-container');
      const menuButton = document.querySelector('.mobile-menu-button');
      if (sidebar && !sidebar.contains(event.target) && 
          menuButton && !menuButton.contains(event.target)) {
        setIsCollapsed(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isCollapsed]);

  return (
    <>
      {/* Mobile overlay  */}
      {!isCollapsed && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className={`mobile-menu-button fixed z-50 top-4 left-4 p-2 rounded-md bg-indigo-100 text-indigo-800 shadow-sm transition-all duration-300
            ${!isCollapsed ? 'opacity-0' : 'opacity-100'}`}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Sidebar container */}
      <div
        className={`sidebar-container fixed md:relative z-50 h-screen flex transition-all duration-300 ease-in-out
          ${isMobile ? (isCollapsed ? '-translate-x-full' : 'translate-x-0') : ''}`}
      >
        {/* Sidebar content */}
        <div
          className={`flex flex-col h-full px-4 py-8 bg-indigo-50 gap-6 
            transition-all duration-300 ease-in-out shadow-lg overflow-y-auto
            ${isCollapsed ? "w-16 md:w-20" : "w-64"}`}
        >
          {/* Toggle Button (desktop) */}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center mb-2 w-full p-2 rounded-full hover:bg-indigo-100 transition"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          )}

          {/* Logo */}
          {!isCollapsed && (
            <div className="flex justify-center my-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-900 bg-clip-text text-transparent">
                SmartVote
              </h1>
            </div>
          )}

          {/* Create Election Button */}
          <button
            className={`flex items-center p-3 bg-white shadow-sm rounded-lg text-indigo-800 hover:bg-indigo-700 hover:text-white cursor-pointer transition-all duration-300 gap-3
              ${isCollapsed ? "justify-center p-3 rounded-full" : "justify-start px-4"}
              ${activeButton === "create-election" ? "bg-indigo-700 text-white" : ""}`}
            onClick={() => handleNavigation("/add-candidate", "create-election")}
            title="Create Election"
          >
            <UserPlus size={isCollapsed ? 20 : 18} />
            {!isCollapsed && <span className="text-sm font-medium">Create Election</span>}
          </button>

          <div className="flex flex-col gap-1">
            {/* DASHBOARD */}
            <button
              onClick={() => handleNavigation("/home", "dashboard")}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 gap-3
                ${activeButton === "dashboard"
                  ? "bg-indigo-700 text-white"
                  : "text-indigo-800 hover:bg-indigo-100"}
                ${isCollapsed ? "justify-center" : "px-4"}`}
              title="Dashboard"
            >
              <Home size={isCollapsed ? 20 : 18} />
              {!isCollapsed && <span className="text-sm font-medium">Dashboard</span>}
            </button>

            {/* MONITORING */}
            <div className={`relative ${isMonitorDropdownOpen && !isCollapsed ? "mb-32" : ""}`}>
              <button
                className={`flex items-center justify-between p-3 w-full rounded-lg cursor-pointer transition-all duration-300 gap-3
                  ${activeButton.startsWith("monitoring")
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-800 hover:bg-indigo-100"}
                  ${isCollapsed ? "justify-center" : "px-4"}`}
                onClick={() => {
                  setMonitorDropdownVisibility(!isMonitorDropdownOpen);
                  setActiveButton("monitoring");
                }}
                title="Monitoring"
              >
                <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center w-full" : ""}`}>
                  <MonitorCog size={isCollapsed ? 20 : 18} />
                  {!isCollapsed && <span className="text-sm font-medium">Monitoring</span>}
                </div>
                {!isCollapsed && (isMonitorDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
              </button>

              {isMonitorDropdownOpen && !isCollapsed && (
                <div className="flex flex-col gap-1 mt-1 ml-12 pl-2 border-l-2 border-indigo-200">
                  {/* Voters Monitoring */}
                  <button
                    onClick={() => handleNavigation("/voters-monitoring", "voters-monitoring")}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 gap-3
                      ${activeButton === "voters-monitoring"
                        ? "bg-indigo-700 text-white"
                        : "text-indigo-800 hover:bg-indigo-100"}`}
                  >
                    <User size={16} />
                    <span className="text-sm">Voters Monitoring</span>
                  </button>

                  {/* Election Monitoring */}
                  <button
                    onClick={() => handleNavigation("/get-barangay", "election-monitoring")}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 gap-3
                      ${activeButton === "election-monitoring"
                        ? "bg-indigo-700 text-white"
                        : "text-indigo-800 hover:bg-indigo-100"}`}
                  >
                    <VoteIcon size={16} />
                    <span className="text-sm">Election Monitoring</span>
                  </button>
                </div>
              )}
            </div>

            {/* SETTINGS */}
            <div className="relative">
              <button
                className={`flex items-center justify-between p-3 w-full rounded-lg cursor-pointer transition-all duration-300 gap-3
                  ${activeButton.startsWith("settings")
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-800 hover:bg-indigo-100"}
                  ${isCollapsed ? "justify-center" : "px-4"}`}
                onClick={() => {
                  setSettingsDropdownVisibility(!isSettingsDropdownOpen);
                  setActiveButton("settings");
                }}
                title="Settings"
              >
                <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center w-full" : ""}`}>
                  <SettingsIcon size={isCollapsed ? 20 : 18} />
                  {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
                </div>
                {!isCollapsed && (isSettingsDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
              </button>

              {isSettingsDropdownOpen && !isCollapsed && (
                <div className="flex flex-col gap-1 mt-1 ml-12 pl-2 border-l-2 border-indigo-200">
                  <button
                    onClick={() => handleNavigation("/profile", "profile")}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 gap-3
                      ${activeButton === "profile"
                        ? "bg-indigo-700 text-white"
                        : "text-indigo-800 hover:bg-indigo-100"}`}
                  >
                    <UserCog size={16} />
                    <span className="text-sm">Profile</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 gap-3 bg-red-500 text-white hover:bg-red-600"
                  >
                    <LogOut size={16} />
                    <span className="text-sm">Log-out</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Sidebar;