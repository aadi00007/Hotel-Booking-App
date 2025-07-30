import React from "react";
import Title from "../../components/Title.jsx";
import assets from "../../assets/assets";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext.jsx";
import { useEffect } from "react";

const Dashboard = () => {
    const { currency, user, getToken, toast, axios } = useAppContext();

    const [dashboardData, setdashboardData] = useState({
        bookings: [],
        totalBookings: 0,
        totalRevenue: 0, // ✅ Fixed typo: "toal" -> "total"
    });

    const fetchDashboardData = async () => {
        try {
            const { data } = await axios.get('/api/bookings/hotel', {
                headers: {
                    Authorization: `Bearer ${await getToken()}` // ✅ Fixed: added ()
                }
            });
            if (data.success) {
                setdashboardData(data.dashboardData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Dashboard fetch error:', error);
            toast.error('Failed to load dashboard data');
        }
    };

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    return (
        <div>
            <Title align="left" font="outfit" title="Dashboard" subtitle="See your room listings and manage it all!" />
            <div className="flex gap-4 my-8">
                <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8">
                    <img src={assets.totalRevenueIcon} alt="Total Revenue Icon" className="max-sm:hidden h-10" />
                    <div className="flex flex-col sm:m-4 font-medium">
                        <p className="text-blue-500 text-lg">Total Revenue</p>
                        <p className="text-neutral-400 text-base">{currency} {dashboardData.totalRevenue}</p> {/* ✅ Fixed: totalRevenue instead of totalBookings */}
                    </div>
                </div>
                
                <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8">
                    <div className="flex flex-col sm:m-4 font-medium">
                        <p className="text-blue-500 text-lg">Total Bookings</p>
                        <p className="text-neutral-400 text-base">{dashboardData.totalBookings}</p>
                    </div>
                </div>
            </div>

            <h2 className="text-xl text-blue-950/70 font-medium mb-5">Recent Bookings</h2>
            <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 text-gray-800 font-medium">User Name</th>
                            <th className="py-3 px-4 text-gray-800 font-medium">Room Name</th>
                            <th className="py-3 px-4 text-gray-800 font-medium">Total Amount</th>
                            <th className="py-3 px-4 text-gray-800 font-medium">Payment Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {dashboardData.bookings.map((item, index) => ( // ✅ Fixed: dashboardData instead of dashboardDummyData
                            <tr key={index}>
                                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                                    {item.user?.username || 'N/A'}
                                </td>
                                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                                    {item.room?.roomType || 'N/A'}
                                </td>
                                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                                    {currency} {item.totalPrice || 0}
                                </td>
                                <td className="py-3 px-4 border-t border-gray-300 flex">
                                    <button
                                        className={`py-1 px-3 text-xs rounded-full mx-auto ${
                                            item.isPaid ? 'bg-green-200 text-green-600' : 'bg-amber-200 text-yellow-600'
                                        }`}
                                    >
                                        {item.isPaid ? 'Completed' : 'Pending'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {dashboardData.bookings.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                        No bookings found
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
