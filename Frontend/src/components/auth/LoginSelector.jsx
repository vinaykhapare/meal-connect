import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Chip from '@mui/joy/Chip';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LockIcon from '@mui/icons-material/Lock';

const loginOptions = [
  {
    id: 'user',
    label: 'User Login',
    description: 'Donate food and track your impact',
    icon: <PersonIcon sx={{ fontSize: 22 }} />,
    route: '/user-login',
    accent: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    iconColor: '#3b82f6',
    hoverBorder: 'hover:border-blue-300',
    tag: 'Donor',
    tagColor: 'primary',
  },
  {
    id: 'ngo',
    label: 'NGO Login',
    description: 'Receive donations and manage distributions',
    icon: <BusinessIcon sx={{ fontSize: 22 }} />,
    route: '/ngo-login',
    accent: 'from-emerald-500 to-green-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    iconColor: '#10b981',
    hoverBorder: 'hover:border-emerald-300',
    tag: 'Organisation',
    tagColor: 'success',
  },
  {
    id: 'admin',
    label: 'Admin Login',
    description: 'Manage platform, users and NGO approvals',
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 22 }} />,
    route: '/admin/login',
    accent: 'from-slate-600 to-slate-800',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    iconColor: '#475569',
    hoverBorder: 'hover:border-slate-400',
    tag: 'Admin',
    tagColor: 'neutral',
  },
];

/* ── Login option card ── */
function LoginCard({ option, index, onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 px-5 py-4 rounded-2xl
        bg-white border ${option.border} ${option.hoverBorder}
        shadow-sm hover:shadow-md transition-all duration-200
        text-left group cursor-pointer
      `}
    >
      {/* Icon tile */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${option.bg} transition-all duration-200 group-hover:scale-105`}
        style={{ color: option.iconColor }}
      >
        {option.icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="text-sm font-bold text-slate-800"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            {option.label}
          </span>
          <Chip
            size="sm"
            color={option.tagColor}
            variant="soft"
            sx={{ fontSize: '0.58rem', letterSpacing: '0.08em', px: 1, height: 18 }}
          >
            {option.tag}
          </Chip>
        </div>
        <p
          className="text-xs text-slate-400 leading-snug"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          {option.description}
        </p>
      </div>

      {/* Arrow */}
      <div
        className={`
          w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
          bg-slate-100 text-slate-400
          group-hover:bg-gradient-to-br group-hover:${option.accent}
          group-hover:text-white transition-all duration-250
        `}
      >
        <ArrowForwardIcon sx={{ fontSize: 15 }} />
      </div>
    </motion.button>
  );
}

/* ════════════════════════════════
   MAIN COMPONENT
════════════════════════════════ */
const LoginSelector = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Sora:wght@300;400;500;600;700&display=swap');
      `}</style>

      <div className="relative min-h-screen bg-slate-50 flex items-center justify-center px-4 overflow-hidden">

        {/* ── Background blobs ── */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-blue-100/50 blur-[110px]" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-blue-50/70 blur-[90px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-emerald-50/50 blur-[80px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-md"
        >
          {/* ── Card ── */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-blue-100/30 overflow-hidden">

            {/* Header gradient bar */}
            <div
              className="h-1.5 w-full"
              style={{ background: 'linear-gradient(90deg, #3b82f6, #10b981, #475569)' }}
            />

            <div className="px-8 py-8">

              {/* Top icon + heading */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.45 }}
                className="flex flex-col items-center gap-3 mb-8 text-center"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
                >
                  <LockIcon sx={{ color: 'white', fontSize: 22 }} />
                </div>

                <div>
                  <Chip
                    variant="soft"
                    color="primary"
                    size="sm"
                    sx={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', mb: 1 }}
                  >
                    Welcome Back
                  </Chip>
                  <h1
                    className="text-2xl font-black text-slate-800 leading-tight"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Choose{' '}
                    <span
                      className="italic text-transparent bg-clip-text"
                      style={{ backgroundImage: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
                    >
                      Login Type
                    </span>
                  </h1>
                  <p
                    className="text-xs text-slate-400 mt-1"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    Select your account type to continue
                  </p>
                </div>
              </motion.div>

              {/* ── Login option cards ── */}
              <div className="flex flex-col gap-3">
                {loginOptions.map((option, i) => (
                  <LoginCard
                    key={option.id}
                    option={option}
                    index={i}
                    onClick={() => navigate(option.route)}
                  />
                ))}
              </div>

              {/* ── Bottom register nudge ── */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-xs text-slate-400 mt-6"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                New here?{' '}
                <a
                  href="/signup"
                  className="text-blue-500 font-semibold hover:text-blue-700 no-underline transition-colors"
                >
                  Create an account
                </a>
              </motion.p>

            </div>
          </div>

          {/* ── Trust line below card ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-2 mt-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <p className="text-xs text-slate-400" style={{ fontFamily: "'Sora', sans-serif" }}>
              Secure login · MealConnect Platform
            </p>
          </motion.div>

        </motion.div>
      </div>
    </>
  );
};

export default LoginSelector;