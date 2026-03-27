import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Chip, Alert, Input, Button, Select, Option } from "@mui/joy";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { API_ORIGIN } from "../../services/apiBase";

const API_BASE = `${API_ORIGIN}/api/insights`;

const getToken = () => localStorage.getItem("token");

function formatCityLabel(city) {
  if (!city) return "";
  return city
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

export default function UserInsights({ initialCity = "" }) {
  const [period, setPeriod] = useState("daily");
  const [city, setCity] = useState(initialCity);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const vegNonVeg = useMemo(() => {
    const veg = data?.summary?.vegCount ?? 0;
    const non = data?.summary?.nonVegCount ?? 0;
    return [
      { id: 0, label: "Veg", value: veg, color: "#10b981" },
      { id: 1, label: "Non‑veg", value: non, color: "#f59e0b" },
    ];
  }, [data]);

  const trend = useMemo(() => {
    const rows = data?.trend ?? [];
    return {
      x: rows.map((r) => r.period),
      count: rows.map((r) => r.donationCount ?? 0),
      amount: rows.map((r) => r.totalAmount ?? 0),
    };
  }, [data]);

  const fetchInsights = async () => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      const url = new URL(`${API_BASE}/user`);
      url.searchParams.set("period", period);
      if (city.trim()) url.searchParams.set("city", city.trim());

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to load insights");
      setData(json.data);
    } catch (e) {
      setError(e.message || "Failed to load insights");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

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
          User Insights
        </h1>
        <p className="text-slate-500 text-sm md:text-base" style={{ fontFamily: "Sora, sans-serif" }}>
          Area impact + donation trends
        </p>
      </motion.div>

      {/* Controls Section */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row gap-4 md:items-end md:justify-between bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100"
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end flex-1">
          <div className="flex-1 sm:flex-initial">
            <label className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "Sora, sans-serif" }}>
              Filter by City
            </label>
            <Input
              size="md"
              placeholder="e.g., Mumbai"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") fetchInsights();
              }}
              slotProps={{
                input: {
                  className: "rounded-lg",
                },
              }}
              sx={{
                borderColor: "#e2e8f0",
                "--Input-focusedHighlight": "rgba(59, 130, 246, 0.1)",
                "--Input-focusedBorderColor": "#3b82f6",
              }}
            />
          </div>

          <div className="flex-1 sm:flex-initial">
            <label className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "Sora, sans-serif" }}>
              Time Period
            </label>
            <Select
              value={period}
              onChange={(_, value) => value && setPeriod(value)}
              slotProps={{
                button: {
                  className: "rounded-lg",
                },
              }}
              sx={{
                borderColor: "#e2e8f0",
                "--Select-focusedHighlight": "rgba(59, 130, 246, 0.1)",
                "--Select-focusedBorderColor": "#3b82f6",
                minWidth: 160,
              }}
            >
              <Option value="daily">Daily</Option>
              <Option value="monthly">Monthly</Option>
              <Option value="yearly">Yearly</Option>
            </Select>
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
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: "📍",
            label: "City",
            value: formatCityLabel(data?.city || city) || "—",
          },
          {
            icon: "📦",
            label: "Total Donations",
            value: loading ? "…" : (data?.summary?.totalDonations ?? 0),
            subtext: "count",
          },
          {
            icon: "📊",
            label: "Total Amount",
            value: loading ? "…" : (data?.summary?.totalAmount ?? 0),
            subtext: "area coverage",
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(59, 130, 246, 0.15)" }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Gradient Top Bar */}
              <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600" />

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
                label="Veg Distribution"
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
              {vegNonVeg.some((v) => v.value > 0) ? (
                <PieChart
                  series={[
                    {
                      data: vegNonVeg,
                      innerRadius: 35,
                      outerRadius: 90,
                      paddingAngle: 2,
                      cornerRadius: 4,
                    },
                  ]}
                  width={420}
                  height={220}
                  colors={vegNonVeg.map((v) => v.color)}
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

        {/* Donation Trend Line Chart */}
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(59, 130, 246, 0.15)" }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Gradient Top Bar */}
          <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-600" />

          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">📈</span>
              <Chip
                variant="plain"
                size="sm"
                label="Trend Analysis"
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
              Donation Trend
            </h3>

            <div className="flex justify-center w-full overflow-x-auto">
              {trend.x.length > 0 ? (
                <LineChart
                  xAxis={[{ scaleType: "point", data: trend.x }]}
                  series={[
                    { data: trend.count, label: "Count", color: "#3b82f6" },
                    { data: trend.amount, label: "Amount", color: "#10b981" },
                  ]}
                  width={520}
                  height={240}
                  margin={{ left: 60, right: 20, top: 10, bottom: 40 }}
                  slotProps={{
                    legend: { hidden: false },
                  }}
                />
              ) : (
                <div className="h-56 flex items-center justify-center text-slate-400">
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