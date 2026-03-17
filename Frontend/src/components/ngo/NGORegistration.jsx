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
  Dialog,
  DialogContent,
  Divider,
  Link,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import VerifiedIcon from "@mui/icons-material/Verified";
import BusinessIcon from "@mui/icons-material/Business";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

/* ─── shared MUI TextField style ─── */
const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    background: "#fff",
    transition: "box-shadow 0.2s ease",
    "&:hover fieldset": { borderColor: "#3b5bdb" },
    "&.Mui-focused fieldset": { borderColor: "#3b5bdb", borderWidth: "2px" },
    "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(59,91,219,0.12)" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#3b5bdb" },
};

/* ─── Section header ─── */
function SectionHeading({ icon: Icon, label, step, total }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
        <Icon sx={{ fontSize: 17, color: "#3b5bdb" }} aria-hidden="true" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-700 leading-none">{label}</p>
      </div>
      {step && (
        <span className="text-xs text-gray-400 font-medium">
          {step} / {total}
        </span>
      )}
    </div>
  );
}

/* ─── Thin field icon ─── */
function FIcon({ icon: Icon }) {
  return <Icon sx={{ fontSize: 17, color: "#3b5bdb" }} />;
}

const INITIAL = {
  name: "",
  email: "",
  ngoDarpanID: "",
  location: "",
  description: "",
  pincode: "",
  leader: { name: "", phone: "", email: "" },
  password: "",
};

export default function NGORegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (error) setError("");
    if (name.startsWith("leader.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({ ...prev, leader: { ...prev.leader, [field]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://127.0.0.1:3000/api/receiver/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          pincode: String(formData.pincode),
          leader: {
            ...formData.leader,
          },
        }),
      });
      const data = await response.json();
      if (data.success) {
        setShowSuccessModal(true);
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50 px-4 py-12">

      {/* Background blobs */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-100/50 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-xl relative"
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
          whileHover={{ boxShadow: "0 20px 60px rgba(59,91,219,0.14), 0 4px 16px rgba(0,0,0,0.06)" }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
          style={{ boxShadow: "0 8px 40px rgba(59,91,219,0.09), 0 2px 8px rgba(0,0,0,0.04)" }}
        >
          {/* Accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#3b5bdb] via-[#4f46e5] to-[#6366f1]" />

          <div className="px-8 py-8">

            {/* Header */}
            <div className="flex items-start gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100">
                <VerifiedIcon sx={{ color: "#3b5bdb", fontSize: 22 }} aria-hidden="true" />
              </div>
              <div>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: "#1a1a2e", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.2 }}
                >
                  Register your NGO
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                  Submit for admin verification to start receiving food donations
                </Typography>
              </div>
            </div>

            {/* Verification notice */}
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-6">
              <VerifiedIcon sx={{ color: "#f59e0b", fontSize: 18, mt: 0.1, flexShrink: 0 }} />
              <p className="text-xs text-amber-700 leading-relaxed">
                All NGO registrations require admin verification. You'll be able to log in once your
                credentials are reviewed and approved.
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
            <form onSubmit={handleSubmit} noValidate aria-label="NGO registration form">
              <div className="flex flex-col gap-5">

                {/* ── Section 1: NGO Details ── */}
                <div className="flex flex-col gap-4">
                  <SectionHeading icon={BusinessIcon} label="NGO Details" step={1} total={3} />
                  <div className="pl-1 flex flex-col gap-4">

                    <TextField
                      label="NGO Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      fullWidth
                      size="small"
                      inputProps={{ "aria-label": "NGO name" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FIcon icon={BusinessIcon} />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputSx}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <TextField
                        label="NGO Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        fullWidth
                        size="small"
                        autoComplete="email"
                        inputProps={{ "aria-label": "NGO email" }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FIcon icon={EmailOutlinedIcon} />
                            </InputAdornment>
                          ),
                        }}
                        sx={inputSx}
                      />
                      <TextField
                        label="NGO Darpan ID"
                        name="ngoDarpanID"
                        value={formData.ngoDarpanID}
                        onChange={handleChange}
                        required
                        fullWidth
                        size="small"
                        inputProps={{ "aria-label": "NGO Darpan ID" }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FIcon icon={BadgeOutlinedIcon} />
                            </InputAdornment>
                          ),
                        }}
                        sx={inputSx}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <TextField
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        fullWidth
                        size="small"
                        inputProps={{ "aria-label": "NGO location" }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FIcon icon={LocationOnOutlinedIcon} />
                            </InputAdornment>
                          ),
                        }}
                        sx={inputSx}
                      />
                      <TextField
                        label="Pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        fullWidth
                        size="small"
                        inputProps={{ "aria-label": "Pincode", maxLength: 6 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FIcon icon={PinDropOutlinedIcon} />
                            </InputAdornment>
                          ),
                        }}
                        sx={inputSx}
                      />
                    </div>

                    <TextField
                      label="Description (optional)"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      multiline
                      minRows={3}
                      inputProps={{ "aria-label": "NGO description" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ mt: "6px", alignSelf: "flex-start" }}>
                            <FIcon icon={NotesOutlinedIcon} />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputSx}
                    />
                  </div>
                </div>

                <Divider sx={{ borderColor: "#f1f5f9" }} />

                {/* ── Section 2: Leader Info ── */}
                <div className="flex flex-col gap-4">
                  <SectionHeading icon={PersonOutlinedIcon} label="Leader Information" step={2} total={3} />
                  <div className="pl-1 flex flex-col gap-4">

                    <TextField
                      label="Leader Name"
                      name="leader.name"
                      value={formData.leader.name}
                      onChange={handleChange}
                      required
                      fullWidth
                      size="small"
                      inputProps={{ "aria-label": "Leader name" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FIcon icon={PersonOutlinedIcon} />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputSx}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <TextField
                        label="Leader Phone"
                        name="leader.phone"
                        value={formData.leader.phone}
                        onChange={handleChange}
                        required
                        fullWidth
                        size="small"
                        inputProps={{ "aria-label": "Leader phone", maxLength: 10 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FIcon icon={PhoneOutlinedIcon} />
                            </InputAdornment>
                          ),
                        }}
                        sx={inputSx}
                      />
                      <TextField
                        label="Leader Email"
                        name="leader.email"
                        type="email"
                        value={formData.leader.email}
                        onChange={handleChange}
                        required
                        fullWidth
                        size="small"
                        inputProps={{ "aria-label": "Leader email" }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FIcon icon={EmailOutlinedIcon} />
                            </InputAdornment>
                          ),
                        }}
                        sx={inputSx}
                      />
                    </div>
                  </div>
                </div>

                <Divider sx={{ borderColor: "#f1f5f9" }} />

                {/* ── Section 3: Account Security ── */}
                <div className="flex flex-col gap-4">
                  <SectionHeading icon={LockOutlinedIcon} label="Account Security" step={3} total={3} />
                  <div className="pl-1">
                    <TextField
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      fullWidth
                      size="small"
                      autoComplete="new-password"
                      inputProps={{ "aria-label": "Password" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FIcon icon={LockOutlinedIcon} />
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
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  endIcon={!loading && <ArrowForwardIcon sx={{ fontSize: 17 }} />}
                  aria-label="Submit NGO registration"
                  sx={{
                    mt: 0.5,
                    py: 1.35,
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
                      Submitting…
                    </span>
                  ) : (
                    "Submit Registration"
                  )}
                </Button>

                {/* Back link */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => navigate("/ngo-login")}
                    aria-label="Back to NGO login"
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#3b5bdb] transition-colors duration-200 group"
                  >
                    <ArrowBackIcon sx={{ fontSize: 15 }} />
                    Already registered? Sign in
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
          By registering, you agree to our{" "}
          <Link href="#" underline="hover" sx={{ color: "#94a3b8" }}>Terms</Link>
          {" & "}
          <Link href="#" underline="hover" sx={{ color: "#94a3b8" }}>Privacy Policy</Link>
        </Typography>

      </motion.div>

      {/* ── Success Modal ── */}
      <Dialog
        open={showSuccessModal}
        onClose={() => { setShowSuccessModal(false); navigate("/ngo-login"); }}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            maxWidth: 420,
            width: "100%",
            p: 0,
            overflow: "hidden",
            boxShadow: "0 24px 64px rgba(59,91,219,0.18)",
          },
        }}
        aria-labelledby="success-dialog-title"
        aria-describedby="success-dialog-description"
      >
        {/* Modal accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

        <DialogContent sx={{ px: 4, py: 4 }}>
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center gap-4"
          >
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <CheckCircleOutlineIcon sx={{ color: "#10b981", fontSize: 36 }} aria-hidden="true" />
            </div>

            <div>
              <Typography
                id="success-dialog-title"
                variant="h6"
                fontWeight={700}
                sx={{ color: "#1a1a2e", fontFamily: "'DM Sans', sans-serif" }}
              >
                Registration Submitted!
              </Typography>
              <Typography
                id="success-dialog-description"
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, lineHeight: 1.7 }}
              >
                Your NGO registration has been received. Our team will review your application and
                verify your credentials. You can check your status by attempting to log in once
                verification is complete.
              </Typography>
            </div>

            {/* Steps */}
            <div className="w-full bg-slate-50 rounded-xl border border-slate-100 px-4 py-3 flex flex-col gap-2 text-left">
              {[
                "Application received ✓",
                "Admin review in progress…",
                "Login enabled after approval",
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                      i === 0
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <p className={`text-xs ${i === 0 ? "text-emerald-700 font-medium" : "text-slate-400"}`}>
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <Button
              variant="contained"
              fullWidth
              onClick={() => { setShowSuccessModal(false); navigate("/ngo-login"); }}
              aria-label="Go to NGO login"
              sx={{
                py: 1.3,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #10b981, #059669)",
                fontWeight: 700,
                fontSize: "0.9rem",
                textTransform: "none",
                boxShadow: "0 4px 14px rgba(16,185,129,0.3)",
                transition: "all 0.25s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #059669, #047857)",
                  boxShadow: "0 6px 20px rgba(16,185,129,0.4)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Go to NGO Login
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

