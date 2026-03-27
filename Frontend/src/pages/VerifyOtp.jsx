import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { API_ORIGIN } from "../services/apiBase";

// MUI
import {
  TextField, Button, Alert, CircularProgress,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: "#fff",
    fontSize: "0.9rem",
    transition: "box-shadow 0.2s ease",
    "&:hover fieldset": { borderColor: "#2563eb" },
    "&.Mui-focused fieldset": { borderColor: "#2563eb", borderWidth: "2px" },
    "&.Mui-focused": { boxShadow: "0 0 0 4px rgba(37,99,235,0.10)" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#2563eb" },
  "& .MuiInputLabel-root": { fontSize: "0.88rem" },
};

/* ── Single OTP digit box ── */
function OtpBox({ value, onChange, onKeyDown, onPaste, inputRef, index }) {
  return (
    <motion.input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 + index * 0.05, duration: 0.35 }}
      className="w-12 h-14 text-center text-xl font-black text-[#0f172a] rounded-2xl border-2 outline-none transition-all duration-200 select-none"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        borderColor: value ? "#2563eb" : "#e2e8f0",
        background: value ? "#eff6ff" : "#fff",
        boxShadow: value
          ? "0 0 0 3px rgba(37,99,235,0.12)"
          : "0 2px 4px rgba(0,0,0,0.04)",
      }}
    />
  );
}

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || "";

  const [email, setEmail] = useState(emailFromState);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  const refs = Array.from({ length: 6 }, () => useRef(null));
  const otp = digits.join("");

  const updateDigit = (idx, val) => {
    const d = [...digits];
    d[idx] = val.replace(/\D/g, "").slice(0, 1);
    setDigits(d);
    if (val && idx < 5) refs[idx + 1].current?.focus();
    if (error) setError("");
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      refs[idx - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const d = [...digits];
    pasted.split("").forEach((ch, i) => { if (i < 6) d[i] = ch; });
    setDigits(d);
    const nextEmpty = d.findIndex((v) => !v);
    refs[nextEmpty === -1 ? 5 : nextEmpty].current?.focus();
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim();
    if (!emailFromState && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
      setError("Enter a valid email address");
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter all 6 digits of the OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_ORIGIN}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, otp }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "OTP verification failed");
      navigate("/reset-password", { state: { email: cleanEmail, otp } });
    } catch (err) {
      setError(err.message || "Something went wrong");
      setDigits(["", "", "", "", "", ""]);
      refs[0].current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMsg("");
    setError("");
    setResending(true);
    try {
      const res = await fetch(`${API_ORIGIN}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed");
      setResendMsg("New OTP sent! Check your inbox.");
      setDigits(["", "", "", "", "", ""]);
      refs[0].current?.focus();
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
      `}</style>

      <div
        className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 40%, #eff6ff 70%, #f0fdf4 100%)" }}
      >
        {/* Blobs */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-40"
            style={{ background: "radial-gradient(circle, #bfdbfe, transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, #c7d2fe, transparent 70%)", filter: "blur(70px)" }} />
        </div>
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
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #1d4ed8, #3b82f6)" }}>
              <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
                <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-black text-[#0f172a] tracking-tight leading-none"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Meal<span className="text-[#2563eb]">Connect</span>
              </p>
              <p className="text-[9px] text-[#94a3b8] uppercase tracking-[0.2em] mt-0.5"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>Nourishing Communities</p>
            </div>
          </motion.div>

          {/* Card */}
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
            <div className="h-1 w-full"
              style={{ background: "linear-gradient(90deg, #1d4ed8, #3b82f6, #06b6d4)" }} />

            <div className="px-8 py-9">

              {/* Icon + Heading */}
              <div className="flex flex-col items-center text-center mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.25, duration: 0.5, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
                  style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)" }}
                >
                  <MarkEmailReadOutlinedIcon sx={{ fontSize: 32, color: "#2563eb" }} />
                </motion.div>

                <h1 className="text-[1.85rem] font-black text-[#0f172a] leading-tight mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Check your inbox
                </h1>
                <p className="text-sm text-[#64748b] leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  We've sent a 6‑digit OTP to{" "}
                  <span className="font-semibold text-[#0f172a]">
                    {emailFromState || "your email"}
                  </span>
                </p>
              </div>

              {/* Alerts */}
              <AnimatePresence>
                {error && (
                  <motion.div key="err"
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <Alert severity="error" icon={<ErrorOutlineIcon fontSize="small" />}
                      sx={{ borderRadius: "12px", fontSize: "0.82rem", border: "1px solid #fecaca", background: "#fff5f5" }}>
                      {error}
                    </Alert>
                  </motion.div>
                )}
                {resendMsg && (
                  <motion.div key="resend"
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <Alert severity="success"
                      sx={{ borderRadius: "12px", fontSize: "0.82rem", border: "1px solid #bbf7d0", background: "#f0fdf4" }}>
                      {resendMsg}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={submit} noValidate>
                {/* Email field — only if not passed via state */}
                {!emailFromState && (
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="mb-5"
                  >
                    <TextField
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      fullWidth size="small"
                      autoComplete="email"
                      sx={inputSx}
                    />
                  </motion.div>
                )}

                {/* OTP digit boxes */}
                <div className="mb-2">
                  <p className="text-xs font-semibold text-[#64748b] mb-3 tracking-wide"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    ENTER OTP CODE
                  </p>
                  <div className="flex justify-between gap-2">
                    {digits.map((d, i) => (
                      <OtpBox
                        key={i}
                        index={i}
                        value={d}
                        inputRef={refs[i]}
                        onChange={(e) => updateDigit(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onPaste={handlePaste}
                      />
                    ))}
                  </div>
                </div>

                {/* Expiry note */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  className="text-xs text-[#94a3b8] text-center mb-6 mt-3"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  OTP expires in <span className="font-semibold text-[#f59e0b]">5 minutes</span>
                </motion.p>

                {/* Submit */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.35 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading || otp.length < 6}
                    endIcon={!loading && <ArrowForwardIcon sx={{ fontSize: 18 }} />}
                    sx={{
                      py: 1.5,
                      borderRadius: "14px",
                      background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                      fontWeight: 700,
                      fontSize: "0.92rem",
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
                        Verifying…
                      </span>
                    ) : "Verify OTP"}
                  </Button>
                </motion.div>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, #e2e8f0)" }} />
                <span className="text-[11px] text-[#94a3b8] font-medium tracking-wider uppercase"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>or</span>
                <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, #e2e8f0, transparent)" }} />
              </div>

              {/* Resend + Back */}
              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors disabled:opacity-50"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {resending
                    ? <CircularProgress size={13} sx={{ color: "#2563eb" }} />
                    : <RefreshIcon sx={{ fontSize: 16 }} />}
                  {resending ? "Resending…" : "Resend OTP"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="group flex items-center gap-2 text-sm font-medium text-[#64748b] hover:text-[#2563eb] transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <ArrowBackIcon sx={{ fontSize: 16 }} className="group-hover:-translate-x-1 transition-transform" />
                  Back
                </button>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
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