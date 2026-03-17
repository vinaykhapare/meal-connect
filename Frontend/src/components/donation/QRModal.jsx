import { motion, AnimatePresence } from "framer-motion";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

/**
 * QRModal — displayed to the donor immediately after a donation is created.
 *
 * Props:
 *   open          {boolean}  — whether the modal is visible
 *   onClose       {fn}       — called when the user dismisses the modal
 *   qrCodeDataUrl {string}   — base64 PNG data URL of the QR code
 *   donationId    {string}   — the donation _id (shown for reference)
 */
function QRModal({ open, onClose, qrCodeDataUrl, donationId }) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrCodeDataUrl;
    link.download = `donation-qr-${donationId?.slice(-6) ?? "code"}.png`;
    link.click();
  };

  return (
    <AnimatePresence>
      {open && (
        // Backdrop
        <motion.div
          key="qr-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)" }}
          onClick={onClose}
        >
          {/* Modal card — stop propagation so clicking card doesn't close */}
          <motion.div
            key="qr-card"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient header */}
            <div
              className="relative px-6 pt-8 pb-6 flex flex-col items-center text-center"
              style={{ background: "linear-gradient(135deg, #3b5bdb 0%, #4f46e5 100%)" }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-all duration-150"
                aria-label="Close QR modal"
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </button>

              {/* QR icon badge */}
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-3 shadow-lg">
                <QrCode2Icon sx={{ fontSize: 30, color: "#fff" }} />
              </div>

              <h2
                className="text-xl font-black text-white leading-tight"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Your Donation QR Code
              </h2>
              <p className="text-white/75 text-xs mt-1.5 leading-relaxed max-w-[240px]">
                Show this to the NGO when they collect your food donation.
              </p>
            </div>

            {/* QR image section */}
            <div className="px-6 py-5 flex flex-col items-center gap-4 bg-white">

              {/* Success badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                <CheckCircleOutlineIcon sx={{ fontSize: 14, color: "#059669" }} />
                <span className="text-xs font-semibold text-emerald-700">Donation Registered!</span>
              </div>

              {/* QR image */}
              {qrCodeDataUrl ? (
                <div className="relative p-3 rounded-2xl border-2 border-indigo-100 bg-white shadow-inner">
                  <img
                    src={qrCodeDataUrl}
                    alt="Donation QR Code"
                    className="w-52 h-52 object-contain rounded-lg"
                  />
                  {/* Corner accents */}
                  <span className="absolute top-1.5 left-1.5 w-4 h-4 border-t-2 border-l-2 border-indigo-400 rounded-tl-md" />
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 border-t-2 border-r-2 border-indigo-400 rounded-tr-md" />
                  <span className="absolute bottom-1.5 left-1.5 w-4 h-4 border-b-2 border-l-2 border-indigo-400 rounded-bl-md" />
                  <span className="absolute bottom-1.5 right-1.5 w-4 h-4 border-b-2 border-r-2 border-indigo-400 rounded-br-md" />
                </div>
              ) : (
                <div className="w-52 h-52 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <span className="text-slate-400 text-xs">Generating QR…</span>
                </div>
              )}

              {/* Donation ID chip */}
              {donationId && (
                <p className="text-[10px] text-slate-400 font-mono">
                  ID: {donationId.slice(-12)}
                </p>
              )}

              {/* Info box */}
              <div className="w-full rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                <p className="text-xs text-slate-500 leading-relaxed text-center">
                  🔒 This QR is <strong>unique and one-time use</strong>. The NGO will
                  scan it to confirm the pickup. Once scanned, it cannot be reused.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleDownload}
                  disabled={!qrCodeDataUrl}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all duration-150 disabled:opacity-40"
                >
                  <DownloadIcon sx={{ fontSize: 16 }} />
                  Download
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 flex items-center justify-center py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-150 hover:brightness-110"
                  style={{ background: "linear-gradient(135deg, #3b5bdb, #4f46e5)" }}
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default QRModal;
