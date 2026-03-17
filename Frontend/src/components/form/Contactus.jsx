import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// MUI Joy
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Textarea from "@mui/joy/Textarea";
import Button from "@mui/joy/Button";
import Alert from "@mui/joy/Alert";
import Chip from "@mui/joy/Chip";

// MUI Icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import SubjectIcon from "@mui/icons-material/Subject";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";

import Image from "../../assets/contactus/pexels-joaojesusdesign-28493060.jpg";

/* ── Contact info items ── */
const contactInfo = [
  {
    icon: <LocationOnIcon sx={{ fontSize: 20 }} />,
    label: "Address",
    value: "Ichalkaranji, 416-115, Maharashtra",
    href: null,
  },
  {
    icon: <EmailIcon sx={{ fontSize: 20 }} />,
    label: "Email",
    value: "mealconnect@gmail.com",
    href: "mailto:mealconnect@gmail.com",
  },
  {
    icon: <LocalPhoneIcon sx={{ fontSize: 20 }} />,
    label: "Phone",
    value: "+91 9087654321",
    href: "tel:+919087654321",
  },
];

/* ── Info row on the left panel ── */
function InfoRow({ icon, label, value, href, index }) {
  const Inner = (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 + index * 0.12, duration: 0.45 }}
      className="flex items-start gap-4 group"
    >
      <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 text-white group-hover:bg-white/25 transition-colors duration-200">
        {icon}
      </div>
      <div>
        <p className="text-blue-200 text-[10px] uppercase tracking-widest font-semibold mb-0.5"
          style={{ fontFamily: "'Sora', sans-serif" }}>
          {label}
        </p>
        <p className="text-white text-sm font-medium leading-snug"
          style={{ fontFamily: "'Sora', sans-serif" }}>
          {value}
        </p>
      </div>
    </motion.div>
  );

  return href ? (
    <a href={href} className="no-underline">{Inner}</a>
  ) : Inner;
}

/* ── Bottom info card ── */
function BottomCard({ icon, label, value, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 px-5 py-4"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}>
        <span className="text-white">{icon}</span>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-0.5"
          style={{ fontFamily: "'Sora', sans-serif" }}>
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-700"
          style={{ fontFamily: "'Sora', sans-serif" }}>
          {value}
        </p>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════
   MAIN COMPONENT
════════════════════════════════ */
function Contactus() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:3000/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setStatus({ message: data.message, type: "success" });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      setStatus({ message: error.message || "Failed to send message. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name",    label: "Your Name",      type: "text",  icon: <AccountCircleIcon />, placeholder: "John Doe" },
    { name: "email",   label: "Email Address",  type: "email", icon: <EmailIcon />,         placeholder: "john@example.com" },
    { name: "subject", label: "Subject",        type: "text",  icon: <SubjectIcon />,       placeholder: "How can we help?" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Sora:wght@300;400;500;600&display=swap');
      `}</style>

      <div className="flex flex-col min-h-screen bg-slate-50">

        {/* ══════════════════════════════
            HERO SPLIT — left panel + form
        ══════════════════════════════ */}
        <div className="flex flex-col lg:flex-row flex-1 min-h-[80vh]">

          {/* ── Left: image panel ── */}
          <div
            className="lg:w-[42%] flex-shrink-0 relative flex flex-col justify-between p-10 min-h-[420px]"
            style={{
              backgroundImage: `linear-gradient(160deg, rgba(29,78,216,0.82) 0%, rgba(15,23,42,0.88) 100%), url(${Image})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            {/* Dot pattern overlay */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />

            {/* Top: heading */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10 flex flex-col gap-3"
            >
              <Chip
                variant="soft"
                size="sm"
                sx={{
                  width: "fit-content",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  bgcolor: "rgba(255,255,255,0.15)",
                  color: "white",
                  px: 1.5,
                }}
              >
                Get In Touch
              </Chip>

              <h2
                className="text-4xl font-black text-white leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Contact{" "}
                <span className="italic text-blue-300">Information</span>
              </h2>

              <p className="text-blue-100 text-sm leading-relaxed max-w-xs"
                style={{ fontFamily: "'Sora', sans-serif" }}>
                Feel free to reach out with any questions or concerns. We're here to help.
              </p>
            </motion.div>

            {/* Middle: contact rows */}
            <div className="relative z-10 flex flex-col gap-6 my-10">
              {contactInfo.map((item, i) => (
                <InfoRow key={i} {...item} index={i} />
              ))}
            </div>

            {/* Bottom: response time badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="relative z-10 flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 w-fit"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white text-xs font-medium"
                style={{ fontFamily: "'Sora', sans-serif" }}>
                Typically replies within 24 hours
              </span>
            </motion.div>
          </div>

          {/* ── Right: form ── */}
          <div className="flex-1 flex items-center justify-center p-8 md:p-14 bg-white">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="w-full max-w-lg"
            >
              {/* Form header */}
              <div className="flex flex-col gap-2 mb-8">
                <h3
                  className="text-3xl font-black text-slate-800 leading-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Send us a{" "}
                  <span
                    className="italic text-transparent bg-clip-text"
                    style={{ backgroundImage: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
                  >
                    message
                  </span>
                </h3>
                <p className="text-slate-400 text-sm"
                  style={{ fontFamily: "'Sora', sans-serif" }}>
                  We'll get back to you as soon as possible.
                </p>
              </div>

              {/* Status alert */}
              <AnimatePresence>
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6"
                  >
                    <Alert
                      color={status.type === "success" ? "success" : "danger"}
                      startDecorator={status.type === "success" ? <CheckCircleIcon /> : <ErrorIcon />}
                      endDecorator={
                        <button onClick={() => setStatus({ message: "", type: "" })}
                          className="text-current opacity-60 hover:opacity-100 transition-opacity">
                          <CloseIcon sx={{ fontSize: 16 }} />
                        </button>
                      }
                      sx={{ borderRadius: "12px" }}
                    >
                      {status.message}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form fields */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {fields.map((field, i) => (
                  <motion.div
                    key={field.name}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                  >
                    <FormControl required>
                      <FormLabel sx={{ fontSize: "0.8rem", fontWeight: 600, color: "text.secondary", mb: 0.5 }}>
                        {field.label}
                      </FormLabel>
                      <Input
                        startDecorator={field.icon}
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        sx={{
                          borderRadius: "12px",
                          "--Input-focusedThickness": "2px",
                          "&:focus-within": { borderColor: "primary.400" },
                          fontSize: "0.9rem",
                        }}
                      />
                    </FormControl>
                  </motion.div>
                ))}

                {/* Message textarea */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.39, duration: 0.4 }}
                >
                  <FormControl required>
                    <FormLabel sx={{ fontSize: "0.8rem", fontWeight: 600, color: "text.secondary", mb: 0.5 }}>
                      Message
                    </FormLabel>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you…"
                      minRows={4}
                      sx={{
                        borderRadius: "12px",
                        fontSize: "0.9rem",
                        "--Textarea-focusedThickness": "2px",
                        "&:focus-within": { borderColor: "primary.400" },
                      }}
                    />
                  </FormControl>
                </motion.div>

                {/* Submit */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.46, duration: 0.4 }}
                >
                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    loading={loading}
                    endDecorator={!loading && <SendIcon sx={{ fontSize: 18 }} />}
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
                    }}
                  >
                    {loading ? "Sending…" : "Send Message"}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </div>

        {/* ══════════════════════════════
            BOTTOM INFO CARDS
        ══════════════════════════════ */}
        <div className="bg-slate-50 border-t border-slate-100 px-8 py-10 relative overflow-hidden">
          {/* Blob */}
          <div className="pointer-events-none absolute right-0 top-0 w-64 h-64 rounded-full bg-blue-100/40 blur-[80px]" />

          <div className="relative z-10 max-w-[1240px] mx-auto flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
              <Chip
                variant="soft"
                color="primary"
                size="sm"
                sx={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", px: 2 }}
              >
                Find Us
              </Chip>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: <LocationOnIcon sx={{ fontSize: 18 }} />, label: "Address",  value: "Ichalkaranji, 416-115, MH" },
                { icon: <AccountCircleIcon sx={{ fontSize: 18 }} />, label: "Company", value: "MealConnect" },
                { icon: <EmailIcon sx={{ fontSize: 18 }} />,       label: "Email",   value: "mealconnect@gmail.com" },
                { icon: <LocalPhoneIcon sx={{ fontSize: 18 }} />,  label: "Phone",   value: "+91 9087654321" },
              ].map((card, i) => (
                <BottomCard key={i} {...card} index={i} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Contactus;