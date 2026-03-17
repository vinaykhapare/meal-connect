import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

// MUI Joy
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import Alert from "@mui/joy/Alert";

// Icons
import LoginIcon from "@mui/icons-material/Login";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ErrorIcon from "@mui/icons-material/Error";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function UserLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData]     = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://127.0.0.1:3000/api/donor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password.trim(),
        }),
      });
      const data = await response.json();
      if (data.success) {
        login(data);
        navigate("/");
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Sora:wght@300;400;500;600;700&display=swap');
      `}</style>

      <div className="relative min-h-screen bg-slate-50 flex items-center justify-center px-4 overflow-hidden">

        {/* ── Background blobs ── */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-blue-100/50 blur-[110px]" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-blue-50/70 blur-[90px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-md"
        >
          {/* ── Card ── */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-blue-100/30 overflow-hidden">

            {/* Top gradient bar */}
            <div
              className="h-1.5 w-full"
              style={{ background: "linear-gradient(90deg, #3b82f6, #1d4ed8)" }}
            />

            <div className="px-8 py-8">

              {/* ── Header ── */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.45 }}
                className="flex flex-col items-center gap-3 mb-8 text-center"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
                >
                  <PersonIcon sx={{ color: "white", fontSize: 22 }} />
                </div>

                <div>
                  <Chip
                    variant="soft"
                    color="primary"
                    size="sm"
                    sx={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", mb: 1 }}
                  >
                    Donor Portal
                  </Chip>
                  <h1
                    className="text-2xl font-black text-slate-800 leading-tight"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Welcome{" "}
                    <span
                      className="italic text-transparent bg-clip-text"
                      style={{ backgroundImage: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
                    >
                      back
                    </span>
                  </h1>
                  <p
                    className="text-xs text-slate-400 mt-1"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    Sign in to your MealConnect account
                  </p>
                </div>
              </motion.div>

              {/* ── Error alert ── */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-5"
                  >
                    <Alert
                      color="danger"
                      size="sm"
                      startDecorator={<ErrorIcon sx={{ fontSize: 16 }} />}
                      endDecorator={
                        <button
                          onClick={() => setError("")}
                          className="opacity-60 hover:opacity-100 transition-opacity text-xs"
                        >
                          ✕
                        </button>
                      }
                      sx={{ borderRadius: "12px", fontSize: "0.8rem" }}
                    >
                      {error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Form ── */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <FormControl required>
                    <FormLabel sx={{ fontSize: "0.78rem", fontWeight: 600, color: "text.secondary", mb: 0.5 }}>
                      Email Address
                    </FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      startDecorator={<EmailIcon sx={{ fontSize: 17, color: "#94a3b8" }} />}
                      sx={{
                        borderRadius: "12px",
                        "--Input-focusedThickness": "2px",
                        fontSize: "0.9rem",
                      }}
                    />
                  </FormControl>
                </motion.div>

                {/* Password */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.4 }}
                >
                  <FormControl required>
                    <div className="flex items-center justify-between mb-1">
                      <FormLabel sx={{ fontSize: "0.78rem", fontWeight: 600, color: "text.secondary", mb: 0 }}>
                        Password
                      </FormLabel>
                      <a
                        href="/forgot-password"
                        className="text-[11px] text-blue-500 hover:text-blue-700 no-underline font-medium transition-colors"
                        style={{ fontFamily: "'Sora', sans-serif" }}
                      >
                        Forgot password?
                      </a>
                    </div>
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      startDecorator={<LockIcon sx={{ fontSize: 17, color: "#94a3b8" }} />}
                      endDecorator={
                        <button
                          type="button"
                          onClick={() => setShowPassword(v => !v)}
                          className="text-slate-400 hover:text-blue-500 transition-colors p-0.5"
                        >
                          {showPassword
                            ? <VisibilityOffIcon sx={{ fontSize: 17 }} />
                            : <VisibilityIcon sx={{ fontSize: 17 }} />
                          }
                        </button>
                      }
                      sx={{
                        borderRadius: "12px",
                        "--Input-focusedThickness": "2px",
                        fontSize: "0.9rem",
                      }}
                    />
                  </FormControl>
                </motion.div>

                {/* Submit */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.36, duration: 0.4 }}
                  className="mt-1"
                >
                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    loading={loading}
                    endDecorator={!loading && <ArrowForwardIcon sx={{ fontSize: 18 }} />}
                    sx={{
                      borderRadius: "14px",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      py: 1.5,
                      background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                      boxShadow: "0 4px 20px rgba(37,99,235,0.35)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                        boxShadow: "0 8px 28px rgba(37,99,235,0.45)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.2s",
                      fontFamily: "'Sora', sans-serif",
                    }}
                  >
                    {loading ? "Signing in…" : "Sign In"}
                  </Button>
                </motion.div>

              </form>

              {/* ── Divider ── */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[11px] text-slate-400 font-medium"
                  style={{ fontFamily: "'Sora', sans-serif" }}>
                  or
                </span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              {/* ── Register nudge ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col gap-2"
              >
                <p className="text-center text-xs text-slate-400"
                  style={{ fontFamily: "'Sora', sans-serif" }}>
                  Don&apos;t have an account?{" "}
                  <a
                    href="/signup"
                    className="text-blue-500 font-semibold hover:text-blue-700 no-underline transition-colors"
                  >
                    Create one free
                  </a>
                </p>
                <p className="text-center text-xs text-slate-400"
                  style={{ fontFamily: "'Sora', sans-serif" }}>
                  Are you an NGO?{" "}
                  <a
                    href="/ngo-login"
                    className="text-emerald-500 font-semibold hover:text-emerald-700 no-underline transition-colors"
                  >
                    NGO Login →
                  </a>
                </p>
              </motion.div>

            </div>
          </div>

          {/* ── Trust badge ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 mt-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <p className="text-xs text-slate-400" style={{ fontFamily: "'Sora', sans-serif" }}>
              Secure login · MealConnect Platform
            </p>
          </motion.div>

        </motion.div>
      </div>
    </>
  );
}

export default UserLogin;