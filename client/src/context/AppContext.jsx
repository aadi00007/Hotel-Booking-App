import React from "react";
import axios from "axios";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

// Set axios base URL with a sensible default
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const { user } = useUser();
  const auth = useAuth();
  const getToken = auth.getToken;

  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("/api/rooms");
      if (data && data.success && Array.isArray(data.rooms)) {
        setRooms(data.rooms);
      } else {
        toast.error(data?.message || "Failed to fetch rooms");
        console.error("fetchRooms error:", data?.message || "Invalid response structure");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching rooms");
      console.error("fetchRooms error details:", error.response?.status, error.response?.data || error.message);
    }
  };

  const fetchUser = useCallback(async () => {
    try {
      const token = await getToken();
       console.log("Token exists:", !!token);
    console.log("Token starts with:", token?.substring(0, 10));
      if (!token) {
        toast.error("Authentication token unavailable");

        console.error("No token available, check Clerk configuration");
        return;
      }

      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data && data.success) {
        setIsOwner(data.role && data.role === "hotelOwner");
        setSearchedCities(data.recentSearchedCities && Array.isArray(data.recentSearchedCities) ? data.recentSearchedCities : []);
      } else {
        toast.error(data?.message || "Failed to fetch user data. Retrying...");
        setTimeout(() => fetchUser(), 5000);
      }
    } catch (error) {
      toast.error(`Error fetching user data: ${error.message}`);
      console.error("fetchUser error details:", error.response?.status, error.response?.data || error.message);
    }
  }, [getToken]);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  const value = {
    axios,
    currency,
    navigate,
    user,
    isOwner,
    setIsOwner,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
    rooms,
    getToken,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export default AppContext;
