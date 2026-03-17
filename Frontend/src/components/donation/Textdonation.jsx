// import React from 'react'
import { useEffect, useRef } from "react";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";
import Button from "@mui/joy/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";

import img1  from "../../assets/decoration/FoodDonation.jpg";
import img2  from "../../assets/decoration/HAI_20191125_WFP-Alexis_Masciarelli_0975.jpg";
import img3  from "../../assets/decoration/Hungry.jpg";
import img4  from "../../assets/decoration/joinus.jpg";
import img5  from "../../assets/decoration/kenya-photo-5.jpg";
import img6  from "../../assets/decoration/Kids.jpg";
import img7  from "../../assets/decoration/ourmission.jpg";
import img8  from "../../assets/About/help.jpg";
import img9  from "../../assets/decoration/pexels-thom-gonzalez-3126166-6836476.jpg";
import img10 from "../../assets/decoration/hunger_1665841206251_1665841211558_1665841211558.avif";
import img11 from "../../assets/decoration/WF1692199_IMG_1756-1024x683.jpg";
import img12 from "../../assets/decoration/th (4).jpeg";

/* ── Reusable image tile ── */
function ImgTile({ src, alt = "", className = "", tint = false, tall = false }) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl group
        ${tall ? "row-span-2" : ""}
        ${className}
      `}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      {/* Blue brand tint on hover */}
      <div
        className={`
          absolute inset-0 transition-opacity duration-500
          ${tint
            ? "bg-gradient-to-t from-blue-900/50 via-blue-700/10 to-transparent opacity-60"
            : "bg-gradient-to-t from-blue-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100"
          }
        `}
      />
    </div>
  );
}

/* ── Big mission word ── */
function MissionWord({ word, accent = false, delay = "0s" }) {
  return (
    <div
      className="flex items-center justify-center rounded-2xl select-none"
      style={{ animationDelay: delay }}
    >
      <span
        className={`
          font-black leading-none tracking-tighter text-center
          ${accent
            ? "text-transparent bg-clip-text"
            : "text-slate-800"
          }
        `}
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(3rem, 6vw, 6rem)",
          ...(accent
            ? { backgroundImage: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" }
            : {}),
        }}
      >
        {word}
      </span>
    </div>
  );
}

/* ════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════ */
function Textdonation() {
  /* IntersectionObserver for scroll-reveal */
  const sectionRef = useRef(null);

  useEffect(() => {
    const tiles = sectionRef.current?.querySelectorAll(".reveal-tile");
    if (!tiles) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("tile-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    tiles.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* ── Font injection ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Sora:wght@400;600&display=swap');

        .reveal-tile {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .tile-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-tile:nth-child(1) { transition-delay: 0.00s; }
        .reveal-tile:nth-child(2) { transition-delay: 0.08s; }
        .reveal-tile:nth-child(3) { transition-delay: 0.16s; }
        .reveal-tile:nth-child(4) { transition-delay: 0.24s; }
        .reveal-tile:nth-child(5) { transition-delay: 0.08s; }
        .reveal-tile:nth-child(6) { transition-delay: 0.16s; }
        .reveal-tile:nth-child(7) { transition-delay: 0.24s; }
        .reveal-tile:nth-child(8) { transition-delay: 0.32s; }
      `}</style>

      <section
        ref={sectionRef}
        className="relative w-full bg-slate-50 py-20 px-6 md:px-14 overflow-hidden"
      >
        {/* ── Decorative background blobs ── */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-100/60 blur-[100px]" />
          <div className="absolute bottom-10 left-0 w-80 h-80 rounded-full bg-blue-50/80 blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-[1240px] mx-auto flex flex-col gap-16">

          {/* ── Section label ── */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
            <Chip
              variant="soft"
              color="primary"
              size="sm"
              sx={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", px: 2 }}
            >
              Who We Are
            </Chip>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
          </div>

          {/* ════════════════════════
              ROW 1 — "Our"
          ════════════════════════ */}
          <div className="grid grid-cols-4 grid-rows-1 gap-4 h-52 md:h-64">

            <div className="reveal-tile col-span-1 h-full">
              <ImgTile src={img1} alt="Food donation" className="h-full" tint />
            </div>

            {/* Word: OUR */}
            <div className="reveal-tile col-span-1 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-100 h-full">
              <MissionWord word="Our" />
            </div>

            <div className="reveal-tile col-span-1 h-full">
              <ImgTile src={img2} alt="WFP field work" className="h-full" />
            </div>

            <div className="reveal-tile col-span-1 h-full">
              <ImgTile src={img3} alt="Hungry child" className="h-full" tint />
            </div>
          </div>

          {/* ════════════════════════
              ROW 2 — "Mission:"
          ════════════════════════ */}
          <div className="grid grid-cols-4 gap-4 h-52 md:h-64">

            <div className="reveal-tile col-span-1 h-full">
              <ImgTile src={img4} alt="Join us" className="h-full" />
            </div>

            <div className="reveal-tile col-span-1 h-full">
              <ImgTile src={img5} alt="Kenya field" className="h-full" tint />
            </div>

            {/* Word: MISSION — spans 2 cols for visual weight */}
            <div className="reveal-tile col-span-2 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg h-full relative overflow-hidden">
              {/* subtle grid pattern */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <span
                className="relative z-10 font-black text-white leading-none tracking-tighter text-center"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(3rem, 5.5vw, 5.5rem)",
                }}
              >
                Mission:
              </span>
            </div>
          </div>

          {/* ════════════════════════
              ROW 3 — "Nourish"
          ════════════════════════ */}
          <div className="grid grid-cols-4 gap-4 h-52 md:h-64">

            {/* Word: NOURISH — spans 2 cols */}
            <div className="reveal-tile col-span-2 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl shadow-sm border border-slate-100 h-full px-6">
              <span
                className="font-black leading-none tracking-tighter text-center text-transparent bg-clip-text"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(3rem, 5.5vw, 5.5rem)",
                  backgroundImage: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                }}
              >
                Nourish
              </span>
              <p
                className="text-slate-400 text-sm text-center leading-relaxed max-w-[220px]"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Connecting surplus food to families who need it most.
              </p>
            </div>

            <div className="reveal-tile col-span-1 h-full">
              <ImgTile src={img6} alt="Kids eating" className="h-full" tint />
            </div>

            <div className="reveal-tile col-span-1 h-full">
              <ImgTile src={img7} alt="Our mission" className="h-full" />
            </div>
          </div>

          {/* ════════════════════════
              ROW 4 — "lives."
          ════════════════════════ */}
          <div className="grid grid-cols-4 gap-4 h-52 md:h-64">

            <div className="reveal-tile col-span-1 h-full">
              <ImgTile src={img8} alt="Helping hand" className="h-full" />
            </div>

            <div className="reveal-tile col-span-1 h-full">
              <ImgTile src={img9} alt="Community meal" className="h-full" tint />
            </div>

            <div className="reveal-tile col-span-1 h-full">
              <ImgTile src={img10} alt="Hunger" className="h-full" />
            </div>

            {/* Word: LIVES. — accent gradient */}
            <div className="reveal-tile col-span-1 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-100 h-full">
              <MissionWord word="lives." accent />
            </div>
          </div>

          {/* ════════════════════════
              BOTTOM — extra images + CTA
          ════════════════════════ */}
          <div className="grid grid-cols-3 gap-4 h-48">

            <div className="reveal-tile col-span-1 h-full">
              <ImgTile src={img11} alt="Field work" className="h-full" tint />
            </div>

            {/* CTA card */}
            <div className="reveal-tile col-span-1 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg h-full px-6 text-center relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <p className="relative z-10 text-white font-semibold text-base leading-snug"
                style={{ fontFamily: "'Sora', sans-serif" }}>
                Ready to make a difference?
              </p>
              <Button
                component={Link}
                to="/donate"
                size="sm"
                variant="solid"
                endDecorator={<ArrowForwardIcon fontSize="small" />}
                sx={{
                  position: "relative",
                  zIndex: 10,
                  borderRadius: "100px",
                  background: "white",
                  color: "#1d4ed8",
                  fontWeight: 700,
                  px: 2.5,
                  "&:hover": {
                    background: "#eff6ff",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.20)",
                  },
                  transition: "all 0.2s",
                }}
              >
                Donate Food
              </Button>
            </div>

            <div className="reveal-tile col-span-1 h-full">
              <ImgTile src={img12} alt="Community" className="h-full" />
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

export default Textdonation;