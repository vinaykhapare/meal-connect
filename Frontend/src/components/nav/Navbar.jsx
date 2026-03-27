import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Drawer,
  IconButton,
  Chip,
  Avatar,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import HistoryIcon from "@mui/icons-material/History";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { useAuth } from "../../context/AuthContext";
import mealconnectLogo from "../../assets/mealconnect_logo_primary.svg";

/* ── Desktop nav link ── */
function NavLink({ to, children, icon, active }) {
  return (
    <Link
      to={to}
      className={`
        relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
        transition-all duration-200 no-underline group
        ${active
          ? "text-blue-600 bg-blue-50"
          : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
        }
      `}
    >
      {icon && <span className="text-[16px] leading-none">{icon}</span>}
      {children}
      {active && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
      )}
    </Link>
  );
}

/* ── Mobile drawer link ── */
function DrawerLink({ to, children, icon, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
        transition-all duration-150 no-underline w-full
        ${active
          ? "text-blue-600 bg-blue-50 border border-blue-100"
          : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
        }
      `}
    >
      <span className={`${active ? "text-blue-500" : "text-slate-400"}`}>{icon}</span>
      {children}
    </Link>
  );
}

/* ════════════════════════════════
   ADMIN NAVBAR
════════════════════════════════ */
function AdminNavbar({ user, handleLogout }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const adminLinks = [
    { label: "Dashboard",       to: "/admin/dashboard",              icon: <DashboardIcon fontSize="small" /> },
    { label: "Insights",        to: "/admin/insights",               icon: <QueryStatsIcon fontSize="small" /> },
    { label: "NGO Requests",    to: "/admin/dashboard?tab=requests", icon: <HowToRegIcon fontSize="small" /> },
    { label: "NGO Management",  to: "/admin/dashboard?tab=ngos",     icon: <BusinessIcon fontSize="small" /> },
    { label: "User Management", to: "/admin/dashboard?tab=users",    icon: <PeopleIcon fontSize="small" /> },
  ];

  return (
    <nav
      className="flex items-center justify-between px-6 py-3 shadow-lg"
      style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2">
        <AdminPanelSettingsIcon sx={{ color: "#f59e0b", fontSize: 26 }} />
        <span className="text-amber-400 font-bold text-lg tracking-tight">MealConnect</span>
        <Chip
          label="ADMIN"
          size="small"
          sx={{
            ml: 0.5,
            fontSize: "0.6rem",
            letterSpacing: "0.08em",
            background: "rgba(245,158,11,0.15)",
            color: "#f59e0b",
            border: "1px solid rgba(245,158,11,0.3)",
            fontWeight: 700,
          }}
        />
      </div>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-1">
        {adminLinks.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-amber-400 hover:bg-amber-400/10 transition-all duration-150 no-underline"
          >
            <span className="text-slate-400">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right side */}
      <div className="hidden md:flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          <Avatar sx={{ width: 24, height: 24, bgcolor: "#f59e0b", fontSize: "0.7rem" }}>
            {user?.name?.[0]?.toUpperCase() || "A"}
          </Avatar>
          <span className="text-slate-300 text-xs font-medium">{user?.name || "Admin"}</span>
        </div>
        <Button
          variant="outlined"
          size="small"
          startIcon={<LogoutIcon fontSize="small" />}
          onClick={handleLogout}
          sx={{
            borderRadius: "100px",
            borderColor: "#f59e0b",
            color: "#f59e0b",
            fontWeight: 600,
            textTransform: "none",
            "&:hover": { borderColor: "#d97706", background: "rgba(245,158,11,0.1)" },
          }}
        >
          Logout
        </Button>
      </div>

      {/* Mobile burger */}
      <IconButton
        onClick={() => setDrawerOpen(true)}
        sx={{ display: { md: "none" }, color: "#f59e0b" }}
        aria-label="Open menu"
      >
        <MenuIcon />
      </IconButton>

      {/* Mobile drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        anchor="left"
        PaperProps={{ sx: { display: { md: "none" } } }}
      >
        <div
          className="w-64 min-h-screen p-4 flex flex-col gap-4"
          style={{ background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AdminPanelSettingsIcon sx={{ color: "#f59e0b" }} />
              <span className="text-amber-400 font-bold">Admin Panel</span>
            </div>
            <IconButton size="small" onClick={() => setDrawerOpen(false)} sx={{ color: "#94a3b8" }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
          <div className="flex flex-col gap-1">
            {adminLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-amber-400 hover:bg-amber-400/10 transition-all no-underline"
              >
                <span className="text-slate-400">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto">
            <button
              onClick={() => { handleLogout(); setDrawerOpen(false); }}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400/10 text-amber-400 text-sm font-medium hover:bg-amber-400/20 transition-all border border-amber-400/20"
            >
              <LogoutIcon fontSize="small" />
              Logout
            </button>
          </div>
        </div>
      </Drawer>
    </nav>
  );
}

/* ════════════════════════════════
   MAIN NAVBAR
════════════════════════════════ */
function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === "admin";
  const isNGO   = user?.role === "ngo";
  const isUser  = isAuthenticated && !isAdmin && !isNGO;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  // Match both pathname and query string for tab-based links (e.g. /ngo/dashboard?tab=profile)
  const isActive = (to) => {
    const [path, query] = to.split("?");
    if (query) {
      return location.pathname === path && location.search === `?${query}`;
    }
    // For plain paths, also treat /ngo/dashboard as active when no tab param present
    if (to === "/ngo/dashboard") {
      return location.pathname === to && !location.search;
    }
    return location.pathname === to;
  };

  if (isAdmin) return <AdminNavbar user={user} handleLogout={handleLogout} />;

  const publicLinks = [
    { label: "Home",  to: "/",      icon: <HomeIcon sx={{ fontSize: 16 }} /> },
    { label: "About", to: "/about", icon: <InfoIcon sx={{ fontSize: 16 }} /> },
  ];

  const userLinks = [
    { label: "Contact",   to: "/contact",  icon: <ContactMailIcon sx={{ fontSize: 16 }} /> },
    { label: "Donate",    to: "/donate",   icon: <VolunteerActivismIcon sx={{ fontSize: 16 }} /> },
    { label: "Dashboard", to: "/dashboard",icon: <DashboardIcon sx={{ fontSize: 16 }} /> },
    { label: "Insights",  to: "/insights/user", icon: <QueryStatsIcon sx={{ fontSize: 16 }} /> },
  ];

  const ngoLinks = [
    { label: "Overview",    to: "/ngo/dashboard",              icon: <DashboardIcon sx={{ fontSize: 16 }} /> },
    { label: "Insights",    to: "/ngo/insights",               icon: <QueryStatsIcon sx={{ fontSize: 16 }} /> },
    { label: "My Profile",  to: "/ngo/dashboard?tab=profile",  icon: <PersonIcon sx={{ fontSize: 16 }} /> },
    { label: "History",     to: "/ngo/dashboard?tab=history",  icon: <HistoryIcon sx={{ fontSize: 16 }} /> },
    { label: "Nearby NGOs", to: "/ngo/dashboard?tab=nearby",   icon: <LocationOnIcon sx={{ fontSize: 16 }} /> },
  ];

  const navLinks = [
    ...publicLinks,
    ...(isAuthenticated && (isUser || isNGO)
      ? [{ label: "Contact", to: "/contact", icon: <ContactMailIcon sx={{ fontSize: 16 }} /> }]
      : []),
    ...(isUser ? userLinks.filter((l) => l.label !== "Contact") : []),
    ...(isNGO  ? ngoLinks : []),
  ];

  const seen = new Set();
  const dedupedLinks = navLinks.filter((l) => {
    if (seen.has(l.to)) return false;
    seen.add(l.to);
    return true;
  });

  return (
    <nav className={`
      sticky top-0 z-50 flex items-center justify-between
      px-6 py-2 bg-white/90 backdrop-blur-md
      transition-all duration-300
      ${scrolled ? "shadow-md shadow-blue-100/60 border-b border-slate-100" : "shadow-sm"}
    `}>

      {/* Logo */}
      <Link to="/" className="flex-shrink-0 no-underline">
        <img
          src={mealconnectLogo}
          alt="MealConnect"
          className="h-14 w-auto object-contain -my-2"
        />
      </Link>

      {/* Desktop nav links */}
      <div className="hidden md:flex items-center gap-0.5">
        {dedupedLinks.map((link) => (
          <NavLink key={link.to} to={link.to} icon={link.icon} active={isActive(link.to)}>
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* Desktop auth area */}
      <div className="hidden md:flex items-center gap-2">
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
              <Avatar
                sx={{
                  width: 26, height: 26,
                  bgcolor: "#3b5bdb",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                }}
              >
                {user?.name?.[0]?.toUpperCase() || "U"}
              </Avatar>
              <span className="text-sm font-medium text-slate-700">{user?.name}</span>
              {isNGO && (
                <Chip
                  label="NGO"
                  size="small"
                  sx={{
                    fontSize: "0.6rem",
                    background: "#dcfce7",
                    color: "#166534",
                    border: "1px solid #bbf7d0",
                    fontWeight: 700,
                    height: 20,
                  }}
                />
              )}
            </div>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<LogoutIcon fontSize="small" />}
              onClick={handleLogout}
              sx={{ borderRadius: "100px", fontWeight: 600, textTransform: "none" }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all no-underline"
            >
              <LoginIcon sx={{ fontSize: 16 }} />
              Login
            </Link>
            <Link
              to="/ngo-login"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all no-underline"
            >
              NGO Login
            </Link>
            <Button
              component={Link}
              to="/signup"
              size="small"
              variant="contained"
              sx={{
                borderRadius: "100px",
                px: 2.5,
                fontWeight: 700,
                textTransform: "none",
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                boxShadow: "0 3px 14px rgba(37,99,235,0.30)",
                "&:hover": {
                  background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 20px rgba(37,99,235,0.40)",
                },
                transition: "all 0.2s",
              }}
            >
              Register
            </Button>
          </>
        )}
      </div>

      {/* Mobile burger */}
      <IconButton
        onClick={() => setDrawerOpen(true)}
        sx={{ display: { md: "none" }, color: "#3b5bdb" }}
        aria-label="Open menu"
      >
        <MenuIcon />
      </IconButton>

      {/* Mobile Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        anchor="left"
        PaperProps={{ sx: { display: { md: "none" }, width: 288 } }}
      >
        <div className="w-full min-h-screen bg-white flex flex-col">

          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <img src={mealconnectLogo} alt="MealConnect" className="h-10 w-auto object-contain" />
            <IconButton size="small" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>

          {/* User pill */}
          {isAuthenticated && (
            <div className="mx-4 mt-4 flex items-center gap-3 px-4 py-3 rounded-2xl bg-blue-50 border border-blue-100">
              <Avatar sx={{ bgcolor: "#3b5bdb", fontWeight: 700 }}>
                {user?.name?.[0]?.toUpperCase() || "U"}
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role || "User"}</p>
              </div>
            </div>
          )}

          {/* Nav links */}
          <div className="flex flex-col gap-1 px-4 py-4 flex-1">
            {dedupedLinks.map((link) => (
              <DrawerLink
                key={link.to}
                to={link.to}
                icon={link.icon}
                active={isActive(link.to)}
                onClick={() => setDrawerOpen(false)}
              >
                {link.label}
              </DrawerLink>
            ))}
          </div>

          {/* Auth actions */}
          <div className="px-4 pb-6 flex flex-col gap-2 border-t border-slate-100 pt-4">
            {isAuthenticated ? (
              <button
                onClick={() => { handleLogout(); setDrawerOpen(false); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-500 text-sm font-semibold hover:bg-red-100 transition-all border border-red-100"
              >
                <LogoutIcon fontSize="small" />
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-50 text-slate-700 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-all no-underline border border-slate-200"
                >
                  <LoginIcon fontSize="small" />
                  Login
                </Link>
                <Link
                  to="/ngo-login"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-50 text-slate-700 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-all no-underline border border-slate-200"
                >
                  NGO Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white no-underline transition-all"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                    boxShadow: "0 4px 14px rgba(37,99,235,0.30)",
                  }}
                >
                  Register Free
                </Link>
              </>
            )}
          </div>
        </div>
      </Drawer>
    </nav>
  );
}

export default Navbar;