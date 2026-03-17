import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";

const API = "http://localhost:3000/api/receiver";
const getToken = () => localStorage.getItem("token");

/**
 * QRScanner — opened by an NGO to confirm a donation by scanning the donor's QR.
 *
 * Props:
 *   open         {boolean}  — controls visibility
 *   onClose      {fn}       — called when the modal is dismissed
 *   onSuccess    {fn}       — called with { donationId } after successful verification
 *   donationId   {string}   — pre-fills the context (used for display only)
 *   donorName    {string}   — shown in the modal header
 */
function QRScanner({ open, onClose, onSuccess, donationId, donorName }) {
  const scannerRef = useRef(null);   // ref to the html5-qrcode instance
  const mountRef   = useRef(null);   // ref to the DOM element the scanner attaches to
  const [status, setStatus]   = useState("idle");  // idle | scanning | success | error
  const [message, setMessage] = useState("");

  // Start scanner when modal opens
  useEffect(() => {
    if (!open) return;

    let html5QrCodeInstance = null;

    const startScanner = async () => {
      const { Html5QrcodeScanner } = await import("html5-qrcode");

      // Clean up if a previous instance exists
      if (scannerRef.current) {
        try { await scannerRef.current.clear(); } catch (_) {}
        scannerRef.current = null;
      }

      const scanner = new Html5QrcodeScanner(
        "qr-reader-container",
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true,
        },
        /* verbose= */ false,
      );

      html5QrCodeInstance = scanner;
      scannerRef.current  = scanner;
      setStatus("scanning");

      scanner.render(
        async (decodedText) => {
          // Pause scanning while we verify
          try { await scanner.pause(true); } catch (_) {}

          try {
            const payload = JSON.parse(decodedText);
            const { donationId: scannedId, token } = payload;

            if (!scannedId || !token) throw new Error("Invalid QR format");

            const res = await fetch(`${API}/verify-qr`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
              },
              body: JSON.stringify({ donationId: scannedId, token }),
            });

            const data = await res.json();

            if (data.success) {
              setStatus("success");
              setMessage(data.message || "Donation confirmed successfully!");
              try { await scanner.clear(); } catch (_) {}
              scannerRef.current = null;
              // Notify parent so it can refresh the donations list
              if (onSuccess) onSuccess({ donationId: scannedId });
            } else {
              setStatus("error");
              setMessage(data.message || "Verification failed. Please try again.");
              // Resume scanning so the user can try again
              try { scanner.resume(); } catch (_) {}
            }
          } catch (err) {
            setStatus("error");
            setMessage(err.message || "Invalid QR code. Please try again.");
            try { scanner.resume(); } catch (_) {}
          }
        },
        /* onError = */ (_errorMsg) => {
          // Frame decode errors are normal — silently ignore them
        },
      );
    };

    startScanner();

    return () => {
      // Cleanup on unmount
      if (html5QrCodeInstance) {
        html5QrCodeInstance.clear().catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleClose = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.clear(); } catch (_) {}
      scannerRef.current = null;
    }
    setStatus("idle");
    setMessage("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="scan-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(8px)" }}
          onClick={handleClose}
        >
          <motion.div
            key="scan-card"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="relative px-6 pt-7 pb-5 flex flex-col items-center text-center"
              style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)" }}
            >
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 transition-all"
                aria-label="Close scanner"
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-3">
                <QrCodeScannerIcon sx={{ fontSize: 26, color: "#fff" }} />
              </div>

              <h2
                className="text-lg font-black text-white"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Scan Donation QR
              </h2>

              {donorName && (
                <p className="text-white/60 text-xs mt-1">
                  Donor: <span className="font-semibold text-white/85">{donorName}</span>
                </p>
              )}
            </div>

            {/* Body */}
            <div className="px-5 py-5 flex flex-col items-center gap-4 bg-white">

              {/* Status: success */}
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3 py-6 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                    <CheckCircleOutlineIcon sx={{ fontSize: 36, color: "#059669" }} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Donation Confirmed!</h3>
                  <p className="text-sm text-slate-500 max-w-[260px]">{message}</p>
                  <button
                    onClick={handleClose}
                    className="mt-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #059669, #047857)" }}
                  >
                    Close
                  </button>
                </motion.div>
              )}

              {/* Status: error */}
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200"
                >
                  <ErrorOutlineIcon sx={{ fontSize: 18, color: "#dc2626", flexShrink: 0, mt: 0.2 }} />
                  <p className="text-xs font-medium text-red-700">{message}</p>
                </motion.div>
              )}

              {/* Camera view — always rendered in DOM so html5-qrcode can attach */}
              {status !== "success" && (
                <>
                  {/* The div where html5-qrcode mounts its UI */}
                  <div
                    id="qr-reader-container"
                    ref={mountRef}
                    className="w-full rounded-2xl overflow-hidden border border-slate-200"
                    style={{ minHeight: 280 }}
                  />

                  <p className="text-xs text-slate-400 text-center px-4">
                    Point the camera at the donor's QR code. Verification happens automatically.
                  </p>
                </>
              )}

              {/* Info pill */}
              {status === "scanning" && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-xs font-medium text-blue-700">Scanner active</span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default QRScanner;
