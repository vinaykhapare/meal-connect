import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

// Components
import Sidebardashboard from "../components/dashboard/Sidebardashboard";
import Profile from "../components/dashboard/Profile";
import BarChartDashboard from "../components/charts/BarChartDashboard";
import DonationRequests from "../components/dashboard/DonationRequests";
import QRModal from "../components/donation/QRModal";

// MUI Joy
import Chip from "@mui/joy/Chip";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";

// Icons
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InboxIcon from "@mui/icons-material/Inbox";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import HistoryIcon from "@mui/icons-material/History";
import BoltIcon from "@mui/icons-material/Bolt";
import QrCode2Icon from "@mui/icons-material/QrCode2";

/* ── Status chip config ── */
const statusConfig = {
  Pending: { color: "warning", variant: "soft", dot: "bg-amber-400" },
  Accepted: { color: "success", variant: "soft", dot: "bg-green-400" },
  Completed: { color: "success", variant: "solid", dot: "bg-green-600" },
  Cancelled: { color: "danger", variant: "soft", dot: "bg-red-400" },
};
const getChipProps = (status) =>
  statusConfig[status] || {
    color: "neutral",
    variant: "soft",
    dot: "bg-slate-400",
  };

/* ── Section header ── */
function SectionHeader({ icon, title, count }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
        >
          <span className="text-white">{icon}</span>
        </div>
        <h2
          className="text-lg font-black text-slate-800"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </h2>
      </div>
      {count !== undefined && (
        <Chip
          size="sm"
          variant="soft"
          color="primary"
          sx={{ fontSize: "0.65rem", fontWeight: 700 }}
        >
          {count} {count === 1 ? "entry" : "entries"}
        </Chip>
      )}
    </div>
  );
}

/* ── Empty state ── */
function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
        <InboxIcon sx={{ color: "#94a3b8", fontSize: 24 }} />
      </div>
      <p
        className="text-slate-400 text-sm"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        {message}
      </p>
    </div>
  );
}

/* ── Donation table ── */
function DonationTable({ donations, showActions, onCancel, onViewQR }) {
  if (donations.length === 0) return null;

  return (
    <Sheet
      variant="outlined"
      sx={{
        borderRadius: "14px",
        overflow: "hidden",
        border: "1px solid #e2e8f0",
      }}
    >
      <Table
        stickyHeader
        hoverRow
        sx={{
          "& thead th": {
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#94a3b8",
            background: "#f8fafc",
            py: 1.5,
          },
          "& tbody td": { fontSize: "0.85rem", color: "#334155", py: 1.5 },
          "& tbody tr:hover td": { background: "#f8fafc" },
        }}
      >
        <thead>
          <tr>
            <th style={{ width: 48 }}>#</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Count</th>
            <th>Status</th>
            <th style={{ width: 120 }}>QR Code</th>
            {showActions && <th style={{ width: 96 }}>Action</th>}
          </tr>
        </thead>
        <tbody>
          {donations.map((donation, i) => {
            const chip = getChipProps(donation.status);
            return (
              <tr key={donation._id}>
                <td>
                  <span className="text-slate-400 font-medium text-xs">
                    {i + 1}
                  </span>
                </td>
                <td>
                  <span
                    className="font-semibold text-slate-700"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    {donation.name}
                  </span>
                </td>
                <td className="text-slate-500">{donation.phone}</td>
                <td className="text-slate-500">
                  {new Date(donation.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td>
                  <span className="font-semibold text-slate-700">
                    {donation.totalCount}
                  </span>
                </td>
                <td>
                  <Chip
                    color={chip.color}
                    variant={chip.variant}
                    size="sm"
                    startDecorator={
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${chip.dot}`}
                      />
                    }
                    sx={{ fontSize: "0.7rem", fontWeight: 600 }}
                  >
                    {donation.status}
                  </Chip>
                </td>
                {/* QR Code column — only show button for Pending/Accepted donations that have a QR */}
                <td>
                  {donation.qrCodeDataUrl &&
                  donation.status !== "Completed" &&
                  donation.status !== "Cancelled" ? (
                    <Button
                      size="sm"
                      variant="soft"
                      color="primary"
                      startDecorator={<QrCode2Icon sx={{ fontSize: 14 }} />}
                      onClick={() => onViewQR && onViewQR(donation)}
                      sx={{
                        borderRadius: "100px",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        px: 1.5,
                      }}
                    >
                      View QR
                    </Button>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </td>
                {showActions && (
                  <td>
                    {donation.status === "Pending" && (
                      <Button
                        size="sm"
                        variant="soft"
                        color="danger"
                        startDecorator={<CancelIcon sx={{ fontSize: 14 }} />}
                        onClick={() => onCancel(donation)}
                        sx={{
                          borderRadius: "100px",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          px: 1.5,
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Sheet>
  );
}

/* ════════════════════════════════
   MAIN COMPONENT
════════════════════════════════ */
function Dashboard() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [donationToCancel, setDonationToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  // QR re-view state — so donor can show QR again after closing the initial modal
  const [qrView, setQrView] = useState({ open: false, url: "", id: "" });

  const isVerifiedNGO = profile?.verificationStatus?.status === "Verified";

  /* ── Fetch donations ── */
  useEffect(() => {
    if (!user) return;
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:3000/api/food/user-donations",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        if (data.success) setDonations(data.data);
        else throw new Error(data.message);
      } catch (err) {
        setError("Failed to fetch donations");
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, [user]);

  const activeDonations = donations.filter((d) => d.status === "Pending");
  const historyDonations = donations.filter((d) => d.status !== "Pending");

  /* ── Status update ── */
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/api/food/update-status/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      const data = await res.json();
      if (data.success) {
        setDonations((prev) =>
          prev.map((d) => (d._id === id ? { ...d, status: newStatus } : d)),
        );
      } else throw new Error(data.message);
    } catch {
      // handled silently — could toast here
    }
  };

  const handleCancelConfirmation = (donation) => {
    setDonationToCancel(donation);
    setCancelModalOpen(true);
  };

  const handleCancel = async () => {
    if (!donationToCancel) return;
    setCancelling(true);
    await handleStatusUpdate(donationToCancel._id, "Cancelled");
    setCancelling(false);
    setCancelModalOpen(false);
    setDonationToCancel(null);
  };

  /* ── Tab content ── */
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;

      case "donations":
        return isVerifiedNGO ? (
          <DonationRequests />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
              <WarningAmberIcon sx={{ color: "#f59e0b", fontSize: 28 }} />
            </div>
            <p
              className="text-slate-500 text-sm font-medium text-center max-w-xs"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Please wait for NGO verification to access donation requests.
            </p>
          </div>
        );

      case "analytics":
        return (
          <div className="p-6 max-md:p-4">
            <BarChartDashboard />
          </div>
        );

      case "inaction":
        return (
          <div className="p-6 max-md:p-4">
            <SectionHeader
              icon={<BoltIcon sx={{ fontSize: 16 }} />}
              title="In Action"
              count={activeDonations.length}
            />
            {activeDonations.length > 0 ? (
              <DonationTable
                donations={activeDonations}
                showActions
                onCancel={handleCancelConfirmation}
                onViewQR={(d) =>
                  setQrView({ open: true, url: d.qrCodeDataUrl, id: d._id })
                }
              />
            ) : (
              <EmptyState message="No active donations at the moment" />
            )}
          </div>
        );

      case "history":
        return (
          <div className="p-6 max-md:p-4">
            <SectionHeader
              icon={<HistoryIcon sx={{ fontSize: 16 }} />}
              title="Donation History"
              count={historyDonations.length}
            />
            {historyDonations.length > 0 ? (
              <DonationTable
                donations={historyDonations}
                showActions={false}
                onCancel={() => {}}
                onViewQR={(d) =>
                  setQrView({ open: true, url: d.qrCodeDataUrl, id: d._id })
                }
              />
            ) : (
              <EmptyState message="No donation history found" />
            )}
          </div>
        );

      default:
        return <Profile />;
    }
  };

  /* ── Global loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <CircularProgress color="primary" size="lg" />
          <p
            className="text-sm text-slate-400 animate-pulse"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Loading your dashboard…
          </p>
        </div>
      </div>
    );
  }

  /* ── Global error ── */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
            <ErrorOutlineIcon sx={{ color: "#ef4444", fontSize: 28 }} />
          </div>
          <p
            className="text-red-400 text-sm font-medium"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            {error}
          </p>
          <Button
            size="sm"
            variant="soft"
            color="primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Sora:wght@300;400;500;600&display=swap');
      `}</style>

      {/* QR re-view modal */}
      <QRModal
        open={qrView.open}
        qrCodeDataUrl={qrView.url}
        donationId={qrView.id}
        onClose={() => setQrView({ open: false, url: "", id: "" })}
      />

      <div className="flex min-h-screen bg-slate-50">
        {/* ── Sidebar ── */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex-shrink-0"
        >
          <Sidebardashboard
            activeTab={activeTab}
            onTabChange={setActiveTab}
            showDonationsTab={isVerifiedNGO}
          />
        </motion.div>

        {/* ── Main content ── */}
        <main className="flex-1 overflow-y-auto min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* ── Cancel confirmation modal ── */}
        <Modal
          open={cancelModalOpen}
          onClose={() => !cancelling && setCancelModalOpen(false)}
        >
          <ModalDialog
            sx={{
              borderRadius: "20px",
              p: 0,
              overflow: "hidden",
              maxWidth: 380,
              border: "1px solid",
              borderColor: "danger.100",
              boxShadow: "0 20px 60px rgba(239,68,68,0.12)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              {/* Modal header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-red-50 bg-red-50/60">
                <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                  <CancelIcon sx={{ color: "#ef4444", fontSize: 20 }} />
                </div>
                <div>
                  <p
                    className="text-sm font-bold text-slate-800"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    Cancel Donation
                  </p>
                  <p
                    className="text-xs text-slate-400"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    This action cannot be undone
                  </p>
                </div>
              </div>

              {/* Modal body */}
              <div className="px-6 py-5">
                <p
                  className="text-sm text-slate-600 leading-relaxed mb-1"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  Are you sure you want to cancel the donation by{" "}
                  <span className="font-semibold text-slate-800">
                    {donationToCancel?.name}
                  </span>
                  ?
                </p>
                {donationToCancel && (
                  <div
                    className="mt-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    <span className="font-medium">Count:</span>{" "}
                    {donationToCancel.totalCount} &nbsp;·&nbsp;
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(donationToCancel.date).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div className="flex gap-2 justify-end px-6 pb-5">
                <Button
                  variant="plain"
                  color="neutral"
                  onClick={() => setCancelModalOpen(false)}
                  disabled={cancelling}
                  sx={{
                    borderRadius: "100px",
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  Keep it
                </Button>
                <Button
                  variant="solid"
                  color="danger"
                  loading={cancelling}
                  startDecorator={
                    !cancelling && <CancelIcon sx={{ fontSize: 16 }} />
                  }
                  onClick={handleCancel}
                  sx={{
                    borderRadius: "100px",
                    fontWeight: 700,
                    px: 2.5,
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  Yes, Cancel
                </Button>
              </div>
            </motion.div>
          </ModalDialog>
        </Modal>
      </div>
    </>
  );
}

export default Dashboard;
