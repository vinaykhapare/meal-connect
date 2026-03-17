import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// MUI Joy only (no MUI Material mixing)
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Checkbox from "@mui/joy/Checkbox";
import Chip from "@mui/joy/Chip";

// Icons
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import GavelIcon from "@mui/icons-material/Gavel";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import donationimg from "../../assets/donation/WhatsApp Image 2025-02-22 at 20.10.04_1b0847ed.jpg";

/* ── Policy point row ── */
function PolicyPoint({ icon, title, body }) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-blue-500">{icon}</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-0.5"
          style={{ fontFamily: "'Sora', sans-serif" }}>
          {title}
        </p>
        <p className="text-xs text-slate-400 leading-relaxed"
          style={{ fontFamily: "'Sora', sans-serif" }}>
          {body}
        </p>
      </div>
    </div>
  );
}

export default function AgreementModal() {
  const [open, setOpen]   = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [shake, setShake]   = useState(false);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!agreed) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setOpen(false);
    navigate("/donate/form");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Sora:wght@400;500;600&display=swap');
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-6px); }
          40%      { transform: translateX(6px); }
          60%      { transform: translateX(-4px); }
          80%      { transform: translateX(4px); }
        }
        .shake { animation: shake 0.45s ease; }
      `}</style>

      {/* ── Trigger button ── */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          size="lg"
          endDecorator={<ArrowForwardIcon />}
          onClick={() => setOpen(true)}
          sx={{
            borderRadius: "100px",
            fontWeight: 700,
            px: 3.5,
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            boxShadow: "0 4px 20px rgba(37,99,235,0.38)",
            "&:hover": {
              background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
              boxShadow: "0 8px 28px rgba(37,99,235,0.48)",
            },
            transition: "all 0.2s",
            fontFamily: "'Sora', sans-serif",
          }}
        >
          Proceed to Donation
        </Button>
      </motion.div>

      {/* ── Modal ── */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <ModalDialog
          sx={{
            width: "min(92vw, 780px)",
            maxHeight: "92vh",
            p: 0,
            overflow: "hidden",
            borderRadius: "24px",
            border: "1px solid",
            borderColor: "primary.100",
            boxShadow: "0 32px 80px rgba(30,58,138,0.22)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col h-full"
          >

            {/* ── Modal header ── */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b border-slate-100"
              style={{ background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <GavelIcon sx={{ color: "white", fontSize: 20 }} />
                </div>
                <div>
                  <h3
                    className="text-white font-black text-lg leading-tight"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Agreement Policy
                  </h3>
                  <p className="text-blue-100 text-xs"
                    style={{ fontFamily: "'Sora', sans-serif" }}>
                    Please read carefully before proceeding
                  </p>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors duration-150"
              >
                <CloseIcon sx={{ color: "white", fontSize: 18 }} />
              </button>
            </div>

            {/* ── Modal body ── */}
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

              {/* Left: image */}
              <div className="md:w-[40%] flex-shrink-0 relative">
                <img
                  src={donationimg}
                  alt="Food donation"
                  className="w-full h-48 md:h-full object-cover"
                />
                {/* Overlay with quote */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-transparent to-transparent flex items-end p-5">
                  <p
                    className="text-white text-sm font-medium italic leading-snug"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    &ldquo;Every meal shared is a life changed.&rdquo;
                  </p>
                </div>
              </div>

              {/* Right: policy content */}
              <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

                <Chip
                  variant="soft"
                  color="primary"
                  size="sm"
                  sx={{ fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", width: "fit-content" }}
                >
                  Donation Terms
                </Chip>

                <div className="flex flex-col gap-4">
                  <PolicyPoint
                    icon={<VolunteerActivismIcon sx={{ fontSize: 16 }} />}
                    title="Responsible Handling"
                    body="All donated food is collected, stored, and distributed responsibly through our verified NGO partner network, ensuring it reaches those who need it most."
                  />
                  <PolicyPoint
                    icon={<CheckCircleOutlineIcon sx={{ fontSize: 16 }} />}
                    title="Safe & Verified Process"
                    body="Every donation goes through food safety checks. Our partners are trained in proper handling protocols to maintain quality from pickup to delivery."
                  />
                  <PolicyPoint
                    icon={<WarningAmberIcon sx={{ fontSize: 16 }} />}
                    title="Non-Reversible Donation"
                    body="Once a donation is submitted, it cannot be reversed. Please verify all details — food type, quantity, and pickup address — before continuing."
                  />
                </div>

                {/* Info notice */}
                <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <WarningAmberIcon sx={{ fontSize: 16, color: "#d97706", mt: 0.2, flexShrink: 0 }} />
                  <p className="text-xs text-amber-700 leading-relaxed"
                    style={{ fontFamily: "'Sora', sans-serif" }}>
                    Ensure the food you're donating is safe for consumption and within its expiry window. MealConnect reserves the right to reject donations that don't meet safety standards.
                  </p>
                </div>

              </div>
            </div>

            {/* ── Modal footer ── */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

              {/* Checkbox */}
              <div className={shake ? "shake" : ""}>
                <Checkbox
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  label={
                    <span
                      className="text-sm text-slate-600 font-medium"
                      style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                      I have read and agree to the{" "}
                      <span className="text-blue-600 font-semibold">terms and conditions</span>
                    </span>
                  }
                  sx={{
                    "--Checkbox-size": "18px",
                    color: agreed ? "primary.500" : "neutral.400",
                  }}
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Button
                  variant="plain"
                  color="neutral"
                  onClick={() => setOpen(false)}
                  sx={{ borderRadius: "100px", fontFamily: "'Sora', sans-serif" }}
                >
                  Cancel
                </Button>
                <Button
                  variant="solid"
                  color="primary"
                  endDecorator={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                  onClick={handleContinue}
                  sx={{
                    borderRadius: "100px",
                    fontWeight: 700,
                    px: 3,
                    background: agreed
                      ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                      : undefined,
                    boxShadow: agreed ? "0 4px 16px rgba(37,99,235,0.30)" : "none",
                    transition: "all 0.2s",
                    fontFamily: "'Sora', sans-serif",
                  }}
                  disabled={!agreed}
                >
                  Continue
                </Button>
              </div>
            </div>

          </motion.div>
        </ModalDialog>
      </Modal>
    </>
  );
}