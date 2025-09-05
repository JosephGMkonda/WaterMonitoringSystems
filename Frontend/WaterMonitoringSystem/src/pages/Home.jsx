import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../features/dashboardSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const Home = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);


  const districtData = Object.entries(data?.by_district || {}).map(
  ([name, value]) => ({
    name,
    value,
  })
);

const regionData = Object.entries(data?.by_region || {}).map(
  ([name, value]) => ({
    name,
    value,
  })
);


  if (loading) {
    return (
      <div className="ml-[18%] p-16 pt- min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-800">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-[18%] p-16 min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-xl p-6 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Error Loading Data</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => dispatch(fetchDashboard())}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  
  const workingPercentage = (data.working_waterpoints / data.total_waterpoints) * 100;
  const notWorkingPercentage = (data.not_working_waterpoints / data.total_waterpoints) * 100;

  return (
    <div className="ml-[18%] p-6 pt-16 min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Waterpoints Dashboard</h1>
      
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-lg rounded-xl p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Waterpoints</p>
              <h3 className="text-2xl font-bold text-gray-800">{data.total_waterpoints}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-lg rounded-xl p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Working Waterpoints</p>
              <h3 className="text-2xl font-bold text-gray-800">{data.working_waterpoints}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-lg rounded-xl p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Not Working Waterpoints</p>
              <h3 className="text-2xl font-bold text-gray-800">{data.not_working_waterpoints}</h3>
            </div>
          </div>
        </div>
      </div>
      
      
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Status Overview</h2>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div 
            className="bg-green-500 h-4 rounded-full" 
            style={{ width: `${workingPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{workingPercentage.toFixed(1)}% Working</span>
          <span>{notWorkingPercentage.toFixed(1)}% Not Working</span>
        </div>
      </div>


       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Waterpoints by District</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={districtData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Waterpoints by Region</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={regionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {regionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Waterpoints by District</h2>
          <div className="overflow-y-auto max-h-80">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(data.by_district).map(([district, count]) => (
                  <tr key={district}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{district}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Waterpoints by Region</h2>
          <div className="overflow-y-auto max-h-80">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(data.by_region).map(([region, count]) => (
                  <tr key={region}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{region}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      
      <div className="bg-white shadow-lg rounded-xl p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recently Added Waterpoints</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Village</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.recently_added.map((waterpoint) => (
                <tr key={waterpoint.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{waterpoint.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{waterpoint.district}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{waterpoint.village}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      waterpoint.status === 'working' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {waterpoint.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {new Date(waterpoint.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;