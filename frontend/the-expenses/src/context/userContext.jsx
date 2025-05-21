import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Load user data on initial render if token exists
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Explicitly log the full request details
          console.log("Fetching user data from:", API_PATHS.AUTH.GET_USER_INFO);
          
          const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
          console.log("User API response:", response.data);
          
          // Check the structure of your response data
          if (response.data && response.data.user) {
            console.log("Setting user data:", response.data.user);
            setUser(response.data.user);
          } else if (response.data) {
            // Your API might return the user directly without wrapping in a user property
            console.log("Setting user data directly:", response.data);
            setUser(response.data);
          } else {
            console.error("API returned success but no user data found");
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error.response?.data || error.message);
          console.error("Error status:", error.response?.status);
          localStorage.removeItem('token'); // Clear invalid token
        }
      }
      setLoading(false);
    };
    
    fetchUserData();
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
  };

  const clearUser = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  return (
    <UserContext.Provider 
      value={{
        user,
        loading,
        updateUser,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;