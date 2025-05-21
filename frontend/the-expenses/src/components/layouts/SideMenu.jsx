import React, { useContext, memo, useState, useCallback } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import { useNavigate, useLocation } from "react-router-dom";

// Separate optimized component for menu items
const MenuItem = memo(({ item, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button
      className={`w-full flex items-center gap-4 text-[15px] mb-2 p-3 px-5 rounded-lg transition-all duration-300 transform ${
        isActive 
          ? "text-white bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-md shadow-indigo-100" 
          : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 hover:pl-6 hover:shadow-sm"
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-current={isActive ? "page" : undefined}
    >
      <span 
        className={`transition-all duration-300 ${
          isActive 
            ? "text-white" 
            : `text-indigo-400 ${isHovered ? "text-indigo-600" : ""}`
        }`}
      >
        <item.icon 
          className={`text-lg ${
            !isActive && isHovered ? "transform scale-110" : ""
          } transition-transform duration-300`} 
        />
      </span>
      <span className="font-medium">{item.label}</span>
    </button>
  );
});

MenuItem.displayName = "MenuItem";

// User profile component
const UserProfile = memo(({ user }) => {
  return (
    <div className="flex flex-col items-center justify-center mb-10 px-2">
      {user?.profileImageUrl ? (
        <div className="overflow-hidden rounded-full w-16 h-16 mb-3 ring-2 ring-indigo-100">
          <img
            src={user?.profileImageUrl || "/default-avatar.png"}
            alt={`${user?.fullName || 'User'}'s profile`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
          />
        </div>
      ) : (
        <div 
          className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center ring-2 ring-indigo-100 text-indigo-700 mb-3"
          aria-label="User avatar"
        >
          <span className="text-xl font-medium">
            {user?.fullName?.[0]?.toUpperCase() || "U"}
          </span>
        </div>
      )}
      <h5 className="font-bold text-slate-800 text-center truncate max-w-full">
        {user?.fullName || user?.email || "User"}
      </h5>
    </div>
  );
});

UserProfile.displayName = "UserProfile";

// Main SideMenu component using advanced React patterns
const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Memoized handler functions to prevent unnecessary re-renders
  const handleLogout = useCallback(() => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  }, [clearUser, navigate]);
  
  const handleClick = useCallback((route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  }, [navigate, handleLogout]);
  
  // If activeMenu isn't provided, determine it from the current path
  const currentActiveMenu = activeMenu || 
    SIDE_MENU_DATA.find(item => location.pathname.includes(item.path))?.label;
  
  return (
    <div className="p-5 bg-slate-50 h-full border-r border-slate-100 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
      <UserProfile user={user} />
      
      <nav aria-label="Main Navigation">
        {SIDE_MENU_DATA.map((item, index) => (
          <MenuItem
            key={`menu_${index}`}
            item={item}
            isActive={currentActiveMenu === item.label}
            onClick={() => handleClick(item.path)}
          />
        ))}
      </nav>
    </div>
  );
};

export default SideMenu;