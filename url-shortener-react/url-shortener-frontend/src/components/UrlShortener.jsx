import React, { useState } from "react";
import { motion } from "framer-motion";
import { useStoreContext } from "../contextApi/ContextApi";
import { buildApiUrl, getAuthHeaders, API_CONFIG } from "../api";
import { useNavigate } from "react-router-dom";

const UrlShortener = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { token } = useStoreContext();
  const navigate = useNavigate();

  const generateShortUrl = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setShortUrl("");

    if (!token) {
      navigate("/register");
      setLoading(false);
      return;
    }

    if (!originalUrl) {
      setError("Please enter a URL to shorten");
      setLoading(false);
      return;
    }

    // Validate URL format
    try {
      new URL(originalUrl);
    } catch {
      setError("Please enter a valid URL (e.g., https://example.com)");
      setLoading(false);
      return;
    }

    try {
      const requestBody = {
        originalUrl: originalUrl,
        customAlias: customAlias || null,
      };

      const response = await fetch(
        buildApiUrl(API_CONFIG.ENDPOINTS.SHORTEN_URL),
        {
          method: "POST",
          headers: getAuthHeaders(token),
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      console.log("Backend response:", data); // Debug log

      if (response.ok) {
        // Try different possible field names from the backend
        const shortCode = data.shortUrl;

        if (!shortCode) {
          console.error("No short code found in response:", data);
          setError(
            "Backend response missing short code. Check console for details."
          );
          setLoading(false);
          return;
        }

        const fullShortUrl = `${API_CONFIG.BASE_URL}/${shortCode}`;
        setShortUrl(fullShortUrl);
        setSuccess("URL shortened successfully!");
        setOriginalUrl("");
        setCustomAlias("");
      } else {
        setError(data.message || "Failed to shorten URL");
      }
    } catch (err) {
      console.error("Error creating short URL:", err);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setSuccess("Short URL copied to clipboard!");
    } catch (err) {
      setError("Failed to copy to clipboard");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Short Link
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter a long URL and get a short, shareable link
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 space-y-6"
          onSubmit={generateShortUrl}
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="originalUrl"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Original URL *
              </label>
              <input
                id="originalUrl"
                type="url"
                required
                className="input-field"
                placeholder="https://example.com/very-long-url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm"
            >
              {success}
            </motion.div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Short Link"}
            </button>
          </div>
        </motion.form>

        {shortUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Your Short Link
            </h3>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={shortUrl}
                className="flex-1 input-field bg-gray-50"
              />
              <button
                onClick={copyToClipboard}
                className="btn-secondary px-4 py-2 whitespace-nowrap"
              >
                Copy
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Click the copy button to copy the short URL to your clipboard
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UrlShortener;
