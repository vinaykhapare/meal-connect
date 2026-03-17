import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
  Link,
  Typography,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import BusinessIcon from "@mui/icons-material/Business";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "../../context/AuthContext";

/* ─── shared MUI TextField style ─── */
const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    background: "#fff",
    transition: "box-shadow 0.2s ease, border-color 0.2s ease",
    "&:hover fieldset": { borderColor: "#3b5bdb" },
    "&.Mui-focused fieldset": { borderColor: "#3b5bdb", borderWidth: "2px" },
    "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(59,91,219,0.12)" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#3b5bdb" },
};

export default function NGOLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:3000/api/receiver/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        login(data);
        navigate("/ngo/dashboard");
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50 px-4 py-12">

      {/* Decorative blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-100/50 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative"
      >

        {/* ── Brand mark ── */}
        <div className="flex items-center justify-center gap-2.5 mb-7">
          <div className="w-9 h-9 rounded-xl bg-[#3b5bdb] flex items-center justify-center shadow-md shadow-blue-200">
            <svg viewBox="0 0 24 24" fill="white" width="17" height="17" aria-hidden="true">
              <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
            </svg>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800 tracking-tight leading-none">
              Meal<span className="text-[#3b5bdb]">Connect</span>
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
              Nourishing Communities
            </p>
          </div>
        </div>

        {/* ── Card ── */}
        <motion.div
          whileHover={{ boxShadow: "0 20px 60px rgba(59,91,219,0.14), 0 4px 16px rgba(0,0,0,0.06)" }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl border border-gray-100"
          style={{ boxShadow: "0 8px 40px rgba(59,91,219,0.09), 0 2px 8px rgba(0,0,0,0.04)" }}
        >
          {/* Card top accent bar */}
          <div className="h-1.5 w-full rounded-t-2xl bg-gradient-to-r from-[#3b5bdb] via-[#4f46e5] to-[#6366f1]" />

          <div className="px-8 py-8">

            {/* Header */}
            <div className="flex items-start gap-3 mb-7">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100">
                <BusinessIcon sx={{ color: "#3b5bdb", fontSize: 22 }} aria-hidden="true" />
              </div>
              <div>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: "#1a1a2e", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.2 }}
                >
                  NGO Portal
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                  Sign in to manage food collections
                </Typography>
              </div>
            </div>

            {/* Error alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <Alert
                    severity="error"
                    icon={<ErrorOutlineIcon fontSize="small" />}
                    sx={{
                      borderRadius: "10px",
                      fontSize: "0.82rem",
                      alignItems: "center",
                      border: "1px solid #fecaca",
                      background: "#fff5f5",
                    }}
                    role="alert"
                    aria-live="assertive"
                  >
                    {error}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate aria-label="NGO login form">
              <div className="flex flex-col gap-4">

                <TextField
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  required
                  fullWidth
                  size="small"
                  autoComplete="email"
                  inputProps={{ "aria-label": "Email address" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ fontSize: 18, color: "#3b5bdb" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />

                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange("password")}
                  required
                  fullWidth
                  size="small"
                  autoComplete="current-password"
                  inputProps={{ "aria-label": "Password" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ fontSize: 18, color: "#3b5bdb" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((v) => !v)}
                          edge="end"
                          size="small"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          tabIndex={0}
                        >
                          {showPassword
                            ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                            : <VisibilityOutlinedIcon sx={{ fontSize: 18, color: "#94a3b8" }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />

                {/* Forgot password */}
                <div className="flex justify-end -mt-2">
                  <Link
                    href="#"
                    underline="hover"
                    sx={{ fontSize: "0.78rem", color: "#3b5bdb", fontWeight: 500 }}
                    aria-label="Forgot password"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  aria-label="Sign in to NGO portal"
                  sx={{
                    py: 1.35,
                    mt: 0.5,
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #3b5bdb, #4f46e5)",
                    fontWeight: 700,
                    fontSize: "0.92rem",
                    letterSpacing: "0.02em",
                    textTransform: "none",
                    boxShadow: "0 4px 14px rgba(59,91,219,0.35)",
                    transition: "all 0.25s ease",
                    "&:hover:not(:disabled)": {
                      background: "linear-gradient(135deg, #2f4ac7, #4338ca)",
                      boxShadow: "0 6px 20px rgba(59,91,219,0.45)",
                      transform: "translateY(-1px)",
                    },
                    "&:active": { transform: "translateY(0)" },
                    "&.Mui-disabled": {
                      background: "linear-gradient(135deg, #93a8f4, #a5b4fc)",
                      color: "#fff",
                      boxShadow: "none",
                    },
                  }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <CircularProgress size={16} thickness={5} sx={{ color: "rgba(255,255,255,0.8)" }} />
                      Signing in…
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </form>

            {/* Divider */}
            <Divider sx={{ my: 3, fontSize: "0.75rem", color: "#cbd5e1" }}>or</Divider>

            {/* Register NGO CTA */}
            <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4 flex flex-col gap-2.5">
              <Typography variant="body2" sx={{ color: "#78716c", fontSize: "0.8rem", lineHeight: 1.5 }}>
                <span className="font-semibold text-amber-700">New to MealConnect?</span>{" "}
                Register your NGO to start receiving food donations. Admin verification is required.
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AppRegistrationIcon sx={{ fontSize: 17 }} />}
                onClick={() => navigate("/ngo-registration")}
                aria-label="Register your NGO"
                sx={{
                  borderRadius: "10px",
                  borderColor: "#f59e0b",
                  color: "#b45309",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  textTransform: "none",
                  py: 1,
                  background: "rgba(255,255,255,0.7)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#d97706",
                    background: "#fffbeb",
                    boxShadow: "0 2px 10px rgba(245,158,11,0.2)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Register NGO
              </Button>
            </div>

            {/* Back link */}
            <div className="flex justify-center mt-5">
              <button
                type="button"
                onClick={() => navigate("/login")}
                aria-label="Back to login options"
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#3b5bdb] transition-colors duration-200 group"
              >
                <ArrowBackIcon
                  sx={{ fontSize: 15, transition: "transform 0.2s" }}
                  className="group-hover:-translate-x-0.5"
                />
                Back to login options
              </button>
            </div>

          </div>
        </motion.div>

        {/* Footer */}
        <Typography
          variant="caption"
          display="block"
          align="center"
          sx={{ mt: 3, color: "#94a3b8" }}
        >
          Protected by end-to-end encryption ·{" "}
          <Link href="#" underline="hover" sx={{ color: "#94a3b8" }}>
            Privacy Policy
          </Link>
        </Typography>

      </motion.div>
    </div>
  );
}