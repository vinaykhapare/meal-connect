import { useEffect, useState, useRef } from 'react';
import CircularProgress from '@mui/joy/CircularProgress';
import Chip from '@mui/joy/Chip';
import axios from 'axios';
import { motion, useInView } from 'framer-motion';
import { images } from "../../assets/images";

/* ── Animated count-up number ── */
function CountUp({ target, suffix = "", duration = 1.8 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const isK = suffix.includes("K");
    const numeric = parseFloat(target.replace(/[^0-9.]/g, ""));
    const steps = 60;
    const increment = numeric / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= numeric) {
        setDisplay(numeric);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, (duration * 1000) / steps);
    return () => clearInterval(timer);
  }, [inView, target, duration, suffix]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/* ── Individual stat card ── */
function StatCard({ image, count, title, description, accent, index }) {
  const suffix = count.replace(/[0-9]/g, ""); // e.g. "K+" or "+"

  const cardVariants = {
    hidden:  { opacity: 0, y: 40, scale: 0.92 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { type: "spring", stiffness: 90, damping: 14, delay: index * 0.12 },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ y: -6, transition: { duration: 0.22 } }}
      className="group relative flex flex-col items-center bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-slate-100 transition-shadow duration-300"
    >
      {/* Top accent bar */}
      <div
        className="w-full h-1 transition-all duration-300 group-hover:h-1.5"
        style={{ background: "linear-gradient(90deg, #3b82f6, #1d4ed8)" }}
      />

      {/* Image */}
      <div className="relative w-full h-44 overflow-hidden">
        <motion.img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          initial={{ rotate: -2, scale: 1.04 }}
          whileInView={{ rotate: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        />
        {/* Blue tint overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="flex flex-col items-center gap-2 px-6 py-6 w-full">
        {/* Count */}
        <p
          className="text-5xl font-black leading-none text-transparent bg-clip-text"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            backgroundImage: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          }}
        >
          <CountUp target={count} suffix={suffix} />
        </p>

        {/* Title */}
        <p
          className="text-base font-semibold text-slate-700 text-center"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          {title}
        </p>

        {/* Description */}
        {description && (
          <p className="text-xs text-slate-400 text-center leading-relaxed"
            style={{ fontFamily: "'Sora', sans-serif" }}>
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════
   MAIN COMPONENT
════════════════════════════════ */
function AboutStats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalDistributed: 0, totalBeneficiaries: 0 });

  const statItems = [
    {
      image:       images.about1,
      count:       "10K+",
      title:       "People Fed",
      description: "Individuals nourished across our network",
    },
    {
      image:       images.about2,
      count:       "150+",
      title:       "NGO Partners",
      description: "Trusted organisations we collaborate with",
    },
    {
      image:       images.about3,
      count:       "50+",
      title:       "Cities Covered",
      description: "Growing our reach across India",
    },
    {
      image:       images.about4,
      count:       "200+",
      title:       "Regular Donors",
      description: "Generous hearts donating every month",
    },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/analytics/distribution');
        if (response.data.success) {
          const { distributionData } = response.data.data;
          const totalDistributed = distributionData.reduce((acc, curr) => acc + curr.distributed, 0);
          const totalBeneficiaries = Math.round(totalDistributed * 3);
          setStats({ totalDistributed, totalBeneficiaries });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-4 py-28 bg-slate-50">
        <CircularProgress color="primary" size="lg" />
        <p className="text-sm text-slate-400 tracking-wide animate-pulse"
          style={{ fontFamily: "'Sora', sans-serif" }}>
          Loading impact data…
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Font injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Sora:wght@300;400;500;600&display=swap');
      `}</style>

      <section className="relative w-full bg-slate-50 py-20 px-6 md:px-14 overflow-hidden">

        {/* ── Background blobs ── */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-100/50 blur-[100px]" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-blue-50/70 blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-[1240px] mx-auto flex flex-col gap-14">

          {/* ── Section header ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <Chip
              variant="soft"
              color="primary"
              size="sm"
              sx={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", px: 2 }}
            >
              Our Impact
            </Chip>

            <h2
              className="text-4xl md:text-5xl font-black leading-tight text-slate-800"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Numbers that{" "}
              <span
                className="italic text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
              >
                speak
              </span>
            </h2>

            <p
              className="text-slate-400 text-base max-w-md leading-relaxed"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Every number here represents a real life changed. Here's what we've accomplished together.
            </p>

            {/* Divider */}
            <div className="flex items-center gap-3 w-full max-w-xs mt-1">
              <div className="flex-1 h-px bg-blue-100" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <div className="flex-1 h-px bg-blue-100" />
            </div>
          </motion.div>

          {/* ── Stat cards grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statItems.map((stat, index) => (
              <StatCard key={index} {...stat} index={index} />
            ))}
          </div>

          {/* ── Live API stats banner ── */}
          {(stats.totalDistributed > 0 || stats.totalBeneficiaries > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {/* Distributed */}
              <div className="flex items-center gap-5 bg-white rounded-2xl border border-blue-100 shadow-sm px-8 py-6">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🍱</span>
                </div>
                <div>
                  <p
                    className="text-3xl font-black text-transparent bg-clip-text"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      backgroundImage: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                    }}
                  >
                    {stats.totalDistributed.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-500 font-medium mt-0.5"
                    style={{ fontFamily: "'Sora', sans-serif" }}>
                    Total Meals Distributed
                  </p>
                </div>
              </div>

              {/* Beneficiaries */}
              <div className="flex items-center gap-5 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-md px-8 py-6 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="relative z-10 w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">👨‍👩‍👧‍👦</span>
                </div>
                <div className="relative z-10">
                  <p
                    className="text-3xl font-black text-white"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {stats.totalBeneficiaries.toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-100 font-medium mt-0.5"
                    style={{ fontFamily: "'Sora', sans-serif" }}>
                    Estimated Beneficiaries
                  </p>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </section>
    </>
  );
}

export default AboutStats;