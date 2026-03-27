import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  const chartData = stats
    ? [
        { name: "Users", value: stats.totalUsers },
        { name: "Products", value: stats.totalProducts },
        { name: "Blocked", value: stats.blockedUsers },
      ]
    : [];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats(res.data.stats);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8 tracking-tight">Dashboard</h1>

      {!stats ? (
        <p className="text-gray-400 animate-pulse">Loading...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 rounded-xl shadow-lg hover:scale-105 transition">
            <h2 className="text-sm uppercase tracking-wide text-blue-100">
              Total Users
            </h2>
            <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 rounded-xl shadow-lg hover:scale-105 transition">
            <h2 className="text-sm uppercase tracking-wide text-green-100">
              Total Products
            </h2>
            <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
          </div>

          <div className="bg-gradient-to-r from-red-600 to-red-500 p-6 rounded-xl shadow-lg hover:scale-105 transition">
            <h2 className="text-sm uppercase tracking-wide text-red-100">
              Blocked Users
            </h2>
            <p className="text-3xl font-bold mt-2">{stats.blockedUsers}</p>
          </div>
        </div>
      )}

      <div className="bg-gray-900/70 backdrop-blur-md border border-gray-700 p-6 rounded-xl mt-10 shadow-xl">
        <h2 className="mb-6 text-xl font-semibold text-gray-200">
          System Overview
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#ccc" tick={{ fill: "#ccc" }} />
            <YAxis stroke="#ccc" tick={{ fill: "#ccc" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
