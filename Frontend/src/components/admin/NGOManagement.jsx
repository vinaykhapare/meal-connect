import { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Alert,
  Paper,
  InputAdornment,
  Tooltip,
  Fade,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";

const API = "http://localhost:3000/api/admin";
const getToken = () => localStorage.getItem("token");

const verificationStyles = {
  Verified: { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" },
  Rejected: { bg: "#fee2e2", color: "#991b1b", border: "#fecaca" },
  Pending:  { bg: "#fef3c7", color: "#92400e", border: "#fde68a" },
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    background: "#fff",
    transition: "box-shadow 0.2s ease",
    "&:hover fieldset": { borderColor: "#dc2626" },
    "&.Mui-focused fieldset": { borderColor: "#dc2626", borderWidth: "2px" },
    "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(220,38,38,0.10)" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#dc2626" },
};

export default function NGOManagement() {
  const [ngos, setNGOs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [pincode, setPincode]     = useState("");
  const [search, setSearch]       = useState("");
  const [editNGO, setEditNGO]     = useState(null);
  const [editForm, setEditForm]   = useState({});
  const [saving, setSaving]       = useState(false);
  const [deleteId, setDeleteId]   = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchNGOs = async (pin = "", srch = "") => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (pin)  params.append("pincode", pin);
      if (srch) params.append("search", srch);
      const res  = await fetch(`${API}/ngos?${params}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) setNGOs(data.data);
      else setError(data.message || "Failed to fetch NGOs");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNGOs(); }, []);

  const handleFilter      = () => fetchNGOs(pincode, search);
  const handleClearFilter = () => { setPincode(""); setSearch(""); fetchNGOs(); };

  const openEdit = (ngo) => {
    setEditNGO(ngo);
    setEditForm({ name: ngo.name, email: ngo.email, location: ngo.location, pincode: ngo.pincode });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res  = await fetch(`${API}/ngos/${editNGO._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("NGO updated successfully");
        setEditNGO(null);
        fetchNGOs(pincode, search);
        setTimeout(() => setSuccessMsg(""), 3000);
      } else setError(data.message);
    } catch { setError("Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      const res  = await fetch(`${API}/ngos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("NGO deleted successfully");
        setDeleteId(null);
        fetchNGOs(pincode, search);
        setTimeout(() => setSuccessMsg(""), 3000);
      } else setError(data.message);
    } catch { setError("Delete failed"); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
          <BusinessOutlinedIcon sx={{ color: "#dc2626", fontSize: 20 }} />
        </div>
        <div>
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#1a1a2e" }}>
            NGO Management
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Search, edit and remove registered NGOs
          </Typography>
        </div>
      </div>

      {/* ── Alerts ── */}
      <AnimatePresence>
        {successMsg && (
          <motion.div key="success"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.22 }}
          >
            <Alert severity="success" icon={<CheckCircleOutlineIcon fontSize="small" />}
              sx={{ borderRadius: "10px", border: "1px solid #bbf7d0", background: "#f0fdf4", fontSize: "0.83rem" }}>
              {successMsg}
            </Alert>
          </motion.div>
        )}
        {error && (
          <motion.div key="error"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.22 }}
          >
            <Alert severity="error" icon={<ErrorOutlineIcon fontSize="small" />}
              onClose={() => setError("")}
              sx={{ borderRadius: "10px", border: "1px solid #fecaca", background: "#fff5f5", fontSize: "0.83rem" }}
              role="alert" aria-live="assertive">
              {error}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Filter bar ── */}
      <Paper elevation={0} sx={{
        borderRadius: "16px", border: "1px solid #f1f5f9", p: 3, mb: 4,
        boxShadow: "0 2px 12px rgba(220,38,38,0.05)",
      }}>
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <TextField
            label="Search by Name"
            placeholder="NGO name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFilter()}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 17, color: "#dc2626" }} /></InputAdornment>,
            }}
            sx={inputSx}
          />
          <TextField
            label="Filter by Pincode"
            placeholder="e.g. 411001"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFilter()}
            size="small"
            fullWidth
            inputProps={{ maxLength: 6 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><FilterAltOutlinedIcon sx={{ fontSize: 17, color: "#dc2626" }} /></InputAdornment>,
            }}
            sx={inputSx}
          />
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="contained"
              size="small"
              startIcon={<SearchIcon sx={{ fontSize: 16 }} />}
              onClick={handleFilter}
              sx={{
                borderRadius: "10px",
                background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                fontWeight: 700,
                textTransform: "none",
                fontSize: "0.82rem",
                px: 2,
                boxShadow: "0 3px 10px rgba(220,38,38,0.25)",
                "&:hover": { background: "linear-gradient(135deg, #b91c1c, #991b1b)", transform: "translateY(-1px)" },
                transition: "all 0.2s ease",
              }}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<ClearIcon sx={{ fontSize: 16 }} />}
              onClick={handleClearFilter}
              sx={{
                borderRadius: "10px",
                borderColor: "#e2e8f0",
                color: "#64748b",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.82rem",
                "&:hover": { background: "#f8fafc", borderColor: "#cbd5e1" },
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </Paper>

      {/* ── Table ── */}
      <Paper elevation={0} sx={{
        borderRadius: "16px", border: "1px solid #f1f5f9", overflow: "hidden",
        boxShadow: "0 2px 12px rgba(220,38,38,0.05)",
      }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <CircularProgress size={32} sx={{ color: "#dc2626" }} />
            <Typography variant="body2" color="text.secondary">Loading NGOs…</Typography>
          </div>
        ) : (
          <TableContainer>
            <Table size="small" aria-label="NGO management table">
              <TableHead>
                <TableRow sx={{ background: "#f8fafc" }}>
                  {["NGO Name", "Email", "Leader Phone", "Location", "Pincode", "Status", "Actions"].map((h) => (
                    <TableCell key={h} sx={{
                      fontWeight: 700, fontSize: "0.72rem", color: "#64748b",
                      textTransform: "uppercase", letterSpacing: "0.05em",
                      borderBottom: "1px solid #f1f5f9", py: 1.5, whiteSpace: "nowrap",
                      ...(h === "Actions" ? { textAlign: "center" } : {}),
                    }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {ngos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: "center", py: 6 }}>
                      <div className="flex flex-col items-center gap-2">
                        <BusinessOutlinedIcon sx={{ color: "#cbd5e1", fontSize: 36 }} />
                        <Typography variant="body2" color="text.secondary">No NGOs found.</Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  ngos.map((ngo, idx) => {
                    const vStatus = ngo.verificationStatus?.status || "Pending";
                    const vStyle  = verificationStyles[vStatus] || verificationStyles.Pending;
                    return (
                      <TableRow key={ngo._id} sx={{
                        background: idx % 2 === 0 ? "#fff" : "#fafafa",
                        "&:hover": { background: "#fff5f5" },
                        transition: "background 0.15s ease",
                        "&:last-child td": { borderBottom: 0 },
                      }}>
                        <TableCell sx={{ py: 1.5 }}>
                          <Typography variant="body2" fontWeight={600} sx={{ color: "#1a1a2e" }}>
                            {ngo.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.78rem" }}>
                            {ngo.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "monospace", fontSize: "0.78rem" }}>
                            {ngo.leader?.phone || "—"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 140, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {ngo.location}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                            {ngo.pincode}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={vStatus} size="small" sx={{
                            background: vStyle.bg, color: vStyle.color,
                            border: `1px solid ${vStyle.border}`,
                            fontWeight: 600, fontSize: "0.72rem",
                          }} />
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          <div className="flex items-center justify-center gap-1.5">
                            <Tooltip title="Edit NGO" arrow TransitionComponent={Fade}>
                              <IconButton
                                size="small"
                                onClick={() => openEdit(ngo)}
                                aria-label={`Edit ${ngo.name}`}
                                sx={{
                                  borderRadius: "8px",
                                  background: "#eff3ff",
                                  color: "#3b5bdb",
                                  border: "1px solid #c5d1fb",
                                  "&:hover": { background: "#dbeafe", borderColor: "#3b5bdb" },
                                  transition: "all 0.15s ease",
                                }}
                              >
                                <EditIcon sx={{ fontSize: 15 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete NGO" arrow TransitionComponent={Fade}>
                              <IconButton
                                size="small"
                                onClick={() => setDeleteId(ngo._id)}
                                aria-label={`Delete ${ngo.name}`}
                                sx={{
                                  borderRadius: "8px",
                                  background: "#fff5f5",
                                  color: "#dc2626",
                                  border: "1px solid #fecaca",
                                  "&:hover": { background: "#fee2e2", borderColor: "#dc2626" },
                                  transition: "all 0.15s ease",
                                }}
                              >
                                <DeleteIcon sx={{ fontSize: 15 }} />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* ── Edit Modal ── */}
      <Dialog
        open={!!editNGO}
        onClose={() => setEditNGO(null)}
        PaperProps={{
          sx: {
            borderRadius: "20px", maxWidth: 480, width: "100%", p: 0,
            overflow: "hidden",
            boxShadow: "0 24px 64px rgba(59,91,219,0.15)",
          },
        }}
        aria-labelledby="edit-ngo-title"
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-[#3b5bdb] via-[#4f46e5] to-[#6366f1]" />
        <DialogContent sx={{ px: 4, py: 4 }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <EditIcon sx={{ color: "#3b5bdb", fontSize: 18 }} />
              </div>
              <div>
                <DialogTitle id="edit-ngo-title" sx={{ p: 0, fontSize: "1rem", fontWeight: 700, color: "#1a1a2e" }}>
                  Edit NGO
                </DialogTitle>
                <Typography variant="caption" color="text.secondary">
                  Update organisation details
                </Typography>
              </div>
            </div>
            <IconButton size="small" onClick={() => setEditNGO(null)} aria-label="Close edit dialog"
              sx={{ color: "#94a3b8", "&:hover": { color: "#64748b" } }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>

          <div className="flex flex-col gap-4">
            <TextField label="NGO Name" value={editForm.name || ""}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              fullWidth size="small"
              InputProps={{ startAdornment: <InputAdornment position="start"><BusinessOutlinedIcon sx={{ fontSize: 17, color: "#3b5bdb" }} /></InputAdornment> }}
              sx={inputSx} />
            <TextField label="Email" type="email" value={editForm.email || ""}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              fullWidth size="small"
              InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ fontSize: 17, color: "#3b5bdb" }} /></InputAdornment> }}
              sx={inputSx} />
            <TextField label="Location" value={editForm.location || ""}
              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              fullWidth size="small"
              InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnOutlinedIcon sx={{ fontSize: 17, color: "#3b5bdb" }} /></InputAdornment> }}
              sx={inputSx} />
            <TextField label="Pincode" value={editForm.pincode || ""}
              onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
              fullWidth size="small"
              inputProps={{ maxLength: 6 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><PinDropOutlinedIcon sx={{ fontSize: 17, color: "#3b5bdb" }} /></InputAdornment> }}
              sx={inputSx} />

            <div className="flex gap-2 justify-end pt-1">
              <Button variant="outlined" size="small" onClick={() => setEditNGO(null)}
                startIcon={<CloseIcon sx={{ fontSize: 15 }} />}
                sx={{ borderRadius: "10px", borderColor: "#e2e8f0", color: "#64748b", fontWeight: 600, textTransform: "none",
                  "&:hover": { background: "#f8fafc" } }}>
                Cancel
              </Button>
              <Button variant="contained" size="small" onClick={handleSave} disabled={saving}
                startIcon={saving
                  ? <CircularProgress size={14} sx={{ color: "#fff" }} />
                  : <SaveIcon sx={{ fontSize: 15 }} />}
                sx={{
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #3b5bdb, #4f46e5)",
                  fontWeight: 700, textTransform: "none",
                  boxShadow: "0 3px 10px rgba(59,91,219,0.3)",
                  "&:hover": { background: "linear-gradient(135deg, #2f4ac7, #4338ca)", transform: "translateY(-1px)" },
                  "&.Mui-disabled": { background: "#93a8f4", color: "#fff" },
                  transition: "all 0.2s ease",
                }}>
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm Modal ── */}
      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        PaperProps={{
          sx: {
            borderRadius: "20px", maxWidth: 400, width: "100%", p: 0,
            overflow: "hidden",
            boxShadow: "0 24px 64px rgba(220,38,38,0.15)",
          },
        }}
        aria-labelledby="delete-ngo-title"
        aria-describedby="delete-ngo-description"
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-rose-500 to-orange-400" />
        <DialogContent sx={{ px: 4, py: 4 }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center text-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
              <WarningAmberIcon sx={{ color: "#dc2626", fontSize: 30 }} />
            </div>
            <div>
              <Typography id="delete-ngo-title" variant="h6" fontWeight={700} sx={{ color: "#1a1a2e" }}>
                Delete NGO?
              </Typography>
              <Typography id="delete-ngo-description" variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.7 }}>
                This action <strong>cannot be undone</strong>. All data associated with this NGO will be permanently removed.
              </Typography>
            </div>
            <div className="flex gap-2 w-full">
              <Button fullWidth variant="outlined" onClick={() => setDeleteId(null)}
                sx={{ borderRadius: "10px", borderColor: "#e2e8f0", color: "#64748b", fontWeight: 600, textTransform: "none",
                  "&:hover": { background: "#f8fafc" } }}>
                Cancel
              </Button>
              <Button fullWidth variant="contained" onClick={() => handleDelete(deleteId)}
                sx={{
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                  fontWeight: 700, textTransform: "none",
                  boxShadow: "0 3px 10px rgba(220,38,38,0.3)",
                  "&:hover": { background: "linear-gradient(135deg, #b91c1c, #991b1b)", transform: "translateY(-1px)" },
                  transition: "all 0.2s ease",
                }}>
                Delete NGO
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}