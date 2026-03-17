import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Typography,
  Link,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "../../context/AuthContext";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    background: "#fff",
    transition: "box-shadow 0.2s ease",
    "&:hover fieldset": { borderColor: "#dc2626" },
    "&.Mui-focused fieldset": { borderColor: "#dc2626", borderWidth: "2px" },
    "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(220,38,38,0.10)" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#dc2626" },
};

const AdminLogin = () => {
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
      const response = await fetch("http://localhost:3000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        login({ token: data.token, user: { ...data.admin, role: "admin" } });
        navigate("/admin/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-red-50/30 to-rose-50 px-4 py-12">

      {/* Background blobs */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-red-100/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-rose-100/40 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative"
      >

        {/* Brand mark */}
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

        {/* Card */}
        <motion.div
          whileHover={{
            boxShadow: "0 20px 60px rgba(220,38,38,0.12), 0 4px 16px rgba(0,0,0,0.06)",
          }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
          style={{ boxShadow: "0 8px 40px rgba(220,38,38,0.08), 0 2px 8px rgba(0,0,0,0.04)" }}
        >
          {/* Red accent bar — distinguishes admin from NGO/donor flows */}
          <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-rose-500 to-orange-400" />

          <div className="px-8 py-8">

            {/* Header */}
            <div className="flex items-start gap-3 mb-7">
              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 border border-red-100">
                <AdminPanelSettingsIcon sx={{ color: "#dc2626", fontSize: 22 }} aria-hidden="true" />
              </div>
              <div>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: "#1a1a2e", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.2 }}
                >
                  Admin Portal
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                  Restricted access — authorised personnel only
                </Typography>
              </div>
            </div>

            {/* Restricted access notice */}
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-6">
              <AdminPanelSettingsIcon sx={{ color: "#dc2626", fontSize: 17, mt: 0.15, flexShrink: 0 }} />
              <p className="text-xs text-red-700 leading-relaxed">
                This portal is for MealConnect administrators only. Unauthorised access attempts are
                logged and monitored.
              </p>
            </div>

            {/* Error */}
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
            <form onSubmit={handleSubmit} noValidate aria-label="Admin login form">
              <div className="flex flex-col gap-4">

                <TextField
                  label="Admin Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  required
                  fullWidth
                  size="small"
                  autoComplete="email"
                  inputProps={{ "aria-label": "Admin email address" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ fontSize: 17, color: "#dc2626" }} />
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
                        <LockOutlinedIcon sx={{ fontSize: 17, color: "#dc2626" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((v) => !v)}
                          edge="end"
                          size="small"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword
                            ? <VisibilityOffOutlinedIcon sx={{ fontSize: 17, color: "#94a3b8" }} />
                            : <VisibilityOutlinedIcon sx={{ fontSize: 17, color: "#94a3b8" }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />

                {/* Submit */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  aria-label="Sign in to admin portal"
                  sx={{
                    mt: 0.5,
                    py: 1.35,
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                    fontWeight: 700,
                    fontSize: "0.92rem",
                    letterSpacing: "0.02em",
                    textTransform: "none",
                    boxShadow: "0 4px 14px rgba(220,38,38,0.35)",
                    transition: "all 0.25s ease",
                    "&:hover:not(:disabled)": {
                      background: "linear-gradient(135deg, #b91c1c, #991b1b)",
                      boxShadow: "0 6px 20px rgba(220,38,38,0.45)",
                      transform: "translateY(-1px)",
                    },
                    "&:active": { transform: "translateY(0)" },
                    "&.Mui-disabled": {
                      background: "linear-gradient(135deg, #fca5a5, #fbb6b6)",
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

                {/* Back link */}
                <div className="flex justify-center mt-1">
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    aria-label="Back to login options"
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#dc2626] transition-colors duration-200"
                  >
                    <ArrowBackIcon sx={{ fontSize: 15 }} />
                    Back to login options
                  </button>
                </div>

              </div>
            </form>
          </div>
        </motion.div>

        {/* Footer */}
        <Typography
          variant="caption"
          display="block"
          align="center"
          sx={{ mt: 3, color: "#94a3b8" }}
        >
          Protected access ·{" "}
          <Link href="#" underline="hover" sx={{ color: "#94a3b8" }}>
            Privacy Policy
          </Link>
        </Typography>

      </motion.div>
    </div>
  );
};

export default AdminLogin;