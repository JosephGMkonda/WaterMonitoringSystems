import React from "react";

const Home = () => {
  return (
    <div className="ml-[18%] p-16 min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Dashboard</h1>
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Overview</h2>
        <p className="text-gray-600">
          Welcome to the waterpoints dashboard. Here you can view and manage boreholes, check water levels, and monitor sensor data.
        </p>
      </div>
    </div>
  );
};

export default Home;
