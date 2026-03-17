import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import QRModal from "../donation/QRModal";

// MUI Joy only
import Card from "@mui/joy/Card";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";
import Textarea from "@mui/joy/Textarea";
import Button from "@mui/joy/Button";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Chip from "@mui/joy/Chip";
import Alert from "@mui/joy/Alert";
import Divider from "@mui/joy/Divider";

// Icons
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import PinDropIcon from "@mui/icons-material/PinDrop";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupsIcon from "@mui/icons-material/Groups";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import ErrorIcon from "@mui/icons-material/Error";
import RestaurantIcon from "@mui/icons-material/Restaurant";

/* ── Quick-add count buttons ── */
const QUICK_VALUES = [8, 10, 15, 25, 50];

/* ── Step indicator ── */
function StepDot({ active, done, label, num }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
        ${done  ? "bg-blue-600 text-white"  : ""}
        ${active && !done ? "bg-blue-100 text-blue-600 ring-2 ring-blue-400" : ""}
        ${!active && !done ? "bg-slate-100 text-slate-400" : ""}
      `}>
        {done ? "✓" : num}
      </div>
      <span className={`text-[10px] font-medium whitespace-nowrap ${active ? "text-blue-600" : "text-slate-400"}`}
        style={{ fontFamily: "'Sora', sans-serif" }}>
        {label}
      </span>
    </div>
  );
}

/* ── Section card wrapper ── */
function SectionCard({ icon, title, children, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.45 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}>
          <span className="text-white">{icon}</span>
        </div>
        <span className="text-sm font-semibold text-slate-700"
          style={{ fontFamily: "'Sora', sans-serif" }}>
          {title}
        </span>
      </div>
      <div className="px-5 py-5 flex flex-col gap-4">
        {children}
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════
   MAIN COMPONENT
════════════════════════════════ */
function Fooddonation() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", phone: "", totalCount: 0,
    address: "", foodType: "", description: "",
    pincode: "", expiryTime: "",
  });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [qrData, setQrData]     = useState({ open: false, url: "", id: "" });

  /* ── Handlers ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (_, newValue) =>
    setFormData(prev => ({ ...prev, foodType: newValue }));

  const handleBoxClick = (value) =>
    setFormData(prev => ({ ...prev, totalCount: prev.totalCount + value }));

  const handleManualCount = (e) =>
    setFormData(prev => ({ ...prev, totalCount: parseInt(e.target.value, 10) || 0 }));

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData(prev => ({
          ...prev,
          address: `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`,
        }));
      },
      () => setError("Could not fetch location. Please enter manually.")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.pincode || !formData.expiryTime || !formData.foodType) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/food/donate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, status: "Pending", donorId: user._id }),
      });
      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
        // Show QR code modal if the backend returned one
        if (data.qrCodeDataUrl) {
          setQrData({
            open: true,
            url: data.qrCodeDataUrl,
            id: data.data?._id ?? "",
          });
        } else {
          setTimeout(() => navigate("/dashboard"), 2200);
        }
      } else {
        throw new Error(data.message || "Failed to register donation");
      }
    } catch (err) {
      setError(err.message || "Failed to submit donation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Simple step progress ── */
  const filledBasic   = !!(formData.name && formData.phone);
  const filledFood    = !!(formData.foodType && formData.totalCount > 0);
  const filledLocation= !!(formData.address && formData.pincode);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Sora:wght@300;400;500;600&display=swap');
      `}</style>

      {/* QR modal — shown after successful submission */}
      <QRModal
        open={qrData.open}
        qrCodeDataUrl={qrData.url}
        donationId={qrData.id}
        onClose={() => {
          setQrData({ open: false, url: "", id: "" });
          navigate("/dashboard");
        }}
      />

      <div className="relative min-h-screen bg-slate-50 py-12 px-4 md:px-8 overflow-hidden">

        {/* Blobs */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-blue-100/50 blur-[110px]" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-blue-50/60 blur-[90px]" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col gap-6">

          {/* ── Page header ── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-3 text-center"
          >
            <Chip
              variant="soft" color="primary" size="sm"
              startDecorator={<VolunteerActivismIcon sx={{ fontSize: 14 }} />}
              sx={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", px: 2 }}
            >
              Food Donation
            </Chip>
            <h1
              className="text-4xl font-black text-slate-800 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Register your{" "}
              <span className="italic text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}>
                donation
              </span>
            </h1>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed"
              style={{ fontFamily: "'Sora', sans-serif" }}>
              Fill in the details below. Our team will coordinate pickup and ensure your food reaches those who need it.
            </p>
          </motion.div>

          {/* ── Progress steps ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-start justify-center gap-0"
          >
            {[
              { label: "Your Info",  done: filledBasic },
              { label: "Food Info",  done: filledFood },
              { label: "Location",   done: filledLocation },
              { label: "Submit",     done: submitted },
            ].map((step, i, arr) => (
              <div key={i} className="flex items-center">
                <StepDot
                  num={i + 1}
                  label={step.label}
                  done={step.done}
                  active={!step.done && (i === 0 || arr[i - 1].done)}
                />
                {i < arr.length - 1 && (
                  <div className={`w-12 h-px mb-5 mx-1 transition-colors duration-300 ${
                    step.done ? "bg-blue-400" : "bg-slate-200"
                  }`} />
                )}
              </div>
            ))}
          </motion.div>

          {/* ── Success state ── */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 py-16 bg-white rounded-2xl border border-blue-100 shadow-md text-center px-8"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}>
                  🎉
                </div>
                <h2 className="text-2xl font-black text-slate-800"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  Donation Registered!
                </h2>
                <p className="text-slate-400 text-sm"
                  style={{ fontFamily: "'Sora', sans-serif" }}>
                  Thank you for your generosity. Redirecting to your dashboard…
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!submitted && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* ── Section 1: Personal Info ── */}
              <SectionCard icon={<BadgeIcon sx={{ fontSize: 15 }} />} title="Your Information" index={0}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormControl required>
                    <FormLabel sx={{ fontSize: "0.78rem", fontWeight: 600 }}>Full Name</FormLabel>
                    <Input
                      name="name" value={formData.name} onChange={handleChange}
                      placeholder="Ramesh Patil"
                      startDecorator={<BadgeIcon sx={{ fontSize: 16, color: "#94a3b8" }} />}
                      sx={{ borderRadius: "10px", "--Input-focusedThickness": "2px" }}
                    />
                  </FormControl>
                  <FormControl required>
                    <FormLabel sx={{ fontSize: "0.78rem", fontWeight: 600 }}>Phone Number</FormLabel>
                    <Input
                      name="phone" value={formData.phone} onChange={handleChange}
                      placeholder="9876543210" type="tel"
                      startDecorator={<LocalPhoneIcon sx={{ fontSize: 16, color: "#94a3b8" }} />}
                      sx={{ borderRadius: "10px", "--Input-focusedThickness": "2px" }}
                    />
                  </FormControl>
                </div>
              </SectionCard>

              {/* ── Section 2: Food Info ── */}
              <SectionCard icon={<RestaurantIcon sx={{ fontSize: 15 }} />} title="Food Details" index={1}>

                {/* Food type */}
                <FormControl required>
                  <FormLabel sx={{ fontSize: "0.78rem", fontWeight: 600 }}>Food Type</FormLabel>
                  <Select
                    placeholder="Select food type"
                    value={formData.foodType}
                    onChange={handleSelectChange}
                    sx={{ borderRadius: "10px" }}
                  >
                    <Option value="Veg">🥦 Vegetarian</Option>
                    <Option value="Non-veg">🍗 Non-Vegetarian</Option>
                  </Select>
                </FormControl>

                {/* People count */}
                <FormControl>
                  <FormLabel sx={{ fontSize: "0.78rem", fontWeight: 600 }}>
                    Total People Served
                  </FormLabel>
                  <div className="flex flex-col gap-3">
                    {/* Quick-add buttons */}
                    <div className="flex flex-wrap gap-2">
                      {QUICK_VALUES.map((v) => (
                        <button
                          key={v} type="button"
                          onClick={() => handleBoxClick(v)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold
                            border border-blue-200 text-blue-600 bg-blue-50
                            hover:bg-blue-100 hover:border-blue-400 transition-all duration-150"
                          style={{ fontFamily: "'Sora', sans-serif" }}
                        >
                          <AddIcon sx={{ fontSize: 12 }} />
                          {v}
                        </button>
                      ))}
                    </div>
                    {/* Manual input + total */}
                    <div className="flex items-center gap-3">
                      <Input
                        type="number" value={formData.totalCount}
                        onChange={handleManualCount}
                        placeholder="Or enter manually"
                        startDecorator={<GroupsIcon sx={{ fontSize: 16, color: "#94a3b8" }} />}
                        sx={{ borderRadius: "10px", flex: 1, "--Input-focusedThickness": "2px" }}
                      />
                      <div className="flex-shrink-0 px-4 py-2 rounded-xl bg-blue-50 border border-blue-100">
                        <p className="text-[10px] text-blue-400 uppercase tracking-wider font-semibold"
                          style={{ fontFamily: "'Sora', sans-serif" }}>Total</p>
                        <p className="text-lg font-black text-blue-600 leading-none"
                          style={{ fontFamily: "'Playfair Display', serif" }}>
                          {formData.totalCount}
                        </p>
                      </div>
                    </div>
                  </div>
                </FormControl>

                {/* Description */}
                <FormControl>
                  <FormLabel sx={{ fontSize: "0.78rem", fontWeight: 600 }}>Description</FormLabel>
                  <Textarea
                    name="description" value={formData.description}
                    onChange={handleChange}
                    placeholder="e.g. Dal, rice, chapati — freshly cooked, suitable for 10 people"
                    minRows={2}
                    sx={{ borderRadius: "10px", fontSize: "0.875rem", "--Textarea-focusedThickness": "2px" }}
                  />
                </FormControl>

                {/* Expiry time */}
                <FormControl required>
                  <FormLabel sx={{ fontSize: "0.78rem", fontWeight: 600 }}>
                    Food Expiry Time <span className="text-red-400">*</span>
                  </FormLabel>
                  <Input
                    name="expiryTime" value={formData.expiryTime}
                    onChange={handleChange} type="time"
                    startDecorator={<AccessTimeIcon sx={{ fontSize: 16, color: "#94a3b8" }} />}
                    sx={{ borderRadius: "10px", "--Input-focusedThickness": "2px" }}
                  />
                  <FormHelperText sx={{ fontSize: "0.7rem" }}>
                    Time by which the food must be picked up
                  </FormHelperText>
                </FormControl>
              </SectionCard>

              {/* ── Section 3: Location ── */}
              <SectionCard icon={<LocationOnIcon sx={{ fontSize: 15 }} />} title="Pickup Location" index={2}>
                <FormControl required>
                  <FormLabel sx={{ fontSize: "0.78rem", fontWeight: 600 }}>Address</FormLabel>
                  <Input
                    name="address" value={formData.address}
                    onChange={handleChange}
                    placeholder="Street, Area, City"
                    startDecorator={
                      <button type="button" onClick={handleLocate}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors border-r border-slate-200 mr-1"
                        style={{ fontFamily: "'Sora', sans-serif" }}>
                        <LocationOnIcon sx={{ fontSize: 13 }} />
                        Locate
                      </button>
                    }
                    sx={{ borderRadius: "10px", "--Input-focusedThickness": "2px" }}
                  />
                </FormControl>

                <FormControl required>
                  <FormLabel sx={{ fontSize: "0.78rem", fontWeight: 600 }}>
                    Pincode <span className="text-red-400">*</span>
                  </FormLabel>
                  <Input
                    name="pincode" value={formData.pincode}
                    onChange={handleChange}
                    placeholder="416115"
                    startDecorator={<PinDropIcon sx={{ fontSize: 16, color: "#94a3b8" }} />}
                    inputProps={{ maxLength: 6, pattern: "[0-9]{6}" }}
                    sx={{ borderRadius: "10px", "--Input-focusedThickness": "2px" }}
                  />
                </FormControl>
              </SectionCard>

              {/* ── Error alert ── */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <Alert
                      color="danger"
                      startDecorator={<ErrorIcon />}
                      endDecorator={
                        <button onClick={() => setError("")}
                          className="text-current opacity-60 hover:opacity-100 text-xs">✕</button>
                      }
                      sx={{ borderRadius: "12px", fontSize: "0.85rem" }}
                    >
                      {error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Submit ── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  loading={loading}
                  endDecorator={!loading && <SendIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    borderRadius: "14px",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    py: 1.75,
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
                  {loading ? "Submitting donation…" : "Submit Donation"}
                </Button>
                <p className="text-center text-xs text-slate-400 mt-3"
                  style={{ fontFamily: "'Sora', sans-serif" }}>
                  By submitting, you agree to our donation terms & conditions.
                </p>
              </motion.div>

            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default Fooddonation;