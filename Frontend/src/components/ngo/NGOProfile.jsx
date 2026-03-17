import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  Chip,
  Divider,
  CircularProgress,
  Paper,
  InputAdornment,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const API = "http://localhost:3000/api/receiver";
const getToken = () => localStorage.getItem("token");

/* ── shared input style ── */
const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    background: "#fff",
    transition: "box-shadow 0.2s ease",
    "&:hover fieldset": { borderColor: "#3b5bdb" },
    "&.Mui-focused fieldset": { borderColor: "#3b5bdb", borderWidth: "2px" },
    "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(59,91,219,0.10)" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#3b5bdb" },
};

const readOnlySx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    background: "#f8fafc",
    cursor: "not-allowed",
    pointerEvents: "none",
    "& fieldset": { borderColor: "#e2e8f0" },
  },
};

/* ── verification style map ── */
const verificationStyles = {
  Verified: { bg: "#dcfce7", color: "#166534", border: "#bbf7d0", icon: <VerifiedIcon sx={{ fontSize: 18, color: "#16a34a" }} /> },
  Rejected: { bg: "#fee2e2", color: "#991b1b", border: "#fecaca", icon: <ErrorOutlineIcon sx={{ fontSize: 18, color: "#dc2626" }} /> },
  Pending:  { bg: "#fef3c7", color: "#92400e", border: "#fde68a", icon: <CheckCircleOutlineIcon sx={{ fontSize: 18, color: "#f59e0b" }} /> },
};

/* ── Info row (view mode) ── */
function InfoRow({ icon: Icon, label, value, locked }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon sx={{ fontSize: 16, color: "#3b5bdb" }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
          {locked && (
            <Chip
              label="Cannot be changed"
              size="small"
              icon={<LockOutlinedIcon sx={{ fontSize: "10px !important" }} />}
              sx={{
                height: 18,
                fontSize: "0.65rem",
                background: "#f1f5f9",
                color: "#64748b",
                border: "1px solid #e2e8f0",
                "& .MuiChip-icon": { ml: "4px" },
              }}
            />
          )}
        </div>
        <p className={`text-sm font-medium ${locked ? "text-slate-400" : "text-slate-700"}`}>
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

/* ── Section card wrapper ── */
function SectionCard({ title, icon: Icon, children }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid #f1f5f9",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(59,91,219,0.05)",
      }}
    >
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-50 bg-slate-50/60">
        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
          <Icon sx={{ fontSize: 16, color: "#3b5bdb" }} />
        </div>
        <Typography variant="subtitle2" fontWeight={700} sx={{ color: "#1a1a2e" }}>
          {title}
        </Typography>
      </div>
      <div className="px-5 py-5 flex flex-col gap-4">{children}</div>
    </Paper>
  );
}

export default function NGOProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading]  = useState(true);
  const [editing, setEditing]  = useState(false);
  const [form, setForm]        = useState({});
  const [saving, setSaving]    = useState(false);
  const [error, setError]      = useState("");
  const [success, setSuccess]  = useState("");

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/me`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      if (data.success) {
        setProfile(data.data.receiver);
        setForm({
          name:        data.data.receiver.name        || "",
          email:       data.data.receiver.email       || "",
          location:    data.data.receiver.location    || "",
          pincode:     data.data.receiver.pincode     || "",
          description: data.data.receiver.description || "",
          leader: {
            name:  data.data.receiver.leader?.name  || "",
            phone: data.data.receiver.leader?.phone || "",
            email: data.data.receiver.leader?.email || "",
          },
        });
      } else {
        setError("Failed to load profile");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res  = await fetch(`${API}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({
          ...form,
          pincode: String(form.pincode),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setEditing(false);
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Update failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <CircularProgress size={32} sx={{ color: "#3b5bdb" }} />
        <Typography variant="body2" color="text.secondary">Loading profile…</Typography>
      </div>
    );
  }

  const vStatus = profile?.verificationStatus?.status || "Pending";
  const vStyle  = verificationStyles[vStatus] || verificationStyles.Pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#1a1a2e" }}>
            NGO Profile
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Manage your organisation's information
          </Typography>
        </div>

        {!editing ? (
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon sx={{ fontSize: 16 }} />}
            onClick={() => setEditing(true)}
            sx={{
              borderRadius: "10px",
              borderColor: "#3b5bdb",
              color: "#3b5bdb",
              fontWeight: 600,
              textTransform: "none",
              fontSize: "0.82rem",
              "&:hover": { background: "#eff3ff", borderColor: "#2f4ac7" },
            }}
          >
            Edit Profile
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="outlined"
              size="small"
              startIcon={<CloseIcon sx={{ fontSize: 16 }} />}
              onClick={() => { setEditing(false); setError(""); }}
              sx={{
                borderRadius: "10px",
                borderColor: "#e2e8f0",
                color: "#64748b",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.82rem",
                "&:hover": { background: "#f8fafc" },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={saving
                ? <CircularProgress size={14} sx={{ color: "#fff" }} />
                : <SaveIcon sx={{ fontSize: 16 }} />
              }
              onClick={handleSave}
              disabled={saving}
              sx={{
                borderRadius: "10px",
                background: "linear-gradient(135deg, #3b5bdb, #4f46e5)",
                fontWeight: 700,
                textTransform: "none",
                fontSize: "0.82rem",
                boxShadow: "0 3px 10px rgba(59,91,219,0.3)",
                "&:hover": { background: "linear-gradient(135deg, #2f4ac7, #4338ca)", transform: "translateY(-1px)" },
                "&:active": { transform: "translateY(0)" },
                "&.Mui-disabled": { background: "#93a8f4", color: "#fff" },
                transition: "all 0.2s ease",
              }}
            >
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      {/* ── Alerts ── */}
      <AnimatePresence>
        {success && (
          <motion.div
            key="success"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.22 }}
          >
            <Alert severity="success" icon={<CheckCircleOutlineIcon fontSize="small" />}
              sx={{ borderRadius: "10px", border: "1px solid #bbf7d0", background: "#f0fdf4", fontSize: "0.83rem" }}>
              {success}
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
            <Alert severity="error" icon={<ErrorOutlineIcon fontSize="small" />}
              onClose={() => setError("")}
              sx={{ borderRadius: "10px", border: "1px solid #fecaca", background: "#fff5f5", fontSize: "0.83rem" }}>
              {error}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Verification status banner ── */}
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3 mb-5 border"
        style={{ background: vStyle.bg, borderColor: vStyle.border }}
      >
        {vStyle.icon}
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: vStyle.color }}>
            Verification Status
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <Chip
              label={vStatus}
              size="small"
              sx={{
                background: "rgba(255,255,255,0.7)",
                color: vStyle.color,
                border: `1px solid ${vStyle.border}`,
                fontWeight: 700,
                fontSize: "0.72rem",
              }}
            />
            {profile?.verificationStatus?.message && (
              <p className="text-xs" style={{ color: vStyle.color }}>
                {profile.verificationStatus.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Content: View or Edit ── */}
      <div className="flex flex-col gap-4">
        {!editing ? (
          /* ── VIEW MODE ── */
          <>
            <SectionCard title="Organisation Details" icon={BadgeOutlinedIcon}>
              <InfoRow icon={BadgeOutlinedIcon}      label="NGO Name"     value={profile?.name} />
              <Divider sx={{ borderColor: "#f1f5f9" }} />
              <InfoRow icon={EmailOutlinedIcon}      label="Email"        value={profile?.email} locked />
              <Divider sx={{ borderColor: "#f1f5f9" }} />
              <InfoRow icon={BadgeOutlinedIcon}      label="Darpan ID"    value={profile?.ngoDarpanID} locked />
              <Divider sx={{ borderColor: "#f1f5f9" }} />
              <InfoRow icon={LocationOnOutlinedIcon} label="Location"     value={profile?.location} />
              <Divider sx={{ borderColor: "#f1f5f9" }} />
              <InfoRow icon={PinDropOutlinedIcon}    label="Pincode"      value={profile?.pincode} />
              <Divider sx={{ borderColor: "#f1f5f9" }} />
              <InfoRow icon={NotesOutlinedIcon}      label="Description"  value={profile?.description || "No description provided"} />
            </SectionCard>

            <SectionCard title="Leader / Contact Person" icon={PersonOutlinedIcon}>
              <InfoRow icon={PersonOutlinedIcon} label="Name"  value={profile?.leader?.name} />
              <Divider sx={{ borderColor: "#f1f5f9" }} />
              <InfoRow icon={PhoneOutlinedIcon}  label="Phone" value={profile?.leader?.phone} />
              <Divider sx={{ borderColor: "#f1f5f9" }} />
              <InfoRow icon={EmailOutlinedIcon}  label="Email" value={profile?.leader?.email} />
            </SectionCard>
          </>
        ) : (
          /* ── EDIT MODE ── */
          <>
            <SectionCard title="Organisation Details" icon={BadgeOutlinedIcon}>
              <TextField
                label="NGO Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                fullWidth size="small"
                InputProps={{ startAdornment: <InputAdornment position="start"><BadgeOutlinedIcon sx={{ fontSize: 17, color: "#3b5bdb" }} /></InputAdornment> }}
                sx={inputSx}
              />

              {/* Email — locked */}
              <TextField
                label="Email"
                value={form.email}
                fullWidth size="small"
                inputProps={{ readOnly: true, "aria-label": "Email cannot be changed" }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ fontSize: 17, color: "#94a3b8" }} /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Chip
                        label="Cannot be changed"
                        size="small"
                        icon={<LockOutlinedIcon sx={{ fontSize: "10px !important" }} />}
                        sx={{ height: 20, fontSize: "0.65rem", background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0", "& .MuiChip-icon": { ml: "4px" } }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={readOnlySx}
              />

              <TextField
                label="Location / Address"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                fullWidth size="small"
                InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnOutlinedIcon sx={{ fontSize: 17, color: "#3b5bdb" }} /></InputAdornment> }}
                sx={inputSx}
              />

              <TextField
                label="Pincode"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                fullWidth size="small"
                inputProps={{ maxLength: 6 }}
                InputProps={{ startAdornment: <InputAdornment position="start"><PinDropOutlinedIcon sx={{ fontSize: 17, color: "#3b5bdb" }} /></InputAdornment> }}
                sx={inputSx}
              />

              <TextField
                label="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                fullWidth size="small"
                multiline minRows={3}
                placeholder="Describe your NGO's mission and work…"
                InputProps={{ startAdornment: <InputAdornment position="start" sx={{ mt: "6px", alignSelf: "flex-start" }}><NotesOutlinedIcon sx={{ fontSize: 17, color: "#3b5bdb" }} /></InputAdornment> }}
                sx={inputSx}
              />
            </SectionCard>

            <SectionCard title="Leader / Contact Person" icon={PersonOutlinedIcon}>
              <TextField
                label="Leader Name"
                value={form.leader.name}
                onChange={(e) => setForm({ ...form, leader: { ...form.leader, name: e.target.value } })}
                fullWidth size="small"
                InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlinedIcon sx={{ fontSize: 17, color: "#3b5bdb" }} /></InputAdornment> }}
                sx={inputSx}
              />
              <TextField
                label="Leader Phone"
                value={form.leader.phone}
                onChange={(e) => setForm({ ...form, leader: { ...form.leader, phone: e.target.value } })}
                fullWidth size="small"
                inputProps={{ maxLength: 10 }}
                InputProps={{ startAdornment: <InputAdornment position="start"><PhoneOutlinedIcon sx={{ fontSize: 17, color: "#3b5bdb" }} /></InputAdornment> }}
                sx={inputSx}
              />
              <TextField
                label="Leader Email"
                type="email"
                value={form.leader.email}
                onChange={(e) => setForm({ ...form, leader: { ...form.leader, email: e.target.value } })}
                fullWidth size="small"
                InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ fontSize: 17, color: "#3b5bdb" }} /></InputAdornment> }}
                sx={inputSx}
              />
            </SectionCard>
          </>
        )}
      </div>
    </motion.div>
  );
}