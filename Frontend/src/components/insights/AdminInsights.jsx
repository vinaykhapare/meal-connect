import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Chip, Alert, Input, Button, Autocomplete } from "@mui/joy";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { API_ORIGIN } from "../../services/apiBase";

const API_BASE = `${API_ORIGIN}/api/insights`;
const getToken = () => localStorage.getItem("token");

export default function AdminInsights() {
  const [period, setPeriod] = useState("daily");
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const cities = useMemo(() => {
    const rows = data?.cityStats ?? [];
    return rows.map((r) => r.city).filter(Boolean);
  }, [data]);

  const vegNon = useMemo(() => {
    const veg = data?.totals?.vegCount ?? 0;
    const non = data?.totals?.nonVegCount ?? 0;
    return [
      { id: 0, label: "Veg", value: veg, color: "#10b981" },
      { id: 1, label: "Non‑veg", value: non, color: "#f59e0b" },
    ];
  }, [data]);

  const comparison = useMemo(() => {
    const rows = data?.comparison ?? [];
    return {
      x: rows.map((r) => r.city),
      y: rows.map((r) => r.donationCount ?? 0),
    };
  }, [data]);

  const fetchInsights = async ({ nextCity = city } = {}) => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      const url = new URL(`${API_BASE}/admin`);
      url.searchParams.set("period", period);
      if (nextCity) url.searchParams.set("city", nextCity);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to load admin insights");
      setData(json.data);
    } catch (e) {
      setError(e.message || "Failed to load admin insights");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const rows = data?.cityStats ?? [];

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
      icon: "📦",
      label: "Total Donations",
      value: loading ? "…" : (data?.totals?.totalDonations ?? 0),
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: "🥗",
      label: "Total Veg",
      value: loading ? "…" : (data?.totals?.vegCount ?? 0),
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: "🍗",
      label: "Total Non‑veg",
      value: loading ? "…" : (data?.totals?.nonVegCount ?? 0),
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: "📊",
      label: "Total Amount",
      value: loading ? "…" : (data?.totals?.totalAmount ?? 0),
      subtext: "area coverage",
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
          Admin Insights
        </h1>
        <p className="text-slate-500 text-sm md:text-base" style={{ fontFamily: "Sora, sans-serif" }}>
          City-wise donation stats + veg/non‑veg split
        </p>
      </motion.div>

      {/* Controls Section */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row gap-4 md:items-end md:justify-between bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100"
      >
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end flex-1">
          <div className="flex-1 sm:flex-initial">
            <label className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "Sora, sans-serif" }}>
              Filter by City
            </label>
            <Autocomplete
              placeholder="Search city..."
              options={cities}
              value={city}
              onChange={(_, v) => {
                setCity(v);
                fetchInsights({ nextCity: v });
              }}
              slotProps={{
                input: {
                  size: "md",
                },
              }}
              sx={{
                borderColor: "#e2e8f0",
                "--Input-focusedHighlight": "rgba(59, 130, 246, 0.1)",
                "--Input-focusedBorderColor": "#3b82f6",
                minWidth: 260,
              }}
            />
          </div>

          <div className="flex-1 sm:flex-initial">
            <label className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "Sora, sans-serif" }}>
              Time Period
            </label>
            <div className="flex gap-2 bg-white rounded-lg p-1 border border-slate-200">
              {["daily", "monthly", "yearly"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    period === p
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
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
        {/* Veg vs Non-Veg Pie Chart */}
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(59, 130, 246, 0.15)" }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Gradient Top Bar */}
          <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-600" />

          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🥗</span>
              <Chip
                variant="plain"
                size="sm"
                label="Distribution"
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
              Veg vs Non‑veg
            </h3>

            <div className="flex justify-center w-full overflow-x-auto">
              {vegNon.some((v) => v.value > 0) ? (
                <PieChart
                  series={[
                    {
                      data: vegNon,
                      innerRadius: 35,
                      outerRadius: 90,
                      paddingAngle: 2,
                      cornerRadius: 4,
                    },
                  ]}
                  width={420}
                  height={220}
                  colors={vegNon.map((v) => v.color)}
                  slotProps={{
                    legend: { hidden: false },
                  }}
                />
              ) : (
                <div className="h-56 flex items-center justify-center text-slate-400">
                  <p className="text-sm" style={{ fontFamily: "Sora, sans-serif" }}>
                    No data available yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* City Comparison Bar Chart */}
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(59, 130, 246, 0.15)" }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Gradient Top Bar */}
          <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-600" />

          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <Chip
                variant="plain"
                size="sm"
                label="Comparison"
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

            <h3
              className="text-lg font-bold text-slate-900"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              City Comparison (Top 10)
            </h3>

            <div className="flex justify-center w-full overflow-x-auto">
              {comparison.x.length > 0 ? (
                <BarChart
                  xAxis={[{ scaleType: "band", data: comparison.x }]}
                  series={[{ data: comparison.y, label: "Donations", color: "#3b82f6" }]}
                  width={560}
                  height={240}
                  margin={{ left: 60, right: 20, top: 10, bottom: 40 }}
                  slotProps={{
                    legend: { hidden: false },
                  }}
                />
              ) : (
                <div className="h-56 flex items-center justify-center text-slate-400">
                  <p className="text-sm" style={{ fontFamily: "Sora, sans-serif" }}>
                    No comparison data available yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* City-wise Table */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm hover:shadow-md transition-shadow"
      >
        {/* Gradient Top Bar */}
        <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-600" />

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <Chip
              variant="plain"
              size="sm"
              label="City Stats"
              sx={{
                backgroundColor: "rgba(168, 85, 247, 0.08)",
                color: "#7e22ce",
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
            City-wise Table
          </h3>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <tr>
                  {["City", "Donations", "Veg", "Non‑veg", "Amount"].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left font-semibold text-slate-700 text-xs uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rows.map((r, idx) => (
                  <motion.tr
                    key={r.city || idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">{r.city || "—"}</td>
                    <td className="px-6 py-4 text-slate-600">{r.donationCount ?? 0}</td>
                    <td className="px-6 py-4 text-emerald-600 font-medium">{r.vegCount ?? 0}</td>
                    <td className="px-6 py-4 text-amber-600 font-medium">{r.nonVegCount ?? 0}</td>
                    <td className="px-6 py-4 text-purple-600 font-medium">{r.totalAmount ?? 0}</td>
                  </motion.tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                      <p style={{ fontFamily: "Sora, sans-serif" }}>No data available</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}