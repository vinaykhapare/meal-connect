import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Chip, Alert, Button } from "@mui/joy";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { API_ORIGIN } from "../../services/apiBase";

const API_BASE = `${API_ORIGIN}/api/insights`;
const getToken = () => localStorage.getItem("token");

export default function NgoInsights() {
  const [period, setPeriod] = useState("daily");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const nearbyBar = useMemo(() => {
    const rows = data?.nearbyArea ?? [];
    return {
      x: rows.map((r) => r.areaLabel),
      donationCount: rows.map((r) => r.donationCount ?? 0),
    };
  }, [data]);

  const trend = useMemo(() => {
    const rows = data?.trend ?? [];
    return {
      x: rows.map((r) => r.period),
      received: rows.map((r) => r.receivedCount ?? 0),
      amount: rows.map((r) => r.totalAmount ?? 0),
    };
  }, [data]);

  const fetchInsights = async () => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      const url = new URL(`${API_BASE}/ngo`);
      url.searchParams.set("period", period);
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to load NGO insights");
      setData(json.data);
    } catch (e) {
      setError(e.message || "Failed to load NGO insights");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const perf = data?.performance;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const statCards = [
    {
      icon: "📍",
      label: "Nearby Prefix",
      value: loading ? "…" : (data?.nearbyPrefix ?? "—"),
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: "📦",
      label: "Total Received",
      value: loading ? "…" : (perf?.totalReceived ?? 0),
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: "📊",
      label: "Amount Received",
      value: loading ? "…" : (perf?.totalAmountReceived ?? 0),
      subtext: "area coverage",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: "🥗",
      label: "Veg / Non‑veg",
      value: loading ? "…" : `${perf?.vegReceived ?? 0} / ${perf?.nonVegReceived ?? 0}`,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <motion.div
      className="w-full p-6 max-md:p-4 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="space-y-1">
        <h1
          className="text-3xl md:text-4xl font-bold"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          NGO Insights
        </h1>
        <p className="text-slate-500 text-sm md:text-base" style={{ fontFamily: "Sora, sans-serif" }}>
          Nearby area activity + NGO performance trends
        </p>
      </motion.div>

      {/* Controls Section */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">⏱️</span>
          <div>
            <p className="text-sm font-semibold text-slate-700" style={{ fontFamily: "Sora, sans-serif" }}>
              Select Period
            </p>
            <p className="text-xs text-slate-500">Filter insights by time range</p>
          </div>
        </div>

        <div className="flex gap-2 bg-white rounded-lg p-1 border border-slate-200 sm:ml-auto">
          {["daily", "monthly", "yearly"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                period === p
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={fetchInsights}
            loading={loading}
            sx={{
              background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
              color: "white",
              fontWeight: 600,
              borderRadius: "0.5rem",
              textTransform: "none",
              padding: "0.75rem 1.5rem",
              "&:hover": {
                background: "linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)",
              },
            }}
          >
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </motion.div>
      </motion.div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Alert
              variant="soft"
              color="danger"
              sx={{
                borderRadius: "1rem",
                padding: "1rem",
                fontSize: "0.875rem",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                {error}
              </div>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(59, 130, 246, 0.15)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm hover:shadow-md transition-shadow h-full">
              {/* Gradient Top Bar */}
              <div className={`h-2 bg-gradient-to-r ${stat.color}`} />

              <div className="p-5 space-y-2">
                {/* Eyebrow Label with Icon */}
                <div className="flex items-center gap-2">
                  <span className="text-xl">{stat.icon}</span>
                  <Chip
                    variant="plain"
                    size="sm"
                    label={stat.label}
                    sx={{
                      backgroundColor: "rgba(59, 130, 246, 0.08)",
                      color: "#1e40af",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  />
                </div>

                {/* Value */}
                <h3
                  className="text-2xl font-bold text-slate-900"
                  style={{ fontFamily: "Sora, sans-serif" }}
                >
                  {stat.value}
                </h3>

                {/* Subtext */}
                {stat.subtext && (
                  <p className="text-xs text-slate-500" style={{ fontFamily: "Sora, sans-serif" }}>
                    {stat.subtext}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Nearby Area Bar Chart */}
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(59, 130, 246, 0.15)" }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Gradient Top Bar */}
          <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-600" />

          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🗺️</span>
              <Chip
                variant="plain"
                size="sm"
                label="Area Insights"
                sx={{
                  backgroundColor: "rgba(6, 182, 212, 0.08)",
                  color: "#0891b2",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              />
            </div>

            <div>
              <h3
                className="text-lg font-bold text-slate-900 mb-1"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                Nearby Area Insights
              </h3>
              <p className="text-xs text-slate-500" style={{ fontFamily: "Sora, sans-serif" }}>
                Area derived from donation pincode (first 4 digits)
              </p>
            </div>

            <div className="flex justify-center w-full overflow-x-auto">
              {nearbyBar.x.length > 0 ? (
                <BarChart
                  xAxis={[{ scaleType: "band", data: nearbyBar.x }]}
                  series={[{ data: nearbyBar.donationCount, label: "Donations", color: "#06b6d4" }]}
                  width={560}
                  height={260}
                  margin={{ left: 60, right: 20, top: 10, bottom: 40 }}
                  slotProps={{
                    legend: { hidden: false },
                  }}
                />
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-400">
                  <p className="text-sm" style={{ fontFamily: "Sora, sans-serif" }}>
                    No area data available yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Growth Trend Line Chart */}
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(59, 130, 246, 0.15)" }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Gradient Top Bar */}
          <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-600" />

          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">📈</span>
              <Chip
                variant="plain"
                size="sm"
                label="Performance"
                sx={{
                  backgroundColor: "rgba(16, 185, 129, 0.08)",
                  color: "#047857",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              />
            </div>

            <h3
              className="text-lg font-bold text-slate-900"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Growth Trend (Received)
            </h3>

            <div className="flex justify-center w-full overflow-x-auto">
              {trend.x.length > 0 ? (
                <LineChart
                  xAxis={[{ scaleType: "point", data: trend.x }]}
                  series={[
                    { data: trend.received, label: "Received", color: "#10b981" },
                    { data: trend.amount, label: "Amount", color: "#3b82f6" },
                  ]}
                  width={560}
                  height={260}
                  margin={{ left: 60, right: 20, top: 10, bottom: 40 }}
                  slotProps={{
                    legend: { hidden: false },
                  }}
                />
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-400">
                  <p className="text-sm" style={{ fontFamily: "Sora, sans-serif" }}>
                    No trend data available yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}