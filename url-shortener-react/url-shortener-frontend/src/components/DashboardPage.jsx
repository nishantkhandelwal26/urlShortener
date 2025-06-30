import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useStoreContext } from "../contextApi/ContextApi";
import { buildApiUrl, getAuthHeaders, API_CONFIG } from "../api";
import Graph from "./Dashboard/Graph";

const DashboardPage = () => {
  const { token } = useStoreContext();
  const [urls, setUrls] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [totalClicks, setTotalClicks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [dateRange, setDateRange] = useState(() => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(now.getTime() + istOffset);

    const yyyy = istNow.getFullYear();
    const mm = String(istNow.getMonth() + 1).padStart(2, "0");
    const dd = String(istNow.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const sevenDaysAgo = new Date(istNow.getTime() - 6 * 24 * 60 * 60 * 1000);
    const yyyyAgo = sevenDaysAgo.getFullYear();
    const mmAgo = String(sevenDaysAgo.getMonth() + 1).padStart(2, "0");
    const ddAgo = String(sevenDaysAgo.getDate()).padStart(2, "0");
    const sevenDaysAgoStr = `${yyyyAgo}-${mmAgo}-${ddAgo}`;

    return { startDate: sevenDaysAgoStr, endDate: todayStr };
  });

  useEffect(() => {
    if (token) {
      fetchUserUrls();
      fetchGraphData();
    }
  }, [token, dateRange]);

  const fetchUserUrls = async () => {
    try {
      const response = await fetch(
        buildApiUrl(API_CONFIG.ENDPOINTS.USER_URLS),
        {
          headers: getAuthHeaders(token),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUrls(data);
      } else {
        setError("Failed to fetch URLs");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const fetchGraphData = async () => {
    try {
      const response = await fetch(
        `${buildApiUrl("/api/urls/totalClicks")}?startDate=${
          dateRange.startDate
        }&endDate=${dateRange.endDate}`,
        { headers: getAuthHeaders(token) }
      );
      if (response.ok) {
        const data = await response.json();

        const formattedData = Object.entries(data).map(
          ([date, count], index) => ({
            id: index + 1,
            clickDate: date,
            count: count,
          })
        );

        setGraphData(formattedData);
        console.log(formattedData);

        const total = formattedData.reduce(
          (acc, entry) => acc + entry.count,
          0
        );
        setTotalClicks(total);
      } else {
        setError("Failed to fetch analytics data");
      }
    } catch (err) {
      setError("Network error while fetching analytics");
    }
  };

  const copyToClipboard = async (shortUrl) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
    } catch {
      setError("Failed to copy to clipboard");
    }
  };

  const quickSetRange = (daysAgo) => {
    const today = new Date();
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - daysAgo);
    setDateRange({
      startDate: pastDate.toISOString().split("T")[0],
      endDate: today.toISOString().split("T")[0],
    });
  };

  const setThisMonth = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    setDateRange({
      startDate: startOfMonth.toISOString().split("T")[0],
      endDate: today.toISOString().split("T")[0],
    });
  };

  const setThisWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    setDateRange({
      startDate: startOfWeek.toISOString().split("T")[0],
      endDate: today.toISOString().split("T")[0],
    });
  };

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            Please log in to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-btnColor mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your URLs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] px-2 sm:px-4 md:px-8 lg:px-20 xl:px-32 pt-4 sm:pt-8 flex justify-center">
      <div className="bg-white w-full max-w-5xl sm:py-10 py-8 rounded-lg shadow-sm mx-auto p-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="sm:text-4xl text-slate-800 text-3xl font-bold mb-6">
            Dashboard
          </h1>
          <p className="text-gray-700 text-sm mb-8">
            Welcome to your UrlShortener dashboard! Here you can manage your
            shortened URLs and view analytics.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 w-full"
        >
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Total Links
            </h3>
            <p className="text-3xl font-bold text-blue-600">{urls.length}</p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Total Clicks
            </h3>
            <p className="text-3xl font-bold text-green-600">{totalClicks}</p>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Date Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-6"
        >
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Date Range Filter
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex flex-col w-full sm:w-auto">
                  <label
                    htmlFor="startDate"
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={dateRange.startDate}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
                  />
                </div>

                <div className="flex flex-col w-full sm:w-auto">
                  <label
                    htmlFor="endDate"
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={dateRange.endDate}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 overflow-x-auto py-1">
                <button
                  onClick={() => quickSetRange(6)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => quickSetRange(13)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm whitespace-nowrap"
                >
                  Last 14 Days
                </button>
                <button
                  onClick={() => quickSetRange(29)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm whitespace-nowrap"
                >
                  Last 30 Days
                </button>
                <button
                  onClick={setThisMonth}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm whitespace-nowrap"
                >
                  This Month
                </button>
                <button
                  onClick={setThisWeek}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm whitespace-nowrap"
                >
                  This Week
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Graph Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8 w-full"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Click Analytics (
            {new Date(dateRange.startDate).toLocaleDateString("en-GB")} -{" "}
            {new Date(dateRange.endDate).toLocaleDateString("en-GB")})
          </h2>
          <div className="bg-white p-6 rounded-lg border border-gray-200 h-96 overflow-x-auto min-w-[320px]">
            <Graph graphData={graphData} />
          </div>
        </motion.div>

        {/* URL List Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Links
          </h2>
          {urls.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-600 mb-4">
                No links created yet. Start by creating your first shortened
                URL!
              </p>
              <a href="/shorten" className="btn-primary inline-block">
                Create Your First Link
              </a>
            </div>
          ) : (
            <div className="space-y-4 overflow-x-auto">
              {urls.map((url) => (
                <motion.div
                  key={url.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200 min-w-[320px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {url.shortUrl || "No short URL"}
                      </h3>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mt-1 sm:mt-0">
                        {url.clickCount || 0} clicks
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {url.originalUrl || "No original URL"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created: {new Date(url.createdDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 sm:justify-end">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `${API_CONFIG.BASE_URL}/${url.shortUrl}`
                        )
                      }
                      className="btn-secondary px-3 py-1 text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
