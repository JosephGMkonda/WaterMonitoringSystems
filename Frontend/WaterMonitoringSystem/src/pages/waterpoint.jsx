import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getWaterPoints, setPage, setPageSize, clearError } from "../features/waterpointsSlice";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { FiEye } from "react-icons/fi";
import L from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";



delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});



const workingIcon = new L.Icon({
  iconUrl: "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=W|00FF00|000000",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png"
});

const notWorkingIcon = new L.Icon({
  iconUrl: "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=X|FF0000|000000",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png"
});

const Waterpoint = () => {
  const dispatch = useDispatch();
  const {
    waterpoints,
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    loading,
    error
  } = useSelector((state) => state.waterpoint);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [selectedPoint, setSelectedPoint] = useState(null);

  useEffect(() => {
    dispatch(getWaterPoints({ page: currentPage, pageSize }));
  }, [dispatch, currentPage, pageSize]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedData = React.useMemo(() => {
    let filtered = waterpoints;
    if (searchTerm) {
      filtered = filtered.filter(point =>
        Object.values(point).some(value =>
          value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "ascending" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [waterpoints, searchTerm, sortConfig]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setPage(newPage));
    }
  };

  const handlePageSizeChange = (e) => {
    dispatch(setPageSize(Number(e.target.value)));
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) return sortConfig.direction === "ascending" ? "↑" : "↓";
    return "";
  };

  return (
    <div className="ml-[18%] p-2 pt-20 min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">💧 Borehole Monitoring System</h1>

      <div className="bg-white shadow-xl rounded-2xl p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Waterpoints Overview</h2>
        <p className="text-gray-600 mb-4">Welcome to the waterpoints. Monitor and manage all boreholes in real-time.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-blue-700">Total Waterpoints</h3>
            <p className="text-2xl font-bold text-blue-900">{totalCount}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-green-700">Current Page</h3>
            <p className="text-2xl font-bold text-green-900">{currentPage} of {totalPages}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-purple-700">Page Size</h3>
            <p className="text-2xl font-bold text-purple-900">{pageSize}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search waterpoints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>Error: {error.message || error}</p>
            <button
              onClick={() => dispatch(clearError())}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm"
            >
              Dismiss
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading waterpoints...</p>
          </div>
        )}

        {!loading && waterpoints.length > 0 && (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th onClick={() => handleSort("name")} className="px-6 py-3 cursor-pointer">Name {getSortIndicator("name")}</th>
                  <th onClick={() => handleSort("district")} className="px-6 py-3 cursor-pointer">District {getSortIndicator("district")}</th>
                  <th onClick={() => handleSort("village")} className="px-6 py-3 cursor-pointer">Village {getSortIndicator("village")}</th>
                  <th onClick={() => handleSort("latitude")} className="px-6 py-3 cursor-pointer">Latitude {getSortIndicator("latitude")}</th>
                  <th onClick={() => handleSort("longitude")} className="px-6 py-3 cursor-pointer">Longitude {getSortIndicator("longitude")}</th>
                  <th onClick={() => handleSort("status")} className="px-6 py-3 cursor-pointer">Status {getSortIndicator("status")}</th>
                  <th className="px-6 py-3">View </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedData.map((point) => (
                  <tr key={point.name + point.latitude} className="hover:bg-blue-50 transition-colors even:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">{point.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{point.district}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{point.village}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{point.latitude}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{point.longitude}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{point.status}</td>
                    <td
                      className="px-6 py-4 text-sm text-blue-600 cursor-pointer hover:underline"
                      onClick={() => setSelectedPoint(point)}
                    >
                      <FiEye />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && waterpoints.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No waterpoints data available.</p>
          </div>
        )}

        
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">« First</button>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">‹ Prev</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              return (
                <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`px-3 py-1 border rounded ${currentPage === pageNum ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-100'}`}>{pageNum}</button>
              );
            })}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next ›</button>
            <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Last »</button>
          </div>
        )}
      </div>


    

    {/* Modal for interaction goes here  */}
      <AnimatePresence>
        {selectedPoint && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-4 w-11/12 md:w-2/3 max-h-[90vh] overflow-auto"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                className="float-right px-3 py-1 bg-red-600 text-white rounded mb-2"
                onClick={() => setSelectedPoint(null)}
              >
                Close
              </button>

              <h2 className="text-xl font-bold mb-2">{selectedPoint.name}</h2>
              <p><strong>Region:</strong> {selectedPoint.district}</p>
              <p><strong>Village:</strong> {selectedPoint.village}</p>
              {selectedPoint.raw_address &&
                Object.entries(selectedPoint.raw_address).map(([key, value]) => (
                  <p key={key}><strong>{key}:</strong> {value}</p>
                ))
              }

              <div className="h-80 mt-4">
                <MapContainer
                  center={[selectedPoint.latitude, selectedPoint.longitude]}
                  zoom={16}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  <Marker
                    position={[selectedPoint.latitude, selectedPoint.longitude]}
                    icon={selectedPoint.status === "working" ? workingIcon : notWorkingIcon}
                  >
                    <Popup>{selectedPoint.name}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Waterpoint;
