import Donatecard from "../utils/Donatecard";
import Marqueeanimation from "../utils/Marqueeanimation";
import { Link } from "react-router-dom";

// MUI Joy components
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";

// MUI Icons
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupsIcon from "@mui/icons-material/Groups";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

/* ── Stat card (MUI Joy Card + Tailwind layout) ── */
function StatCard({ number, period, title, description, icon, delay }) {
  return (
    <Card
      variant="outlined"
      orientation="horizontal"
      className="shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
      sx={{
        p: 0,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "primary.100",
        borderRadius: "14px",
        animationDelay: delay,
      }}
    >
      {/* Colored left accent */}
      <CardOverflow
        variant="solid"
        color="primary"
        sx={{
          flex: "0 0 110px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
          px: 2,
          background: "linear-gradient(160deg, #3b82f6 0%, #1d4ed8 100%)",
        }}
      >
        <div className="text-white/70 mb-1">{icon}</div>
        <Typography
          textColor="white"
          sx={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1 }}
        >
          {number}
        </Typography>
        <Typography textColor="primary.100" sx={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {period}
        </Typography>
      </CardOverflow>

      {/* Body */}
      <CardContent sx={{ px: 2.5, py: 2, display: "flex", flexDirection: "column", justifyContent: "center", gap: 0.5 }}>
        <Typography level="title-sm" sx={{ fontWeight: 600, color: "text.primary" }}>
          {title}
        </Typography>
        <Typography level="body-xs" sx={{ color: "text.secondary", lineHeight: 1.5 }}>
          {description}
        </Typography>
        <Button
          component={Link}
          to="/about"
          size="sm"
          variant="plain"
          color="primary"
          endDecorator={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
          sx={{ alignSelf: "flex-start", px: 0, fontSize: "0.72rem", mt: 0.5 }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}

/* ── Mini stat pill ── */
function MiniStat({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-4">
      <span className="text-xl font-bold text-blue-600 font-serif">{value}</span>
      <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium whitespace-nowrap">{label}</span>
    </div>
  );
}

/* ══════════════════════════════
   HOME PAGE
══════════════════════════════ */
export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-50 overflow-x-hidden font-sans">

      {/* ── Decorative blobs ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 -right-32 w-[600px] h-[600px] rounded-full bg-blue-200/40 blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 -left-28 w-[420px] h-[420px] rounded-full bg-blue-100/50 blur-[90px]" />
        <div className="absolute top-1/2 left-1/3 w-[280px] h-[280px] rounded-full bg-amber-100/40 blur-[80px]" />
      </div>

      <main className="relative z-10 max-w-[1240px] mx-auto px-10 pt-14 max-md:px-6 max-md:pt-8">

        {/* ════════════════════════════
            HERO SECTION
        ════════════════════════════ */}
        <section className="grid grid-cols-[1fr_460px] gap-14 items-center min-h-[88vh] pb-12 max-lg:grid-cols-1 max-lg:min-h-fit max-lg:gap-10">

          {/* ── Left: Text ── */}
          <div className="flex flex-col gap-7 animate-[fadeUp_0.7s_ease_both]">

            {/* Eyebrow chip */}
            <Chip
              variant="soft"
              color="primary"
              size="sm"
              startDecorator={
                <FiberManualRecordIcon
                  sx={{ fontSize: 8, color: "primary.500", animation: "pulse 2s infinite" }}
                />
              }
              sx={{ width: "fit-content", px: 1.5, fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase" }}
            >
              Nourishing Communities
            </Chip>

            {/* Headline */}
            <div>
              <h1 className="text-[clamp(44px,5.5vw,76px)] font-bold leading-[1.06] text-slate-800 font-serif tracking-tight">
                Every meal
                <br />
                <span className="italic text-blue-600 relative inline-block after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-blue-400 after:to-blue-600 after:rounded-full after:animate-[growX_0.6s_0.7s_ease_forwards] after:scale-x-0 after:origin-left">
                  changes a life.
                </span>
              </h1>
            </div>

            {/* Quote */}
            <blockquote className="text-lg italic text-slate-500 border-l-[3px] border-blue-200 pl-4 leading-relaxed max-w-[480px] font-serif">
              &ldquo;Food is not just eating energy. It&rsquo;s an experience.&rdquo;
            </blockquote>

            {/* Subtext */}
            <p className="text-[15px] text-slate-500 leading-[1.75] max-w-[420px]">
              Join us in sharing this experience with families who need it most.
              Together, we can end food insecurity — one meal at a time.
            </p>

            {/* CTA buttons */}
            <div className="flex gap-3 flex-wrap">
              <Button
                component={Link}
                to="/donate"
                size="lg"
                color="primary"
                endDecorator={<FavoriteIcon sx={{ fontSize: 16 }} />}
                sx={{
                  borderRadius: "100px",
                  px: 3.5,
                  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  boxShadow: "0 4px 20px rgba(37,99,235,0.38)",
                  fontWeight: 600,
                  "&:hover": {
                    background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                    boxShadow: "0 8px 28px rgba(37,99,235,0.48)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.2s",
                }}
              >
                Donate Now
              </Button>

              <Button
                component={Link}
                to="/about"
                size="lg"
                variant="outlined"
                color="primary"
                sx={{
                  borderRadius: "100px",
                  px: 3,
                  fontWeight: 600,
                  borderColor: "primary.300",
                  "&:hover": {
                    background: "primary.50",
                    borderColor: "primary.500",
                  },
                  transition: "all 0.2s",
                }}
              >
                Our Mission
              </Button>
            </div>

            {/* Mini stats bar */}
            <Card
              variant="outlined"
              sx={{
                borderRadius: "16px",
                borderColor: "primary.100",
                width: "fit-content",
                py: 1,
                px: 0,
                boxShadow: "0 2px 12px rgba(37,99,235,0.08)",
              }}
            >
              <CardContent sx={{ flexDirection: "row", alignItems: "center", gap: 0, p: "10px 0" }}>
                <MiniStat value="12k+" label="Lives Touched" />
                <Divider orientation="vertical" sx={{ height: 36, mx: 0 }} />
                <MiniStat value="467" label="Families/Month" />
                <Divider orientation="vertical" sx={{ height: 36, mx: 0 }} />
                <MiniStat value="129" label="Meals Today" />
              </CardContent>
            </Card>
          </div>

          {/* ── Right: Image + floating cards ── */}
          <div className="relative animate-[fadeUp_0.7s_0.15s_ease_both] max-lg:order-first">

            {/* Hero image */}
            <div className="relative rounded-[28px] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&q=80"
                alt="Children receiving food"
                className="w-full h-[480px] object-cover max-md:h-[280px]"
              />
              {/* Blue tint overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-blue-900/10 pointer-events-none" />
            </div>

            {/* Active badge — top right */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-full px-3.5 py-2 shadow-md border border-white/60 text-xs font-medium text-slate-700">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Active collections today
            </div>

            {/* Floating donate card — bottom left */}
            <div className="absolute -bottom-10 -left-8 z-20 w-[270px] max-lg:relative max-lg:bottom-auto max-lg:left-auto max-lg:w-full max-lg:mt-4">
              <Card
                variant="outlined"
                sx={{
                  borderRadius: "16px",
                  borderColor: "primary.100",
                  boxShadow: "0 20px 60px rgba(37,99,235,0.18)",
                  backdropFilter: "blur(12px)",
                  background: "rgba(255,255,255,0.97)",
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Typography level="title-sm" sx={{ mb: 1.5, color: "primary.700", fontWeight: 700 }}>
                    🍽️ Make a Donation
                  </Typography>
                  <Donatecard />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ════════════════════════════
            STATS SECTION
        ════════════════════════════ */}
        <section className="pt-24 pb-10 max-lg:pt-14">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
            <Chip
              variant="soft"
              color="primary"
              size="sm"
              sx={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", px: 1.5 }}
            >
              Live Impact
            </Chip>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1">
            <StatCard
              number="129"
              period="Today"
              title="Daily Distribution"
              description="Meals served to families today"
              icon={<TrendingUpIcon />}
              delay="0s"
            />
            <StatCard
              number="467"
              period="This Month"
              title="Monthly Reach"
              description="Families supported this month"
              icon={<GroupsIcon />}
              delay="0.1s"
            />
            <StatCard
              number="12k+"
              period="All Time"
              title="Total Impact"
              description="Lives touched since we started"
              icon={<FavoriteIcon />}
              delay="0.2s"
            />
          </div>
        </section>

        {/* ════════════════════════════
            MARQUEE
        ════════════════════════════ */}
        <div className="-mx-10 mt-6 border-t border-blue-100 bg-white max-md:-mx-6">
          <Marqueeanimation />
        </div>

      </main>

      {/* Keyframe styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=Sora:wght@300;400;500;600;700&display=swap');

        .font-serif { font-family: 'Playfair Display', Georgia, serif; }
        .font-sans  { font-family: 'Sora', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes growX {
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}