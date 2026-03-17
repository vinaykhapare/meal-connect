import { useState, useEffect, useMemo } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

// MUI Joy
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import CircularProgress from '@mui/joy/CircularProgress';
import Chip from '@mui/joy/Chip';

// Icons
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const valueFormatter = (value) => `${value} servings`;

/* ── Stat card ── */
function StatCard({ title, value, subtitle, trend, icon, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.45 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg
        hover:border-blue-100 transition-shadow duration-300 overflow-hidden"
    >
      {/* Top accent */}
      <div className="h-1 w-full" style={{ background: color }} />

      <div className="px-5 py-5 flex flex-col gap-3">
        {/* Icon + value row */}
        <div className="flex items-start justify-between">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}18` }}
          >
            <span style={{ color }}>{icon}</span>
          </div>
          <p
            className="text-3xl font-black text-slate-800 leading-none text-right"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {value}
          </p>
        </div>

        {/* Labels */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-0.5"
            style={{ fontFamily: "'Sora', sans-serif" }}>
            {title}
          </p>
          <p className="text-xs text-slate-400 leading-snug"
            style={{ fontFamily: "'Sora', sans-serif" }}>
            {subtitle}
          </p>
        </div>

        {/* Trend chip */}
        <div className="flex items-center gap-1.5">
          <TrendingUpIcon sx={{ fontSize: 13, color: '#22c55e' }} />
          <span className="text-[10px] font-semibold text-green-500 uppercase tracking-wide"
            style={{ fontFamily: "'Sora', sans-serif" }}>
            {trend}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════
   MAIN COMPONENT
════════════════════════════════ */
function BarChartDashboard() {
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState('daily');
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [analyticsData, setAnalyticsData] = useState({
    totalDonations: 0,
    distributionData: [],
    impactMetrics: { plasticAvoided: 0, energySaved: 0, waterSaved: 0 },
  });

  const statsCards = useMemo(() => [
    {
      title:    "Food Donations",
      value:    analyticsData.totalDonations.toLocaleString(),
      subtitle: "Total donation events created",
      icon:     <RestaurantIcon sx={{ fontSize: 22 }} />,
      trend:    "Across all time",
      color:    "#3b82f6",
    },
    {
      title:    "Energy Saved",
      value:    analyticsData.impactMetrics.energySaved.toLocaleString(),
      subtitle: "kWh of electricity saved",
      icon:     <ElectricBoltIcon sx={{ fontSize: 22 }} />,
      trend:    "Via food waste reduction",
      color:    "#f59e0b",
    },
    {
      title:    "Water Saved",
      value:    analyticsData.impactMetrics.waterSaved.toLocaleString(),
      subtitle: "Gallons of water conserved",
      icon:     <WaterDropIcon sx={{ fontSize: 22 }} />,
      trend:    "Through efficient distribution",
      color:    "#06b6d4",
    },
  ], [analyticsData.totalDonations, analyticsData.impactMetrics]);

  useEffect(() => {
    let isMounted = true;
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(
          `http://localhost:3000/api/analytics/distribution?period=${timeFilter}`,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch analytics');
        if (isMounted && data.success) setAnalyticsData(data.data);
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to fetch analytics data');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (user) fetchAnalytics();
    return () => { isMounted = false; };
  }, [timeFilter, user]);

  /* ── Not logged in ── */
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
          <BarChartIcon sx={{ color: '#3b82f6', fontSize: 24 }} />
        </div>
        <p className="text-slate-500 text-sm font-medium"
          style={{ fontFamily: "'Sora', sans-serif" }}>
          Please log in to view analytics
        </p>
      </div>
    );
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <CircularProgress color="primary" size="lg" />
        <p className="text-sm text-slate-400 animate-pulse"
          style={{ fontFamily: "'Sora', sans-serif" }}>
          Loading analytics…
        </p>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
          <ErrorOutlineIcon sx={{ color: '#ef4444', fontSize: 24 }} />
        </div>
        <p className="text-red-400 text-sm font-medium text-center max-w-xs"
          style={{ fontFamily: "'Sora', sans-serif" }}>
          {error}
        </p>
        <button
          onClick={() => setError(null)}
          className="text-xs text-blue-500 hover:text-blue-700 underline"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Sora:wght@300;400;500;600&display=swap');
      `}</style>

      <div className="flex flex-col gap-6 p-6 max-md:p-4">

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex items-center justify-between flex-wrap gap-3"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h2
                className="text-2xl font-black text-slate-800 leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Analytics
              </h2>
              <Chip
                variant="soft" color="primary" size="sm"
                sx={{ fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}
              >
                Live
              </Chip>
            </div>
            <p className="text-xs text-slate-400"
              style={{ fontFamily: "'Sora', sans-serif" }}>
              Your donation impact at a glance
            </p>
          </div>
        </motion.div>

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statsCards.map((card, i) => (
            <StatCard key={i} {...card} index={i} />
          ))}
        </div>

        {/* ── Chart card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          {/* Chart header */}
          <div className="flex items-center justify-between flex-wrap gap-3 px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                <BarChartIcon sx={{ color: 'white', fontSize: 17 }} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700"
                  style={{ fontFamily: "'Sora', sans-serif" }}>
                  Food Distribution Trends
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider"
                  style={{ fontFamily: "'Sora', sans-serif" }}>
                  Received vs Distributed
                </p>
              </div>
            </div>

            {/* Time filter */}
            <Select
              value={timeFilter}
              onChange={(_, value) => setTimeFilter(value)}
              size="sm"
              sx={{
                borderRadius: '100px',
                fontSize: '0.78rem',
                fontWeight: 600,
                minWidth: 110,
                '--Select-focusedThickness': '2px',
              }}
            >
              <Option value="daily">Daily</Option>
              <Option value="monthly">Monthly</Option>
              <Option value="yearly">Yearly</Option>
            </Select>
          </div>

          {/* Chart body */}
          <div className="px-4 py-4">
            {analyticsData.distributionData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                  <BarChartIcon sx={{ color: '#94a3b8', fontSize: 24 }} />
                </div>
                <p className="text-slate-400 text-sm"
                  style={{ fontFamily: "'Sora', sans-serif" }}>
                  No distribution data for this period
                </p>
              </div>
            ) : (
              <BarChart
                dataset={analyticsData.distributionData}
                xAxis={[{
                  scaleType: 'band',
                  dataKey: 'date',
                  tickLabelStyle: { fill: '#94a3b8', fontSize: 11 },
                }]}
                series={[
                  {
                    dataKey: 'received',
                    label: 'Food Received',
                    valueFormatter,
                    color: '#bfdbfe',
                  },
                  {
                    dataKey: 'distributed',
                    label: 'Food Distributed',
                    valueFormatter,
                    color: '#3b82f6',
                  },
                ]}
                height={360}
                slotProps={{
                  legend: {
                    direction: 'row',
                    position: { vertical: 'top', horizontal: 'right' },
                    padding: 0,
                    labelStyle: { fontSize: 11, fill: '#64748b' },
                  },
                }}
                sx={{
                  '& .MuiBarElement-root': { rx: 4 },
                  '& .MuiChartsAxis-line':  { stroke: '#e2e8f0' },
                  '& .MuiChartsAxis-tick':  { stroke: '#e2e8f0' },
                  '& .MuiChartsGrid-line':  { stroke: '#f1f5f9', strokeDasharray: '4 4' },
                }}
              />
            )}
          </div>
        </motion.div>

      </div>
    </>
  );
}

export default BarChartDashboard;