import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { API_ORIGIN } from "../services/apiBase";

const fontLink = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');`;

function StrengthBar({ password }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["#e2e8f0", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="flex flex-col gap-1.5 mt-1"
    >
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: i <= score ? colors[score] : "#e2e8f0" }} />
        ))}
      </div>
      <p className="text-xs font-medium" style={{ color: colors[score] }}>
        {labels[score]} password
      </p>
    </motion.div>
  );
}

function PasswordField({ label, value, onChange, placeholder = "••••••••" }) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg viewBox="0 0 20 20" fill="none" stroke="#94a3b8" strokeWidth="1.6" width="16" height="16">
            <rect x="3" y="8" width="14" height="10" rx="2" />
            <path d="M7 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
          </svg>
        </div>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="new-password"
          className="w-full pl-10 pr-11 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-200"
          style={{
            background: "#f8faff",
            border: "1.5px solid #e2e8f0",
            fontFamily: "'DM Sans', sans-serif",
          }}
          onFocus={e => { e.target.style.borderColor = "#3b5bdb"; e.target.style.boxShadow = "0 0 0 3px rgba(59,91,219,0.1)"; e.target.style.background = "#fff"; }}
          onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; e.target.style.background = "#f8faff"; }}
        />
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          {show ? (
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" width="17" height="17">
              <path d="M17.94 10c-1.43 2.94-4.17 5-7.94 5S3.49 12.94 2.06 10C3.49 7.06 6.23 5 10 5s6.51 2.06 7.94 5z" strokeLinecap="round" />
              <circle cx="10" cy="10" r="2.5" />
              <path d="m2 2 16 16" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" width="17" height="17">
              <path d="M17.94 10c-1.43 2.94-4.17 5-7.94 5S3.49 12.94 2.06 10C3.49 7.06 6.23 5 10 5s6.51 2.06 7.94 5z" strokeLinecap="round" />
              <circle cx="10" cy="10" r="2.5" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState(location.state?.otp || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const hasStateEmail = !!location.state?.email;
  const hasStateOtp = !!location.state?.otp;

  const passwordsMatch = confirm && newPassword === confirm;
  const passwordsMismatch = confirm && newPassword !== confirm;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const cleanEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!/^\d{6}$/.test(String(otp).trim())) {
      setError("OTP must be 6 digits.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_ORIGIN}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, otp: String(otp).trim(), newPassword }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Reset failed");
      setSuccess(json.message || "Password reset successful!");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{fontLink}</style>
      <div
        className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 40%, #f5f7ff 100%)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Blobs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-40"
            style={{ background: "radial-gradient(circle, #c7d7ff 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, #a5c0ff 0%, transparent 70%)", filter: "blur(80px)" }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "radial-gradient(circle, #1d4ed8 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-[460px]"
        >
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #3b5bdb, #1d4ed8)" }}>
              <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
                <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800 tracking-tight leading-none">
                Meal<span style={{ color: "#3b5bdb" }}>Connect</span>
              </p>
              <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] mt-0.5">Nourishing Communities</p>
            </div>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(59,91,219,0.12)",
              boxShadow: "0 20px 60px rgba(59,91,219,0.12), 0 4px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #3b5bdb, #4f46e5, #818cf8)" }} />

            {/* Success overlay */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-8 py-14 flex flex-col items-center text-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                    style={{ background: "linear-gradient(135deg, #dcfce7, #bbf7d0)" }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5" width="36" height="36" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    Password Reset!
                  </h2>
                  <p className="text-sm text-gray-500 mb-1">{success}</p>
                  <p className="text-xs text-gray-400">Redirecting you to login…</p>
                  <div className="mt-4 flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-green-400"
                        style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!success && (
              <div className="px-8 py-9">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-8">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.25, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-md"
                    style={{ background: "linear-gradient(135deg, #eff3ff, #dbeafe)" }}
                  >
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#3b5bdb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      <circle cx="12" cy="16" r="1" fill="#3b5bdb" />
                    </svg>
                  </motion.div>
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    New <span style={{ color: "#3b5bdb", fontStyle: "italic" }}>password</span>
                  </h1>
                  <p className="text-sm text-gray-500">
                    Choose a strong password for{" "}
                    {hasStateEmail
                      ? <strong className="text-gray-700">{location.state.email}</strong>
                      : "your account"
                    }
                  </p>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      key="err"
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-5 overflow-hidden"
                    >
                      <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm"
                        style={{ background: "#fff5f5", border: "1px solid #fecaca", color: "#b91c1c" }}>
                        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" className="mt-0.5 flex-shrink-0">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        {error}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={submit} className="flex flex-col gap-4">
                  {/* Email (only if no state) */}
                  {!hasStateEmail && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg viewBox="0 0 20 20" fill="none" stroke="#94a3b8" strokeWidth="1.6" width="16" height="16">
                            <rect x="2" y="4" width="16" height="12" rx="2" />
                            <path d="m18 6-7.17 4.56a1.6 1.6 0 0 1-1.66 0L2 6" />
                          </svg>
                        </div>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-200"
                          style={{ background: "#f8faff", border: "1.5px solid #e2e8f0", fontFamily: "'DM Sans', sans-serif" }}
                          onFocus={e => { e.target.style.borderColor = "#3b5bdb"; e.target.style.boxShadow = "0 0 0 3px rgba(59,91,219,0.1)"; e.target.style.background = "#fff"; }}
                          onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; e.target.style.background = "#f8faff"; }}
                        />
                      </div>
                    </div>
                  )}

                  {/* OTP (only if no state) */}
                  {!hasStateOtp && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">OTP</label>
                      <input
                        type="text" value={otp}
                        onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="6-digit OTP"
                        inputMode="numeric"
                        className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 text-center tracking-[0.4em] font-bold"
                        style={{ background: "#f8faff", border: "1.5px solid #e2e8f0", fontFamily: "'DM Sans', sans-serif" }}
                        onFocus={e => { e.target.style.borderColor = "#3b5bdb"; e.target.style.boxShadow = "0 0 0 3px rgba(59,91,219,0.1)"; e.target.style.background = "#fff"; }}
                        onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; e.target.style.background = "#f8faff"; }}
                      />
                    </div>
                  )}

                  {/* New password */}
                  <PasswordField
                    label="New Password"
                    value={newPassword}
                    onChange={e => { setNewPassword(e.target.value); if (error) setError(""); }}
                    placeholder="Min. 8 characters"
                  />
                  <StrengthBar password={newPassword} />

                  {/* Confirm password */}
                  <div className="flex flex-col gap-1">
                    <PasswordField
                      label="Confirm Password"
                      value={confirm}
                      onChange={e => { setConfirm(e.target.value); if (error) setError(""); }}
                    />
                    <AnimatePresence>
                      {passwordsMismatch && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="text-xs text-red-500 flex items-center gap-1 mt-1">
                          <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" /></svg>
                          Passwords do not match
                        </motion.p>
                      )}
                      {passwordsMatch && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="text-xs text-green-600 flex items-center gap-1 mt-1">
                          <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                          Passwords match
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ translateY: -2, boxShadow: "0 10px 28px rgba(59,91,219,0.45)" }}
                    whileTap={{ translateY: 0 }}
                    className="w-full py-3.5 rounded-xl text-white text-sm font-bold tracking-wide flex items-center justify-center gap-2 mt-2 transition-all duration-200"
                    style={{
                      background: loading ? "#93a8f4" : "linear-gradient(135deg, #3b5bdb, #4f46e5)",
                      boxShadow: "0 4px 16px rgba(59,91,219,0.35)",
                      cursor: loading ? "not-allowed" : "pointer",
                      border: "none",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin" viewBox="0 0 24 24" fill="none" width="16" height="16">
                          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        Resetting…
                      </>
                    ) : (
                      <>
                        Reset Password
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                          <path d="M3 10h14M10 3l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </>
                    )}
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
                    style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                      <path d="M17 10H3M10 17l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Start over
                  </button>
                </form>
              </div>
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-xs text-gray-400 mt-5 flex items-center justify-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Secured with end-to-end encryption · MealConnect
          </motion.p>
        </motion.div>

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
        `}</style>
      </div>
    </>
  );
}