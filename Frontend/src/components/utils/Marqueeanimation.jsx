import { useRef } from 'react';
import { motion } from 'framer-motion';

/* ── Dot separator between phrases ── */
const Dot = () => (
  <span className="inline-flex items-center mx-6 text-blue-300 text-2xl select-none">
    ✦
  </span>
);

/* ── Single marquee track ── */
const MarqueeTrack = ({ items, duration, reverse = false }) => {
  // Duplicate items so the loop is seamless
  const doubled = [...items, ...items];

  return (
    <div className="flex overflow-hidden w-full">
      <motion.div
        className="flex items-center flex-shrink-0 whitespace-nowrap"
        animate={{ x: reverse ? ["0%", "50%"] : ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          duration,
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span
              className="text-2xl md:text-3xl font-black tracking-tight select-none"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {item}
            </span>
            <Dot />
          </span>
        ))}
      </motion.div>
    </div>
  );
};

/* ════════════════════════════════
   MAIN COMPONENT
════════════════════════════════ */
const Marqueeanimation = () => {
  const row1 = [
    "Building bridges, sharing hope",
    "One meal at a time",
    "Nourishing communities",
    "Together we thrive",
  ];

  const row2 = [
    "Donate food, change lives",
    "No one sleeps hungry",
    "Join the movement",
    "Compassion in action",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
      `}</style>

      <div className="relative w-full bg-white border-t border-b border-blue-100 overflow-hidden py-5 flex flex-col gap-4">

        {/* Soft left/right fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-white to-transparent" />

        {/* Row 1 — left to right, blue text */}
        <div className="flex items-center">
          <div
            className="flex-shrink-0 px-4 py-1 mr-4 rounded-full text-[10px] font-bold uppercase tracking-widest z-20"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              color: "white",
              letterSpacing: "0.15em",
            }}
          >
            Our Mission
          </div>
          <div className="flex-1 overflow-hidden">
            <MarqueeTrack
              items={row1}
              duration={30}
            />
          </div>
        </div>

        {/* Thin divider */}
        <div className="mx-6 h-px bg-gradient-to-r from-transparent via-blue-100 to-transparent" />

        {/* Row 2 — right to left, slate text */}
        <div className="flex items-center">
          <div
            className="flex-shrink-0 px-4 py-1 mr-4 rounded-full text-[10px] font-bold uppercase tracking-widest z-20 border border-blue-200"
            style={{
              color: "#2563eb",
              background: "#eff6ff",
              letterSpacing: "0.15em",
            }}
          >
            Our Values
          </div>
          <div className="flex-1 overflow-hidden">
            <MarqueeTrack
              items={row2}
              duration={24}
              reverse
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Marqueeanimation;