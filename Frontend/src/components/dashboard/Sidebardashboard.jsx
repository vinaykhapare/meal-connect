import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// MUI Joy
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";

// Icons
import PersonIcon from "@mui/icons-material/Person";
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";

const menuItems = [
  {
    id: "profile",
    label: "Profile",
    icon: <PersonIcon sx={{ fontSize: 18 }} />,
    description: "Your account details",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChartIcon sx={{ fontSize: 18 }} />,
    description: "Donation insights",
  },
  {
    id: "inaction",
    label: "In Action",
    icon: <TableChartIcon sx={{ fontSize: 18 }} />,
    description: "Active donations",
  },
  {
    id: "history",
    label: "History",
    icon: <HistoryIcon sx={{ fontSize: 18 }} />,
    description: "Past donations",
  },
];

/* ── Single nav item ── */
function NavItem({ item, active, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.07, duration: 0.4 }}
    >
      <button
        onClick={() => onClick(item.id)}
        className={`
          relative w-full flex items-center gap-3 px-4 py-3 rounded-xl
          text-left transition-all duration-200 group
          ${active
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-200'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
          }
        `}
      >
        {/* Active left indicator */}
        {active && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-white/50"
          />
        )}

        {/* Icon */}
        <span className={`flex-shrink-0 transition-colors ${active ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`}>
          {item.icon}
        </span>

        {/* Label + description */}
        <div className="flex flex-col min-w-0">
          <span
            className={`text-sm font-semibold leading-tight ${active ? 'text-white' : 'text-slate-700'}`}
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            {item.label}
          </span>
          <span
            className={`text-[10px] leading-tight truncate ${active ? 'text-blue-100' : 'text-slate-400'}`}
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            {item.description}
          </span>
        </div>

        {/* Active dot */}
        {active && (
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70 flex-shrink-0" />
        )}
      </button>
    </motion.div>
  );
}

/* ════════════════════════════════
   MAIN COMPONENT
════════════════════════════════ */
function Sidebardashboard({ activeTab, onTabChange }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Sora:wght@300;400;500;600&display=swap');
      `}</style>

      <aside className="relative flex flex-col w-60 min-h-screen bg-white border-r border-slate-100 shadow-sm overflow-hidden">

        {/* ── Subtle top blob ── */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-blue-100/40 blur-[60px]" />

        {/* ── Brand header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative flex flex-col items-center gap-1 px-5 pt-7 pb-5"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md mb-1"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
          >
            <DashboardIcon sx={{ color: 'white', fontSize: 20 }} />
          </div>
          <h2
            className="text-base font-black text-slate-800 tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Dashboard
          </h2>
          <Chip
            variant="soft"
            color="primary"
            size="sm"
            sx={{ fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', px: 1.5 }}
          >
            Donor Portal
          </Chip>
        </motion.div>

        <Divider sx={{ mx: 2, borderColor: 'rgba(148,163,184,0.2)' }} />

        {/* ── Nav items ── */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
          {menuItems.map((item, i) => (
            <NavItem
              key={item.id}
              item={item}
              active={activeTab === item.id}
              onClick={onTabChange}
              index={i}
            />
          ))}
        </nav>

        <Divider sx={{ mx: 2, borderColor: 'rgba(148,163,184,0.2)' }} />

        {/* ── User footer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="px-3 py-4 flex flex-col gap-2"
        >
          {/* User pill */}
          {user && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-1">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', fontFamily: "'Playfair Display', serif" }}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-700 truncate"
                  style={{ fontFamily: "'Sora', sans-serif" }}>
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate"
                  style={{ fontFamily: "'Sora', sans-serif" }}>
                  {user.email}
                </p>
              </div>
            </div>
          )}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
              text-red-400 hover:text-red-600 hover:bg-red-50
              border border-transparent hover:border-red-100
              transition-all duration-200 group"
          >
            <LogoutIcon sx={{ fontSize: 17 }} className="flex-shrink-0" />
            <span
              className="text-sm font-semibold"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Logout
            </span>
          </button>
        </motion.div>

      </aside>
    </>
  );
}

export default Sidebardashboard;