import { useState, useEffect } from "react";
import {
  Typography,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import HistoryIcon from "@mui/icons-material/History";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

const API = "http://localhost:3000/api/receiver";
const getToken = () => localStorage.getItem("token");

const statusStyles = {
  Pending:   { bg: "#fef3c7", color: "#92400e", border: "#fde68a" },
  Accepted:  { bg: "#dbeafe", color: "#1e3a8a", border: "#bfdbfe" },
  Completed: { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" },
  Cancelled: { bg: "#fee2e2", color: "#991b1b", border: "#fecaca" },
};

function StatusChip({ status }) {
  const s = statusStyles[status] || statusStyles.Pending;
  return (
    <Chip label={status} size="small" sx={{
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      fontWeight: 600, fontSize: "0.72rem",
    }} />
  );
}

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

function SummaryPill({ label, value, bg, color, border, icon: Icon }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold"
      style={{ background: bg, color, borderColor: border }}>
      <Icon sx={{ fontSize: 14, color }} />
      {label}: {value}
    </div>
  );
}

export default function DonationHistory() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = getToken();
        console.log("Token exists:", !!token);
        console.log("Fetching:", `${API}/donation-history`);

        const res = await fetch(`${API}/donation-history`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("HTTP Status:", res.status);
        const data = await res.json();
        console.log("Response data:", JSON.stringify(data, null, 2));

        setDebugInfo(`Status: ${res.status} | Success: ${data.success} | Count: ${data.data?.length ?? "N/A"}`);

        if (data.success) {
          const history = (data.data || []).filter(d => d.status !== "Pending");
          console.log("Filtered history count:", history.length);
          setDonations(history);
        } else {
          setError(data.message || "Failed to load donation history");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>

      {/* ── Header ── */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
          <HistoryIcon sx={{ color: "#3b5bdb", fontSize: 20 }} />
        </div>
        <div>
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#1a1a2e" }}>
            Donation History
          </Typography>
          <Typography variant="caption" color="text.secondary">
            All food donations accepted by your NGO
          </Typography>
        </div>
      </div>

      {/* ── Debug banner (visible on screen, remove after fixing) ── */}
      {debugInfo && (
        <div className="mb-4 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600">
          🔍 Debug: {debugInfo}
        </div>
      )}

      {/* ── Error ── */}
      <AnimatePresence>
        {error && (
          <motion.div key="error"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.22 }}
          >
            <Alert severity="error" icon={<ErrorOutlineIcon fontSize="small" />}
              onClose={() => setError("")}
              sx={{ borderRadius: "10px", border: "1px solid #fecaca", background: "#fff5f5", fontSize: "0.83rem" }}>
              {error}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Loading ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <CircularProgress size={32} sx={{ color: "#3b5bdb" }} />
          <Typography variant="body2" color="text.secondary">Loading donation history…</Typography>
        </div>

      ) : donations.length === 0 ? (
        <Paper elevation={0} sx={{
          borderRadius: "16px", border: "1px solid #f1f5f9",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", py: 10, gap: 2,
          boxShadow: "0 2px 12px rgba(59,91,219,0.05)",
        }}>
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <RestaurantIcon sx={{ color: "#3b5bdb", fontSize: 30 }} />
          </div>
          <div className="text-center">
            <Typography variant="subtitle2" fontWeight={700} sx={{ color: "#1a1a2e", mb: 0.5 }}>
              No donation history yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 340 }}>
              Accepted donations will appear here once you start accepting food contributions.
            </Typography>
          </div>
        </Paper>

      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-5">
            <SummaryPill label="Total" value={donations.length}
              bg="#eff3ff" color="#3b5bdb" border="#c5d1fb" icon={HistoryIcon} />
            <SummaryPill label="Completed" value={donations.filter(d => d.status === "Completed").length}
              bg="#dcfce7" color="#166534" border="#bbf7d0" icon={CheckCircleOutlineIcon} />
            <SummaryPill label="Accepted" value={donations.filter(d => d.status === "Accepted").length}
              bg="#dbeafe" color="#1e3a8a" border="#bfdbfe" icon={HourglassEmptyIcon} />
            <SummaryPill label="Cancelled" value={donations.filter(d => d.status === "Cancelled").length}
              bg="#fee2e2" color="#991b1b" border="#fecaca" icon={CancelOutlinedIcon} />
          </div>

          <TableContainer sx={{ borderRadius: "14px", border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 2px 12px rgba(59,91,219,0.05)" }}>
            <Table size="small" aria-label="Donation history table">
              <TableHead>
                <TableRow sx={{ background: "#f8fafc" }}>
                  {["Donor Name", "Food Type", "Quantity", "Address", "Phone", "Date", "Expiry", "Status"].map((h) => (
                    <TableCell key={h} sx={{
                      fontWeight: 700, fontSize: "0.72rem", color: "#64748b",
                      textTransform: "uppercase", letterSpacing: "0.05em",
                      borderBottom: "1px solid #f1f5f9", py: 1.5, whiteSpace: "nowrap",
                    }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {donations.map((d, idx) => (
                  <TableRow key={d._id} sx={{
                    background: idx % 2 === 0 ? "#fff" : "#fafafa",
                    "&:hover": { background: "#f0f4ff" },
                    transition: "background 0.15s ease",
                    "&:last-child td": { borderBottom: 0 },
                  }}>
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ color: "#1a1a2e" }}>{d.name}</Typography>
                    </TableCell>
                    <TableCell><Typography variant="body2" color="text.secondary">{d.foodType || "—"}</Typography></TableCell>
                    <TableCell><Typography variant="body2" color="text.secondary">{d.totalCount}</Typography></TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary"
                        sx={{ maxWidth: 160, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {d.address || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "monospace", fontSize: "0.78rem" }}>
                        {d.phone}
                      </Typography>
                    </TableCell>
                    <TableCell><Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>{formatDate(d.date)}</Typography></TableCell>
                    <TableCell><Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>{d.expiryTime}</Typography></TableCell>
                    <TableCell><StatusChip status={d.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </motion.div>
  );
}