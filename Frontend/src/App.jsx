// import React from 'react';
import "./App.css";
import Fooddonation from "./components/form/Fooddonation";
import Contactus from "./components/form/Contactus";
import Dashboard from "./pages/Dashboard";
import Homepage from "./pages/Homepage";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/nav/Navbar";
import About from "./pages/AboutPage";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Donationpage from "./pages/Donationpage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Footer from "./components/footer/Footer";
import { useAuth } from "./context/AuthContext";
import NGORegistration from "./components/ngo/NGORegistration";
import NotFound from "./components/NotFound";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import NGODashboard from "./components/ngo/NGODashboard";
import LoginSelector from "./components/auth/LoginSelector";
import UserLogin from "./components/auth/UserLogin";
import NGOLogin from "./components/auth/NGOLogin";

function App() {
  const { loading, user } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <div
      className="app-container"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<LoginSelector />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/ngo-login" element={<NGOLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/ngo-registration" element={<NGORegistration />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Common Routes for all authenticated users */}
            <Route path="/contact" element={<Contactus />} />
            <Route path="/donate" element={<Donationpage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/donate/form" element={<Fooddonation />} />

            {/* NGO-specific routes */}
            {user?.role === "ngo" && (
              <Route path="/ngo/dashboard" element={<NGODashboard />} />
            )}
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
