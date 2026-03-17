import React from 'react';
import { Box, Typography } from '@mui/joy';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import PublicIcon from '@mui/icons-material/Public';

const benefits = [
  {
    title: "Reduce Food Waste",
    tag: "Food Waste",
    stat: "1.3B",
    statLabel: "tonnes wasted yearly",
    icon: <RestaurantIcon sx={{ fontSize: 18, fill: '#3B6D11' }} />,
    description:
      "Help tackle one of humanity's most solvable crises. Excess food from your kitchen or business can feed real people instead of filling landfills.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=75&auto=format&fit=crop",
  },
  {
    title: "Feed the Hungry",
    tag: "Community",
    stat: "3×",
    statLabel: "meals per donation avg.",
    icon: <VolunteerActivismIcon sx={{ fontSize: 18, fill: '#3B6D11' }} />,
    description:
      "One donation, multiplied. Your contribution directly reaches individuals and families experiencing food insecurity in your own community.",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=75&auto=format&fit=crop",
  },
  {
    title: "Environmental Impact",
    tag: "Environment",
    stat: "8%",
    statLabel: "of global emissions from food waste",
    icon: <PublicIcon sx={{ fontSize: 18, fill: '#3B6D11' }} />,
    description:
      "Food rotting in landfills emits methane — a greenhouse gas far more potent than CO₂. Donating food is one of the highest-impact climate actions you can take.",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=75&auto=format&fit=crop",
  },
];

const styles = {
  root: {
    fontFamily: "'DM Sans', sans-serif",
    padding: "3rem 1.5rem 4rem",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#f8f9fa",
  },
  decorCircle: {
    position: "absolute",
    top: -60,
    right: -80,
    width: 340,
    height: 340,
    borderRadius: "50%",
    background: "#e8f0e0",
    opacity: 0.5,
    pointerEvents: "none",
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#3B6D11",
    margin: "0 0 0.75rem",
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(2rem, 5vw, 3.2rem)",
    fontWeight: 700,
    color: "#1a1a1a",
    lineHeight: 1.12,
    margin: "0 0 1rem",
    maxWidth: 520,
  },
  titleAccent: {
    fontStyle: "italic",
    color: "#3B6D11",
  },
  sectionSub: {
    fontSize: 15,
    fontWeight: 300,
    color: "#666",
    maxWidth: 480,
    lineHeight: 1.7,
    margin: "0 0 3rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "1.25rem",
  },
  card: {
    background: "#fff",
    border: "0.5px solid #e0e0e0",
    borderRadius: 16,
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.25s ease, border-color 0.25s ease",
  },
  imgWrap: {
    height: 200,
    overflow: "hidden",
    position: "relative",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.45s ease",
  },
  imgOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 55%)",
  },
  tag: {
    position: "absolute",
    bottom: 12,
    left: 14,
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#fff",
    background: "rgba(59,109,17,0.85)",
    padding: "4px 10px",
    borderRadius: 20,
  },
  cardBody: {
    padding: "1.25rem 1.25rem 1.5rem",
  },
  iconRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: "0.75rem",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "#EAF3DE",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stat: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.6rem",
    fontWeight: 700,
    color: "#3B6D11",
    lineHeight: 1,
  },
  statLabel: {
    fontSize: 11,
    color: "#888",
    fontWeight: 400,
  },
  cardTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.15rem",
    fontWeight: 700,
    color: "#1a1a1a",
    margin: "0 0 0.5rem",
    lineHeight: 1.25,
  },
  cardDesc: {
    fontSize: 13.5,
    fontWeight: 300,
    color: "#555",
    lineHeight: 1.65,
    margin: 0,
  },
  ctaRow: {
    marginTop: "2.5rem",
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
  },
  ctaPrimary: {
    background: "#3B6D11",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "0.7rem 1.5rem",
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
  },
  ctaSecondary: {
    background: "none",
    color: "#555",
    border: "0.5px solid #ccc",
    borderRadius: 8,
    padding: "0.7rem 1.5rem",
    fontSize: 14,
    fontWeight: 400,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
  },
};

function BenefitCard({ benefit }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      style={{
        ...styles.card,
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        borderColor: hovered ? "#bbb" : "#e0e0e0",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.imgWrap}>
        <img
          src={benefit.image}
          alt={benefit.title}
          style={{
            ...styles.img,
            transform: hovered ? "scale(1.05)" : "scale(1)",
          }}
        />
        <div style={styles.imgOverlay} />
        <span style={styles.tag}>{benefit.tag}</span>
      </div>

      <div style={styles.cardBody}>
        <div style={styles.iconRow}>
          <div style={styles.iconBox}>{benefit.icon}</div>
          <div>
            <div style={styles.stat}>{benefit.stat}</div>
            <div style={styles.statLabel}>{benefit.statLabel}</div>
          </div>
        </div>
        <h3 style={styles.cardTitle}>{benefit.title}</h3>
        <p style={styles.cardDesc}>{benefit.description}</p>
      </div>
    </div>
  );
}

function BenefitsSection() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />
      <div style={styles.root}>
        <div style={styles.decorCircle} />

        <p style={styles.eyebrow}>Why it matters</p>
        <h2 style={styles.sectionTitle}>
          Every meal saved<br />
          is a <span style={styles.titleAccent}>world changed</span>
        </h2>
        <p style={styles.sectionSub}>
          Your food donations create ripples of positive impact — for people,
          for communities, and for the planet we share.
        </p>

        <div style={styles.grid}>
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} benefit={benefit} />
          ))}
        </div>

        {/* <div style={styles.ctaRow}>
          <button style={styles.ctaPrimary}>Donate food near me →</button>
          <button style={styles.ctaSecondary}>Learn more</button>
        </div> */}
      </div>
    </>
  );
}

export default BenefitsSection;