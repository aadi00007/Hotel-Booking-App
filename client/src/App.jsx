import { Route, Routes, useLocation, ScrollRestoration } from "react-router-dom";
import { Link } from "react-router-dom"; // Added for 404 page navigation
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./Pages/Home.jsx";
import AllRooms from "./Pages/AllRooms.jsx";
import RoomDetails from "./Pages/RoomDetails.jsx";
import MyBookings from "./Pages/MyBookings.jsx";
import HotelReg from "./components/HotelReg.jsx";
import Layout from "./Pages/HotelOwner/Layout.jsx";
import Dashboard from "./Pages/HotelOwner/Dashboard.jsx";
import AddRoom from "./Pages/HotelOwner/AddRoom.jsx";
import ListRoom from "./Pages/HotelOwner/ListRoom.jsx";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext.jsx";

const AppContent = () => {
  const { pathname } = useLocation();
  const isOwnerPath = pathname.includes("owner");
  const { showHotelReg } = useAppContext();

  return (
    <div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      {!isOwnerPath && <Navbar />}
      {showHotelReg && <HotelReg />}
      <div className="min-h-[calc(100vh-var(--header-footer-height,200px))]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
          </Route>
          <Route
            path="*"
            element={
              <div className="text-center mt-10">
                <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
                <p className="mt-2">The page you're looking for doesn't exist.</p>
                <Link
                  to="/"
                  className="text-blue-600 hover:underline mt-4 inline-block"
                >
                  Return to Home
                </Link>
              </div>
            }
          />
        </Routes>
      </div>
      {!isOwnerPath && <Footer />}
      
    </div>
  );
};

const App = () => {
  return <AppContent />; // Removed BrowserRouter as it's in main.jsx
};

export default App;