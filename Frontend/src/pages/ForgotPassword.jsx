import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { API_ORIGIN } from "../services/apiBase";

// MUI
import {
  TextField, Button, Alert, InputAdornment, CircularProgress,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LockResetIcon from "@mui/icons-material/LockReset";

/* ── Shared input style matching MealConnect blue theme ── */
const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: "#fff",
    fontSize: "0.9rem",
    transition: "box-shadow 0.2s ease, border-color 0.2s ease",
    "&:hover fieldset": { borderColor: "#2563eb" },
    "&.Mui-focused fieldset": { borderColor: "#2563eb", borderWidth: "2px" },
    "&.Mui-focused": { boxShadow: "0 0 0 4px rgba(37,99,235,0.10)" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#2563eb" },
  "& .MuiInputLabel-root": { fontSize: "0.88rem" },
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_ORIGIN}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to send OTP");
      setSuccess(json.message || "OTP sent successfully");
      setTimeout(() => navigate("/verify-otp", { state: { email: email.trim() } }), 1200);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
      `}</style>

      {/* ── Full-page background matching MealConnect ── */}
      <div
        className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 40%, #eff6ff 70%, #f0fdf4 100%)" }}
      >
        {/* Decorative blobs — same as homepage */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-40"
            style={{ background: "radial-gradient(circle, #bfdbfe, transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, #c7d2fe, transparent 70%)", filter: "blur(70px)" }} />
          <div className="absolute top-1/2 left-1/4 w-72 h-72 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #a5f3fc, transparent 70%)", filter: "blur(50px)" }} />
        </div>

        {/* Subtle grid pattern overlay */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(#1e40af 1px, transparent 1px), linear-gradient(90deg, #1e40af 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }} />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md relative z-10"
        >
          {/* ── Brand mark ── */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #1d4ed8, #3b82f6)" }}>
              <svg viewBox="0 0 24 24" fill="white" width="18" height="18" aria-hidden="true">
                <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-black text-[#0f172a] tracking-tight leading-none"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Meal<span className="text-[#2563eb]">Connect</span>
              </p>
              <p className="text-[9px] text-[#94a3b8] uppercase tracking-[0.2em] mt-0.5"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Nourishing Communities
              </p>
            </div>
          </motion.div>

          {/* ── Card ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden"
            style={{
              border: "1px solid rgba(255,255,255,0.9)",
              boxShadow: "0 20px 60px rgba(37,99,235,0.10), 0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
            }}
          >
            {/* Top accent gradient bar */}
            <div className="h-1 w-full"
              style={{ background: "linear-gradient(90deg, #1d4ed8, #3b82f6, #06b6d4)" }} />

            <div className="px-8 py-9">

              {/* ── Icon + Heading ── */}
              <div className="flex flex-col items-center text-center mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.25, duration: 0.5, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
                  style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)" }}
                >
                  <LockResetIcon sx={{ fontSize: 32, color: "#2563eb" }} />
                </motion.div>

                <h1 className="text-[1.85rem] font-black text-[#0f172a] leading-tight mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Forgot your password?
                </h1>
                <p className="text-sm text-[#64748b] leading-relaxed max-w-xs"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  No worries. Enter your account email and we'll send a 6‑digit OTP valid for{" "}
                  <span className="font-semibold text-[#2563eb]">5 minutes</span>.
                </p>
              </div>

              {/* ── Alerts ── */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    key="err"
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <Alert
                      severity="error"
                      icon={<ErrorOutlineIcon fontSize="small" />}
                      sx={{
                        borderRadius: "12px",
                        fontSize: "0.82rem",
                        border: "1px solid #fecaca",
                        background: "#fff5f5",
                        "& .MuiAlert-icon": { color: "#ef4444" },
                      }}
                    >
                      {error}
                    </Alert>
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    key="ok"
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <Alert
                      severity="success"
                      icon={<CheckCircleOutlineIcon fontSize="small" />}
                      sx={{
                        borderRadius: "12px",
                        fontSize: "0.82rem",
                        border: "1px solid #bbf7d0",
                        background: "#f0fdf4",
                      }}
                    >
                      {success}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Form ── */}
              <form onSubmit={submit} noValidate>
                <div className="flex flex-col gap-5">
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <TextField
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                      required
                      fullWidth
                      size="small"
                      autoComplete="email"
                      placeholder="you@example.com"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon sx={{ fontSize: 18, color: "#2563eb" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputSx}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.38, duration: 0.4 }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading || !!success}
                      endIcon={!loading && <ArrowForwardIcon sx={{ fontSize: 18 }} />}
                      sx={{
                        py: 1.5,
                        borderRadius: "14px",
                        background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                        fontWeight: 700,
                        fontSize: "0.92rem",
                        letterSpacing: "0.01em",
                        textTransform: "none",
                        fontFamily: "'DM Sans', sans-serif",
                        boxShadow: "0 4px 20px rgba(37,99,235,0.35)",
                        transition: "all 0.25s ease",
                        "&:hover:not(:disabled)": {
                          background: "linear-gradient(135deg, #1e40af, #2563eb)",
                          boxShadow: "0 8px 28px rgba(37,99,235,0.45)",
                          transform: "translateY(-2px)",
                        },
                        "&:active": { transform: "translateY(0)" },
                        "&.Mui-disabled": {
                          background: "linear-gradient(135deg, #93c5fd, #bfdbfe)",
                          color: "#fff",
                          boxShadow: "none",
                        },
                      }}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <CircularProgress size={15} thickness={5} sx={{ color: "rgba(255,255,255,0.85)" }} />
                          Sending OTP…
                        </span>
                      ) : success ? "OTP Sent ✓" : "Send OTP"}
                    </Button>
                  </motion.div>
                </div>
              </form>

              {/* ── Divider ── */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, #e2e8f0)" }} />
                <span className="text-[11px] text-[#94a3b8] font-medium tracking-wider uppercase"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>or</span>
                <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, #e2e8f0, transparent)" }} />
              </div>

              {/* ── Back to login ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center"
              >
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="group flex items-center gap-2 text-sm font-medium text-[#64748b] hover:text-[#2563eb] transition-colors duration-200"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <ArrowBackIcon
                    sx={{ fontSize: 16, transition: "transform 0.2s" }}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  Back to login
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* ── Footer note ── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-xs text-[#94a3b8] mt-5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            🔒 Secure · End-to-end encrypted · MealConnect Platform
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}