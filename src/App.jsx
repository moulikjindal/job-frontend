import React, { useContext, useEffect } from "react";
import "../src/styles/global.css";
import { Context } from "./main";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./components/Home/Home";
import Jobs from "./components/Job/Jobs";
import JobDetails from "./components/Job/JobDetails";
import Application from "./components/Application/Application";
import MyApplications from "./components/Application/MyApplications";
import PostJob from "./components/Job/PostJob";
import NotFound from "./components/NotFound/NotFound";
import MyJobs from "./components/Job/MyJobs";
import Profile from "./components/Profile/Profile";
import PublicProfile from "./components/Profile/PublicProfile";
import SavedJobs from "./components/Job/SavedJobs";
import Dashboard from "./components/Dashboard/Dashboard";
import CompanyJobs from "./components/Job/CompanyJobs";

import ProtectedRoute from "./components/Routes/ProtectedRoute";
import RoleRoute from "./components/Routes/RoleRoute";

import BackToTop from "./components/Common/BackToTop";
import ScrollProgress from "./components/Common/ScrollProgress";
import OfflineBanner from "./components/Common/OfflineBanner";
import SkipToContent from "./components/Common/SkipToContent";
import CommandPalette from "./components/Common/CommandPalette";
import ErrorBoundary from "./components/Common/ErrorBoundary";

import { useTheme } from "./hooks/useTheme";
import { useScrollReveal } from "./hooks/useScrollReveal";
import * as api from "./api";
import toast from "react-hot-toast";

const App = () => {
  const { setIsAuthorized, setUser, setAuthLoading } = useContext(Context);
  useTheme();
  useScrollReveal();

  useEffect(() => {
    // Central handler for 401s from the axios interceptor
    api.setUnauthorizedHandler?.((msg) => {
      setIsAuthorized(false);
      setUser({});
      toast.error(msg);
    });
  }, [setIsAuthorized, setUser]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await api.getUser();
        if (cancelled) return;
        setUser(response.data.user || {});
        setIsAuthorized(true);
      } catch {
        if (cancelled) return;
        setIsAuthorized(false);
        setUser({});
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [setIsAuthorized, setUser, setAuthLoading]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <SkipToContent />
        <ScrollProgress />
        <Navbar />
        <OfflineBanner />
        <main id="main" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/job/getall" element={<Jobs />} />
            <Route path="/job/:id" element={<JobDetails />} />
            <Route path="/company/:userId" element={<CompanyJobs />} />
            <Route path="/user/:id" element={<PublicProfile />} />

            <Route path="/application/:id" element={
              <ProtectedRoute><RoleRoute role="Job Seeker"><Application /></RoleRoute></ProtectedRoute>
            } />
            <Route path="/applications/me" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            <Route path="/jobs/saved" element={
              <ProtectedRoute><RoleRoute role="Job Seeker"><SavedJobs /></RoleRoute></ProtectedRoute>
            } />
            <Route path="/job/post" element={
              <ProtectedRoute><RoleRoute role="Employer"><PostJob /></RoleRoute></ProtectedRoute>
            } />
            <Route path="/job/me" element={
              <ProtectedRoute><RoleRoute role="Employer"><MyJobs /></RoleRoute></ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <BackToTop />
        <CommandPalette />
        <Toaster
          position="top-center"
          toastOptions={{
            style: { borderRadius: "12px", background: "var(--surface)", color: "var(--text-primary)", border: "1px solid var(--border)" },
          }}
        />
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
