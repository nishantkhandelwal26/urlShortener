import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import AboutPage from "../components/AboutPage";
import LoginPage from "../components/LoginPage";
import DashboardPage from "../components/DashboardPage";
import UrlShortener from "../components/UrlShortener";
import Navbar from "../components/Navbar";

const MainApp = () => (
  <div className="app-container">
    <Navbar />
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/shorten" element={<UrlShortener />} />
    </Routes>
  </div>
);

export const subDomainList = [
  {
    subdomain: "",
    app: MainApp,
    main: true,
  },
];

// Application constants

export const APP_NAME = "Linklytics";
export const APP_DESCRIPTION = "Shorten URLs with powerful analytics";

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  SHORTEN_URL: "/api/urls/shorten",
  GET_USER_URLS: "/api/urls/user",
  DELETE_URL: "/api/urls",
  GET_URL_STATS: "/api/urls/stats",
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
};

// Validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  PASSWORD_MIN_LENGTH: "Password must be at least 6 characters long",
  PASSWORDS_DONT_MATCH: "Passwords do not match",
  INVALID_URL: "Please enter a valid URL",
};

// Success messages
export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: "Registration successful! Redirecting to login...",
  LOGIN_SUCCESS: "Login successful!",
  URL_SHORTENED: "URL shortened successfully!",
  URL_COPIED: "URL copied to clipboard!",
  URL_DELETED: "URL deleted successfully!",
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  LOGIN_FAILED: "Login failed. Please check your credentials.",
  REGISTRATION_FAILED: "Registration failed.",
  URL_SHORTEN_FAILED: "Failed to shorten URL.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
};
