import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

// Set axios base URL with a sensible default
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const { user } = useUser();
  const auth = useAuth(); // Use the full useAuth object
  const getToken = auth.getToken; // Extract getToken from useAuth

  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);

  const fetchUser = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setIsOwner(data.role === "hotelOwner");
        setSearchedCities(data.recentSearchedCities || []);
      } else {
        toast.error("Failed to fetch user data. Retrying...");
        setTimeout(() => fetchUser(), 5000);
      }
    } catch (error) {
      toast.error("An error occurred while fetching user data.");
      console.error("Fetch user error:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user, getToken]);

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
    getToken, // Ensure getToken is included
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