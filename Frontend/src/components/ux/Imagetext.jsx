// import React from 'react';
import { motion } from 'framer-motion';
import Chip from '@mui/joy/Chip';
import Agreementmodal from '../modals/Agreementmodal';
import video from "../../assets/video/WhatsApp Video 2025-02-22 at 20.03.34_afb9e94a.mp4";

/* ── Small feature pill ── */
function FeaturePill({ emoji, label }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
      <span className="text-base">{emoji}</span>
      <span
        className="text-xs font-semibold text-blue-700"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── Floating stat badge ── */
function StatBadge({ value, label, position }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.7, duration: 0.4, type: "spring" }}
      className={`absolute z-10 flex items-center gap-3 bg-white/95 backdrop-blur-md
        rounded-2xl px-4 py-3 shadow-lg border border-white/60 ${position}`}
    >
      <p
        className="text-xl font-black text-transparent bg-clip-text leading-none"
        style={{
          fontFamily: "'Playfair Display', serif",
          backgroundImage: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        }}
      >
        {value}
      </p>
      <p
        className="text-xs text-slate-500 font-medium leading-tight max-w-[80px]"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        {label}
      </p>
    </motion.div>
  );
}

/* ════════════════════════════════
   MAIN COMPONENT
════════════════════════════════ */
function Imagetext() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Sora:wght@300;400;500;600&display=swap');
      `}</style>

      <section className="relative w-full min-h-screen bg-slate-50 flex flex-col lg:flex-row overflow-hidden">

        {/* ── Decorative blobs ── */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-100/50 blur-[110px]" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-blue-50/70 blur-[90px]" />
        </div>

        {/* ══════════════════════
            LEFT — Video panel
        ══════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 lg:w-[52%] flex items-center justify-center
            bg-gradient-to-br from-blue-600 to-blue-900
            p-8 md:p-12 min-h-[50vh] lg:min-h-screen"
        >
          {/* Dot-grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Video */}
          <div className="relative w-full max-w-lg">
            <div className="rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/10">
              <video
                src={video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover block"
                style={{ maxHeight: "70vh" }}
              />
              {/* Blue tint overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating stat badges */}
            <StatBadge
              value="10K+"
              label="People fed so far"
              position="-top-4 -right-4 md:-right-8"
            />
            <StatBadge
              value="150+"
              label="NGO partners active"
              position="-bottom-4 -left-4 md:-left-8"
            />
          </div>
        </motion.div>

        {/* ══════════════════════
            RIGHT — Text panel
        ══════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex-1 flex flex-col justify-center
            px-8 md:px-14 py-14 lg:py-0"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45 }}
          >
            <Chip
              variant="soft"
              color="primary"
              size="sm"
              sx={{
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                px: 2,
                mb: 3,
              }}
            >
              Food Donation Platform
            </Chip>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.5 }}
            className="text-4xl md:text-5xl font-black leading-tight text-slate-800 mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Welcome to{" "}
            <span
              className="italic text-transparent bg-clip-text block"
              style={{ backgroundImage: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
            >
              MealConnect
            </span>
          </motion.h2>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.46, duration: 0.5 }}
            className="text-slate-500 text-base leading-relaxed max-w-md mb-8"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            We are dedicated to reducing food waste and helping those in need.
            Our platform bridges the gap between surplus food and hungry families —
            one meal at a time. Join us in our mission to make a real difference.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.54, duration: 0.5 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            <FeaturePill emoji="🍱" label="Zero Food Waste" />
            <FeaturePill emoji="🤝" label="NGO Network" />
            <FeaturePill emoji="📍" label="50+ Cities" />
            <FeaturePill emoji="✅" label="Safe & Verified" />
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.5, origin: "left" }}
            className="w-16 h-1 rounded-full mb-8 origin-left"
            style={{ background: "linear-gradient(90deg, #3b82f6, #1d4ed8)" }}
          />

          {/* CTA — Agreementmodal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.66, duration: 0.45 }}
          >
            <Agreementmodal />
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.78, duration: 0.5 }}
            className="mt-8 flex items-center gap-3"
          >
            {/* Avatar stack */}
            <div className="flex -space-x-2">
              {["🧑", "👩", "👨", "🧕"].map((emoji, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-sm"
                >
                  {emoji}
                </div>
              ))}
            </div>
            <p
              className="text-xs text-slate-400 leading-snug"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              <span className="text-slate-600 font-semibold">200+ donors</span>{" "}
              already making a difference
            </p>
          </motion.div>
        </motion.div>

      </section>
    </>
  );
}

export default Imagetext;