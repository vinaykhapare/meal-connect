import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  Alert,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Select,
  MenuItem,
  Tabs,
  Tab,
  CircularProgress,
  Paper,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HistoryIcon from "@mui/icons-material/History";
import GroupsIcon from "@mui/icons-material/Groups";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import NGOProfile from "./NGOProfile";
import DonationHistory from "./DonationHistory";
import NearbyNGOs from "./NearbyNGOs";
import QRScanner from "./QRScanner";

const API = "http://localhost:3000/api/receiver";
const getToken = () => localStorage.getItem("token");


const tabIndexMap = { overview: 0, profile: 1, history: 2, nearby: 3 };

const TAB_CONFIG = [
  { label: "Overview",         icon: <DashboardIcon sx={{ fontSize: 17 }} /> },
  { label: "My Profile",       icon: <AccountCircleIcon sx={{ fontSize: 17 }} /> },
  { label: "Donation History", icon: <HistoryIcon sx={{ fontSize: 17 }} /> },
  { label: "Nearby NGOs",      icon: <GroupsIcon sx={{ fontSize: 17 }} /> },
];

// const API = "http://localhost:3000/api/receiver";
// const getToken = () => localStorage.getItem("token");



/* ── Status helpers ── */
const statusStyles = {
  Pending:   { bg: "#fef3c7", color: "#92400e", border: "#fde68a" },
  Accepted:  { bg: "#dbeafe", color: "#1e3a8a", border: "#bfdbfe" },
  Completed: { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" },
  Cancelled: { bg: "#fee2e2", color: "#991b1b", border: "#fecaca" },
};

const verificationStyles = {
  Verified: { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" },
  Rejected: { bg: "#fee2e2", color: "#991b1b", border: "#fecaca" },
  Pending:  { bg: "#fef3c7", color: "#92400e", border: "#fde68a" },
};

function StatusChip({ status }) {
  const s = statusStyles[status] || statusStyles.Pending;
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        fontWeight: 600,
        fontSize: "0.72rem",
      }}
    />
  );
}

/* ── Stat card ── */
function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 12px 32px rgba(59,91,219,0.12)" }}
      transition={{ duration: 0.2 }}
      className="flex-1 min-w-[120px]"
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid #f1f5f9",
          p: 2.5,
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          background: "#fff",
          transition: "box-shadow 0.2s ease",
        }}
      >
        <div className="flex items-start justify-between mb-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: accent + "18", border: `1px solid ${accent}30` }}
          >
            <Icon sx={{ fontSize: 18, color: accent }} />
          </div>
        </div>
        <Typography variant="h4" fontWeight={800} sx={{ color: "#1a1a2e", lineHeight: 1 }}>
          {value}
        </Typography>
        <Typography variant="caption" sx={{ color: "#64748b", mt: 0.5, display: "block" }}>
          {label}
        </Typography>
      </Paper>
    </motion.div>
  );
}

function NGODashboard() {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [tabIndex, setTabIndex] = useState(tabParam ? (tabIndexMap[tabParam] ?? 0) : 0);

  const [ngoData, setNgoData]   = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [updating, setUpdating] = useState(false);
  const [accepting, setAccepting] = useState(null); // tracks the donation id being accepted
  const [successMsg, setSuccessMsg] = useState("");
  const [scanQR, setScanQR]     = useState({ open: false, donationId: "", donorName: "" });

  // Extract NGO id from the JWT stored in localStorage
  const ngoId = (() => {
    try {
      const raw = localStorage.getItem("token");
      if (!raw) return null;
      const payload = JSON.parse(atob(raw.split(".")[1]));
      return payload._id ?? null;
    } catch { return null; }
  })();

  useEffect(() => {
    if (tabParam) setTabIndex(tabIndexMap[tabParam] ?? 0);
  }, [tabParam]);

  useEffect(() => {
    fetchNGOStatus();
    fetchNearbyDonations();
  }, []);

  const fetchNGOStatus = async () => {
    try {
      const res = await fetch(`${API}/me`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) setNgoData(data.data.receiver);
    } catch {
      setError("Failed to fetch NGO status");
    }
  };

  

  const fetchNearbyDonations = async () => {
    try {
      const res = await fetch(`${API}/nearby-donations`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) setDonations(data.data);
    } catch {
      setError("Failed to fetch nearby donations");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (donationId, newValue) => {
    if (!newValue) return;
    setUpdating(true);
    try {
      const res = await fetch(`${API}/food-status/${donationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status: newValue }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDonations((prev) =>
          prev.map((d) => (d._id === donationId ? { ...d, status: newValue } : d))
        );
        setSuccessMsg("Status updated successfully");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        throw new Error(data.message || "Failed to update status");
      }
    } catch (err) {
      setError(err.message || "Failed to update status");
      setTimeout(() => setError(""), 3000);
    } finally {
      setUpdating(false);
    }
  };

  const handleQRSuccess = () => {
    setScanQR({ open: false, donationId: "", donorName: "" });
    setSuccessMsg("✅ Donation confirmed via QR scan!");
    setTimeout(() => setSuccessMsg(""), 4000);
    fetchNearbyDonations();
  };

  // Dedicated atomic accept – calls the race-condition-safe endpoint
  const handleAcceptDonation = async (donationId) => {
    setAccepting(donationId);
    try {
      const res = await fetch(`${API}/accept-donation/${donationId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDonations((prev) =>
          prev.map((d) =>
            d._id === donationId
              ? { ...d, status: "Accepted", receiverId: data.data?.receiverId ?? d.receiverId }
              : d
          )
        );
        setSuccessMsg("✅ Donation accepted! You can now scan the donor's QR code.");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setError(data.message || "Failed to accept donation");
        setTimeout(() => setError(""), 4000);
      }
    } catch {
      setError("Network error — could not accept donation");
      setTimeout(() => setError(""), 4000);
    } finally {
      setAccepting(null);
    }
  };

  const vStatus = ngoData?.verificationStatus?.status || "Pending";
  const vStyle  = verificationStyles[vStatus] || verificationStyles.Pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* QR Scanner modal */}
      <QRScanner
        open={scanQR.open}
        donationId={scanQR.donationId}
        donorName={scanQR.donorName}
        onClose={() => setScanQR({ open: false, donationId: "", donorName: "" })}
        onSuccess={handleQRSuccess}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 px-4 py-8 md:px-8">

        {/* Background blobs */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-100/30 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-100/40 blur-3xl" />
        </div>

        <Box sx={{ maxWidth: "1400px", mx: "auto" }}>

          {/* ── Page Header ── */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#3b5bdb] flex items-center justify-center shadow-md shadow-blue-200 flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="white" width="18" height="18" aria-hidden="true">
                  <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
                </svg>
              </div>
            </div>

            <div className="h-8 w-px bg-gray-200 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                <DashboardIcon sx={{ color: "#3b5bdb", fontSize: 20 }} aria-hidden="true" />
              </div>
              <div>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{ color: "#1a1a2e", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.2 }}
                >
                  NGO Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.2 }}>
                  Welcome back,{" "}
                  <strong className="text-gray-700">{ngoData?.name || "…"}</strong>
                </Typography>
              </div>
            </div>

            {/* Verification badge */}
            <div className="ml-auto flex items-center gap-2">
              <Chip
                label={vStatus}
                size="small"
                sx={{
                  background: vStyle.bg,
                  color: vStyle.color,
                  border: `1px solid ${vStyle.border}`,
                  fontWeight: 700,
                  fontSize: "0.75rem",
                }}
                aria-label={`Verification status: ${vStatus}`}
              />
            </div>
          </div>

          {/* ── Alerts ── */}
          <AnimatePresence>
            {successMsg && (
              <motion.div
                key="success"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.22 }}
              >
                <Alert
                  severity="success"
                  icon={<CheckCircleOutlineIcon fontSize="small" />}
                  sx={{ borderRadius: "10px", border: "1px solid #bbf7d0", background: "#f0fdf4", fontSize: "0.83rem" }}
                >
                  {successMsg}
                </Alert>
              </motion.div>
            )}
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.22 }}
              >
                <Alert
                  severity="error"
                  icon={<ErrorOutlineIcon fontSize="small" />}
                  onClose={() => setError("")}
                  sx={{ borderRadius: "10px", border: "1px solid #fecaca", background: "#fff5f5", fontSize: "0.83rem" }}
                  role="alert"
                  aria-live="assertive"
                >
                  {error}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Main card with tabs ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid #f1f5f9",
                overflow: "hidden",
                boxShadow: "0 8px 40px rgba(59,91,219,0.07), 0 2px 8px rgba(0,0,0,0.04)",
                transition: "box-shadow 0.25s ease",
                "&:hover": {
                  boxShadow: "0 16px 56px rgba(59,91,219,0.11), 0 4px 16px rgba(0,0,0,0.05)",
                },
              }}
            >
              {/* Accent bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#3b5bdb] via-[#4f46e5] to-[#6366f1]" />

              {/* Overview content — rendered directly, no tabs */}
              <Box sx={{ borderBottom: "1px solid #f1f5f9", px: 3, pt: 1, background: "#fafafa" }}>
                <Tabs
                  value={tabIndex}
                  onChange={(_, val) => setTabIndex(val)}
                  aria-label="NGO dashboard tabs"
                  TabIndicatorProps={{
                    style: {
                      background: "linear-gradient(90deg, #3b5bdb, #4f46e5)",
                      height: "2.5px",
                      borderRadius: "2px",
                    },
                  }}
                  sx={{ minHeight: 48 }}
                >
                  {TAB_CONFIG.map((tab, i) => (
                    <Tab
                      key={i}
                      icon={tab.icon}
                      iconPosition="start"
                      label={tab.label}
                      aria-label={tab.label}
                      sx={{
                        minHeight: 48,
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.83rem",
                        color: "#64748b",
                        "&.Mui-selected": { color: "#3b5bdb" },
                        "&:hover": {
                          color: "#3b5bdb",
                          background: "rgba(59,91,219,0.04)",
                          borderRadius: "8px 8px 0 0",
                        },
                        transition: "all 0.2s ease",
                      }}
                    />
                  ))}
                </Tabs>
              </Box>

              <Box sx={{ p: { xs: 3, md: 4 } }}>

                {/* ── Tab 0: Overview ── */}
                {tabIndex === 0 && (
                <motion.div
                  key="tab-0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                    {/* Stat cards */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <StatCard
                        label="Total Nearby Donations"
                        value={donations.length}
                        icon={RestaurantIcon}
                        accent="#3b5bdb"
                      />
                      <StatCard
                        label="Pending"
                        value={donations.filter((d) => d.status === "Pending").length}
                        icon={HourglassEmptyIcon}
                        accent="#f59e0b"
                      />
                      <StatCard
                        label="Accepted"
                        value={donations.filter((d) => d.status === "Accepted").length}
                        icon={CheckCircleOutlineIcon}
                        accent="#10b981"
                      />
                    </div>

                    {/* Nearby donations table */}
                    <div className="mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                        <RestaurantIcon sx={{ fontSize: 17, color: "#3b5bdb" }} />
                      </div>
                      <div>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#1a1a2e" }}>
                          Nearby Food Donations
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Donations available in your service area
                        </Typography>
                      </div>
                    </div>

                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <CircularProgress size={32} sx={{ color: "#3b5bdb" }} />
                        <Typography variant="body2" color="text.secondary">
                          Loading nearby donations…
                        </Typography>
                      </div>
                    ) : donations.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-14 gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                          <RestaurantIcon sx={{ color: "#3b5bdb", fontSize: 28 }} />
                        </div>
                        <Typography variant="body2" color="text.secondary">
                          No nearby donations found in your area.
                        </Typography>
                      </div>
                    ) : (
                      <TableContainer
                        sx={{
                          borderRadius: "14px",
                          border: "1px solid #f1f5f9",
                          overflow: "hidden",
                        }}
                      >
                        <Table size="small" aria-label="Nearby food donations">
                          <TableHead>
                            <TableRow sx={{ background: "#f8fafc" }}>
                              {["Donor Name", "Food Type", "Quantity", "Location", "Contact", "Expiry", "Status", "Accept", "Update", "QR"].map((h) => (
                                <TableCell
                                  key={h}
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: "0.72rem",
                                    color: "#64748b",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                    borderBottom: "1px solid #f1f5f9",
                                    py: 1.5,
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {h}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {donations.map((d, idx) => (
                              <TableRow
                                key={d._id}
                                sx={{
                                  background: idx % 2 === 0 ? "#fff" : "#fafafa",
                                  "&:hover": { background: "#f0f4ff" },
                                  transition: "background 0.15s ease",
                                  "&:last-child td": { borderBottom: 0 },
                                }}
                              >
                                <TableCell sx={{ py: 1.5 }}>
                                  <Typography variant="body2" fontWeight={600} sx={{ color: "#1a1a2e" }}>
                                    {d.name}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" color="text.secondary">
                                    {d.foodType || "—"}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" color="text.secondary">
                                    {d.totalCount}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 140, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {d.address || "—"}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "monospace", fontSize: "0.78rem" }}>
                                    {d.phone}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                                    {d.expiryTime}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <StatusChip status={d.status} />
                                </TableCell>
                                {/* Dedicated Accept button — atomic, race-condition safe */}
                                <TableCell sx={{ py: 1 }}>
                                  {d.status === "Pending" ? (
                                    <button
                                      onClick={() => handleAcceptDonation(d._id)}
                                      disabled={accepting === d._id}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 5,
                                        padding: "5px 12px",
                                        borderRadius: 8,
                                        border: "1px solid #bbf7d0",
                                        background: accepting === d._id ? "#f0fdf4" : "linear-gradient(135deg,#f0fdf4,#dcfce7)",
                                        color: "#166534",
                                        fontSize: "0.72rem",
                                        fontWeight: 700,
                                        cursor: accepting === d._id ? "not-allowed" : "pointer",
                                        opacity: accepting === d._id ? 0.7 : 1,
                                        whiteSpace: "nowrap",
                                        transition: "all 0.15s ease",
                                      }}
                                      aria-label={`Accept donation from ${d.name}`}
                                    >
                                      {accepting === d._id ? "Accepting…" : "✓ Accept"}
                                    </button>
                                  ) : (
                                    <span style={{ color: "#cbd5e1", fontSize: "0.72rem" }}>—</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Select
                                    value={d.status}
                                    onChange={(e) => handleStatusUpdate(d._id, e.target.value)}
                                    size="small"
                                    disabled={updating || d.status === "Pending" || d.status === "Completed" || d.status === "Cancelled"}
                                    aria-label={`Update status for donation from ${d.name}`}
                                    sx={{
                                      minWidth: 120,
                                      borderRadius: "8px",
                                      fontSize: "0.78rem",
                                      fontWeight: 600,
                                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" },
                                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#3b5bdb" },
                                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#3b5bdb" },
                                    }}
                                  >
                                    <MenuItem value="Pending" disabled>Pending</MenuItem>
                                    <MenuItem value="Accepted" disabled>Accepted</MenuItem>
                                    <MenuItem value="Completed">Mark Complete</MenuItem>
                                    <MenuItem value="Cancelled">Cancel</MenuItem>
                                  </Select>
                                </TableCell>
                                {/* Scan QR — visible only when this NGO accepted the donation */}
                                <TableCell sx={{ py: 1 }}>
                                  {d.status === "Accepted" &&
                                   d.receiverId &&
                                   (d.receiverId === ngoId ||
                                    d.receiverId?._id === ngoId ||
                                    String(d.receiverId) === String(ngoId)) ? (
                                    <button
                                      onClick={() =>
                                        setScanQR({ open: true, donationId: d._id, donorName: d.name })
                                      }
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 5,
                                        padding: "5px 12px",
                                        borderRadius: 8,
                                        border: "1px solid #c7d2fe",
                                        background: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
                                        color: "#3730a3",
                                        fontSize: "0.72rem",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                        transition: "all 0.15s ease",
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "linear-gradient(135deg,#e0e7ff,#c7d2fe)";
                                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(99,102,241,0.25)";
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "linear-gradient(135deg,#eef2ff,#e0e7ff)";
                                        e.currentTarget.style.boxShadow = "none";
                                      }}
                                      aria-label={`Scan QR for donation from ${d.name}`}
                                    >
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                                        <rect x="3" y="3" width="7" height="7" rx="1"/>
                                        <rect x="14" y="3" width="7" height="7" rx="1"/>
                                        <rect x="3" y="14" width="7" height="7" rx="1"/>
                                        <rect x="14" y="14" width="3" height="3"/>
                                        <rect x="19" y="14" width="2" height="7"/>
                                        <rect x="14" y="19" width="5" height="2"/>
                                      </svg>
                                      Scan QR
                                    </button>
                                  ) : (
                                    <span style={{ color: "#cbd5e1", fontSize: "0.72rem" }}>—</span>
                                  )}
                                </TableCell>
                               </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </motion.div>
                )}

                {/* ── Tab 1: My Profile ── */}
                {tabIndex === 1 && (
                  <motion.div key="tab-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                    <NGOProfile />
                  </motion.div>
                )}

                {/* ── Tab 2: Donation History ── */}
                {tabIndex === 2 && (
                  <motion.div key="tab-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                    <DonationHistory />
                  </motion.div>
                )}

                {/* ── Tab 3: Nearby NGOs ── */}
                {tabIndex === 3 && (
                  <motion.div key="tab-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                    <NearbyNGOs />
                  </motion.div>
                )}

              </Box>
            </Paper>
          </motion.div>
        </Box>
      </div>
    </motion.div>
  );
}

export default NGODashboard;