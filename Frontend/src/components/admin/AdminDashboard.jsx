import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Paper,
  Tooltip,
  Fade,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import NGOManagement from "./NGOManagement";
import UserManagement from "./UserManagement";

const API = "http://localhost:3000/api/admin";
const getToken = () => localStorage.getItem("token");

const tabIndexMap = { requests: 0, ngos: 1, users: 2 };

const TAB_CONFIG = [
  { label: "Verification Requests", icon: <HowToRegIcon sx={{ fontSize: 17 }} /> },
  { label: "NGO Management", icon: <BusinessIcon sx={{ fontSize: 17 }} /> },
  { label: "User Management", icon: <PeopleIcon sx={{ fontSize: 17 }} /> },
];

const AdminDashboard = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab = tabParam ? (tabIndexMap[tabParam] ?? 0) : 0;

  const [tabIndex, setTabIndex] = useState(initialTab);
  const [pendingNGOs, setPendingNGOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [actionLoading, setActionLoading] = useState(null); // ngoId being actioned

  useEffect(() => {
    if (tabParam) setTabIndex(tabIndexMap[tabParam] ?? 0);
  }, [tabParam]);

  useEffect(() => {
    fetchPendingNGOs();
  }, []);

  const fetchPendingNGOs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/pending-verifications`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await response.json();
      if (data.success) setPendingNGOs(data.data);
      else setError(data.message || "Failed to fetch pending NGOs");
    } catch (err) {
      console.error("Error fetching NGOs:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (ngoId, status) => {
    setActionLoading(ngoId + status);
    try {
      const response = await fetch(`${API}/verify-ngo/${ngoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          status,
          message:
            status === "Verified"
              ? "Your NGO has been verified successfully"
              : "Your NGO registration was not approved",
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMsg(`NGO ${status.toLowerCase()} successfully`);
        fetchPendingNGOs();
        setTimeout(() => setSuccessMsg(""), 3500);
      } else {
        setError(data.message || "Failed to update NGO status");
      }
    } catch (err) {
      console.error("Error updating NGO:", err);
      setError("Error updating NGO status");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/20 to-rose-50/30 px-4 py-8 md:px-8">

        {/* Background blobs */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-red-100/25 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-rose-100/30 blur-3xl" />
        </div>

        <Box sx={{ maxWidth: "1400px", mx: "auto" }}>

          {/* ── Page Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-4 mb-8">
              {/* Brand + admin badge */}
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#3b5bdb] flex items-center justify-center shadow-md shadow-blue-200 flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="white" width="18" height="18" aria-hidden="true">
                    <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
                  </svg>
                </div>
              </div>

              <div className="h-8 w-px bg-gray-200" />

              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                  <DashboardIcon sx={{ color: "#dc2626", fontSize: 20 }} aria-hidden="true" />
                </div>
                <div>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{ color: "#1a1a2e", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.2 }}
                  >
                    Admin Dashboard
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.2 }}>
                    Manage the MealConnect platform
                  </Typography>
                </div>
              </div>

              {/* Live badge */}
              <div className="ml-auto hidden sm:flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-red-600 font-medium">Admin Access</span>
              </div>
            </div>
          </motion.div>

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

          {/* ── Tabs Card ── */}
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
                boxShadow: "0 8px 40px rgba(220,38,38,0.07), 0 2px 8px rgba(0,0,0,0.04)",
                transition: "box-shadow 0.25s ease",
                "&:hover": {
                  boxShadow: "0 16px 56px rgba(220,38,38,0.11), 0 4px 16px rgba(0,0,0,0.05)",
                },
              }}
            >
              {/* Top accent bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-rose-500 to-orange-400" />

              {/* Tab bar */}
              <Box sx={{ borderBottom: "1px solid #f1f5f9", px: 3, pt: 1, background: "#fafafa" }}>
                <Tabs
                  value={tabIndex}
                  onChange={(_, val) => setTabIndex(val)}
                  aria-label="Admin dashboard tabs"
                  TabIndicatorProps={{
                    style: {
                      background: "linear-gradient(90deg, #dc2626, #b91c1c)",
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
                        gap: 0.5,
                        "&.Mui-selected": { color: "#dc2626" },
                        "&:hover": { color: "#dc2626", background: "rgba(220,38,38,0.04)", borderRadius: "8px 8px 0 0" },
                        transition: "all 0.2s ease",
                      }}
                    />
                  ))}
                </Tabs>
              </Box>

              {/* Tab content */}
              <Box sx={{ p: { xs: 3, md: 4 } }}>

                {/* ── Tab 0: Verification Requests ── */}
                {tabIndex === 0 && (
                  <motion.div
                    key="tab-0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#1a1a2e" }}>
                          NGO Verification Requests
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Review and approve pending NGO registrations
                        </Typography>
                      </div>
                      {pendingNGOs.length > 0 && (
                        <Chip
                          label={`${pendingNGOs.length} pending`}
                          size="small"
                          sx={{
                            background: "#fef3c7",
                            color: "#92400e",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            border: "1px solid #fde68a",
                          }}
                        />
                      )}
                    </div>

                    {loading ? (
                      <div className="flex items-center justify-center py-16">
                        <div className="flex flex-col items-center gap-3">
                          <CircularProgress size={32} sx={{ color: "#dc2626" }} />
                          <Typography variant="body2" color="text.secondary">
                            Loading requests…
                          </Typography>
                        </div>
                      </div>
                    ) : (
                      <TableContainer
                        sx={{
                          borderRadius: "14px",
                          border: "1px solid #f1f5f9",
                          overflow: "hidden",
                        }}
                      >
                        <Table size="small" aria-label="Pending NGO verification requests">
                          <TableHead>
                            <TableRow sx={{ background: "#f8fafc" }}>
                              {["NGO Name", "Darpan ID", "Location", "Contact Person", "Status", "Actions"].map((h) => (
                                <TableCell
                                  key={h}
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: "0.75rem",
                                    color: "#64748b",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                    borderBottom: "1px solid #f1f5f9",
                                    py: 1.5,
                                    ...(h === "Actions" ? { textAlign: "center" } : {}),
                                  }}
                                >
                                  {h}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {pendingNGOs.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={6} sx={{ textAlign: "center", py: 6 }}>
                                  <div className="flex flex-col items-center gap-2">
                                    <CheckCircleOutlineIcon sx={{ color: "#10b981", fontSize: 36 }} />
                                    <Typography variant="body2" color="text.secondary">
                                      No pending verification requests
                                    </Typography>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : (
                              pendingNGOs.map((ngo, idx) => (
                                <TableRow
                                  key={ngo._id}
                                  sx={{
                                    background: idx % 2 === 0 ? "#fff" : "#fafafa",
                                    "&:hover": { background: "#fff7f7" },
                                    transition: "background 0.15s ease",
                                    "&:last-child td": { borderBottom: 0 },
                                  }}
                                >
                                  <TableCell sx={{ py: 1.5 }}>
                                    <Typography variant="body2" fontWeight={600} sx={{ color: "#1a1a2e" }}>
                                      {ngo.name}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" sx={{ color: "#64748b", fontFamily: "monospace", fontSize: "0.78rem" }}>
                                      {ngo.ngoDarpanID}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                      {ngo.location}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" fontWeight={500} sx={{ color: "#374151" }}>
                                      {ngo.leader.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {ngo.leader.email}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={ngo.verificationStatus.status}
                                      size="small"
                                      sx={{
                                        fontWeight: 600,
                                        fontSize: "0.72rem",
                                        ...(ngo.verificationStatus.status === "Pending"
                                          ? { background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a" }
                                          : { background: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0" }),
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell sx={{ textAlign: "center" }}>
                                    <div className="flex items-center justify-center gap-2">
                                      <Tooltip title="Approve this NGO" arrow TransitionComponent={Fade}>
                                        <span>
                                          <Button
                                            size="small"
                                            variant="outlined"
                                            disabled={actionLoading === ngo._id + "Verified"}
                                            onClick={() => handleVerification(ngo._id, "Verified")}
                                            aria-label={`Verify ${ngo.name}`}
                                            startIcon={
                                              actionLoading === ngo._id + "Verified"
                                                ? <CircularProgress size={12} sx={{ color: "#16a34a" }} />
                                                : <CheckCircleIcon sx={{ fontSize: 15 }} />
                                            }
                                            sx={{
                                              borderRadius: "8px",
                                              borderColor: "#16a34a",
                                              color: "#16a34a",
                                              fontWeight: 600,
                                              fontSize: "0.75rem",
                                              textTransform: "none",
                                              py: 0.5,
                                              px: 1.5,
                                              "&:hover": {
                                                background: "#f0fdf4",
                                                borderColor: "#15803d",
                                                color: "#15803d",
                                              },
                                            }}
                                          >
                                            Verify
                                          </Button>
                                        </span>
                                      </Tooltip>

                                      <Tooltip title="Reject this NGO" arrow TransitionComponent={Fade}>
                                        <span>
                                          <Button
                                            size="small"
                                            variant="outlined"
                                            disabled={actionLoading === ngo._id + "Rejected"}
                                            onClick={() => handleVerification(ngo._id, "Rejected")}
                                            aria-label={`Reject ${ngo.name}`}
                                            startIcon={
                                              actionLoading === ngo._id + "Rejected"
                                                ? <CircularProgress size={12} sx={{ color: "#dc2626" }} />
                                                : <CancelIcon sx={{ fontSize: 15 }} />
                                            }
                                            sx={{
                                              borderRadius: "8px",
                                              borderColor: "#dc2626",
                                              color: "#dc2626",
                                              fontWeight: 600,
                                              fontSize: "0.75rem",
                                              textTransform: "none",
                                              py: 0.5,
                                              px: 1.5,
                                              "&:hover": {
                                                background: "#fff5f5",
                                                borderColor: "#b91c1c",
                                                color: "#b91c1c",
                                              },
                                            }}
                                          >
                                            Reject
                                          </Button>
                                        </span>
                                      </Tooltip>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </motion.div>
                )}

                {/* ── Tab 1: NGO Management ── */}
                {tabIndex === 1 && (
                  <motion.div
                    key="tab-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <NGOManagement />
                  </motion.div>
                )}

                {/* ── Tab 2: User Management ── */}
                {tabIndex === 2 && (
                  <motion.div
                    key="tab-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <UserManagement />
                  </motion.div>
                )}

              </Box>
            </Paper>
          </motion.div>
        </Box>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;