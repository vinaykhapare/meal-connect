import { useState, useEffect } from "react";
import {
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Button,
  Divider,
  Paper,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import GroupsIcon from "@mui/icons-material/Groups";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import VerifiedIcon from "@mui/icons-material/Verified";

const API = "http://localhost:3000/api/receiver";
const getToken = () => localStorage.getItem("token");

export default function NearbyNGOs() {
  const [ngos, setNGOs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const fetchNearbyNGOs = async () => {
      try {
        const res  = await fetch(`${API}/nearby-ngos`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        if (data.success) {
          setNGOs(data.data);
        } else {
          setError(data.message || "Failed to load nearby NGOs");
        }
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchNearbyNGOs();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
          <GroupsIcon sx={{ color: "#3b5bdb", fontSize: 20 }} />
        </div>
        <div>
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#1a1a2e" }}>
            Nearby NGOs
          </Typography>
          <Typography variant="caption" color="text.secondary">
            NGOs operating in your region available for collaboration
          </Typography>
        </div>
      </div>

      {/* ── Error ── */}
      <AnimatePresence>
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

      {/* ── Loading ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <CircularProgress size={32} sx={{ color: "#3b5bdb" }} />
          <Typography variant="body2" color="text.secondary">
            Finding NGOs in your area…
          </Typography>
        </div>

      ) : ngos.length === 0 ? (
        /* ── Empty state ── */
        <Paper
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: "1px solid #f1f5f9",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 10,
            gap: 2,
            boxShadow: "0 2px 12px rgba(59,91,219,0.05)",
          }}
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <GroupsIcon sx={{ color: "#3b5bdb", fontSize: 30 }} />
          </div>
          <div className="text-center">
            <Typography variant="subtitle2" fontWeight={700} sx={{ color: "#1a1a2e", mb: 0.5 }}>
              No nearby NGOs found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 340 }}>
              No other verified NGOs are registered in your pin code area yet.
            </Typography>
          </div>
        </Paper>

      ) : (
        /* ── NGO Grid ── */
        <>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 3, mt: 0.5 }}>
            Found <strong className="text-gray-700">{ngos.length}</strong>{" "}
            NGO{ngos.length !== 1 ? "s" : ""} in your area
          </Typography>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ngos.map((ngo, i) => (
              <motion.div
                key={ngo._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <NGOCard ngo={ngo} />
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}

function NGOCard({ ngo }) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(59,91,219,0.12)" }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid #f1f5f9",
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 2px 12px rgba(59,91,219,0.05)",
          transition: "box-shadow 0.2s ease",
        }}
      >
        {/* Card top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-[#3b5bdb] via-[#4f46e5] to-[#6366f1]" />

        <div className="p-4 flex flex-col gap-3 flex-1">

          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
              <BusinessOutlinedIcon sx={{ color: "#3b5bdb", fontSize: 22 }} />
            </div>
            <div className="flex-1 min-w-0">
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{ color: "#1a1a2e", lineHeight: 1.3, mb: 0.5 }}
                noWrap
              >
                {ngo.name}
              </Typography>
              <Chip
                label="Verified"
                size="small"
                icon={<VerifiedIcon sx={{ fontSize: "12px !important" }} />}
                sx={{
                  height: 20,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  background: "#dcfce7",
                  color: "#166534",
                  border: "1px solid #bbf7d0",
                  "& .MuiChip-icon": { color: "#16a34a", ml: "4px" },
                }}
              />
            </div>
          </div>

          <Divider sx={{ borderColor: "#f1f5f9" }} />

          {/* Details */}
          <div className="flex flex-col gap-2">
            {ngo.location && (
              <div className="flex items-center gap-2">
                <LocationOnOutlinedIcon sx={{ fontSize: 15, color: "#94a3b8", flexShrink: 0 }} />
                <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: "0.8rem" }}>
                  {ngo.location}
                </Typography>
              </div>
            )}
            {ngo.pincode && (
              <div className="flex items-center gap-2">
                <PinDropOutlinedIcon sx={{ fontSize: 15, color: "#94a3b8", flexShrink: 0 }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
                  Pin: {ngo.pincode}
                </Typography>
              </div>
            )}
            {ngo.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: "0.78rem",
                  lineHeight: 1.6,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {ngo.description}
              </Typography>
            )}
          </div>

          {/* Leader info */}
          {ngo.leader && (
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5 flex flex-col gap-1.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Contact Person
              </p>
              <div className="flex items-center gap-1.5">
                <PersonOutlinedIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
                <Typography variant="body2" sx={{ fontSize: "0.8rem", color: "#374151", fontWeight: 500 }}>
                  {ngo.leader.name}
                </Typography>
              </div>
              {ngo.leader.phone && (
                <div className="flex items-center gap-1.5">
                  <PhoneOutlinedIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
                  <Typography variant="body2" sx={{ fontSize: "0.78rem", color: "#64748b", fontFamily: "monospace" }}>
                    {ngo.leader.phone}
                  </Typography>
                </div>
              )}
            </div>
          )}

          {/* Action buttons — pushed to bottom */}
          <div className="flex gap-2 mt-auto pt-1">
            {ngo.leader?.email && (
              <Button
                variant="contained"
                size="small"
                startIcon={<EmailOutlinedIcon sx={{ fontSize: 15 }} />}
                component="a"
                href={`mailto:${ngo.leader.email}?subject=Collaboration - ${ngo.name}`}
                aria-label={`Email leader of ${ngo.name}`}
                sx={{
                  flex: 1,
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #3b5bdb, #4f46e5)",
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  textTransform: "none",
                  boxShadow: "0 3px 10px rgba(59,91,219,0.25)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #2f4ac7, #4338ca)",
                    boxShadow: "0 5px 16px rgba(59,91,219,0.35)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Contact
              </Button>
            )}
            {ngo.email && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<EmailOutlinedIcon sx={{ fontSize: 15 }} />}
                component="a"
                href={`mailto:${ngo.email}`}
                aria-label={`Email ${ngo.name}`}
                sx={{
                  flex: 1,
                  borderRadius: "10px",
                  borderColor: "#e2e8f0",
                  color: "#64748b",
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#3b5bdb",
                    color: "#3b5bdb",
                    background: "#eff3ff",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                NGO Email
              </Button>
            )}
          </div>
        </div>
      </Paper>
    </motion.div>
  );
}