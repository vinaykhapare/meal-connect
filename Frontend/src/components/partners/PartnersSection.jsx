import React, { useState } from 'react';

import img1 from "../../assets/ngos/1200x630wa.png";
import img2 from "../../assets/ngos/AkshayaPatra Logo_800X800 px.jpg";
import img3 from "../../assets/ngos/SDLogo1024_New.png";
import img4 from "../../assets/ngos/unnamed.jpg";
import img5 from "../../assets/ngos/th (5).jpeg";

const partners = [
  { name: "Raisin Foundation", logo: img1, link: "#" },
  { name: "Aflere NGO", logo: img2, link: "#" },
  { name: "CREO Foundation", logo: img3, link: "#" },
  { name: "iCare Foundation", logo: img4, link: "#" },
  { name: "Lycetts Trust", logo: img5, link: "#" },
];

const GREEN = '#3B6D11';
const GREEN_LIGHT = '#EAF3DE';

const styles = {
  root: {
    fontFamily: "'DM Sans', sans-serif",
    backgroundColor: '#fff',
    padding: '5rem 1.5rem 6rem',
    position: 'relative',
    overflow: 'hidden',
    textAlign: 'center',
  },
  decorLeft: {
    position: 'absolute',
    top: '50%',
    left: -80,
    transform: 'translateY(-50%)',
    width: 220,
    height: 220,
    borderRadius: '50%',
    background: GREEN_LIGHT,
    opacity: 0.5,
    pointerEvents: 'none',
  },
  decorRight: {
    position: 'absolute',
    top: '30%',
    right: -60,
    width: 160,
    height: 160,
    borderRadius: '50%',
    background: GREEN_LIGHT,
    opacity: 0.4,
    pointerEvents: 'none',
  },
  inner: {
    maxWidth: 1100,
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },
  eyebrow: {
    display: 'inline-block',
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: GREEN,
    background: GREEN_LIGHT,
    padding: '5px 14px',
    borderRadius: 20,
    marginBottom: '1rem',
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
    fontWeight: 700,
    color: '#1a1a1a',
    lineHeight: 1.15,
    margin: '0 0 1rem',
  },
  titleAccent: {
    fontStyle: 'italic',
    color: GREEN,
  },
  sectionSub: {
    fontSize: 15,
    fontWeight: 300,
    color: '#666',
    maxWidth: 480,
    lineHeight: 1.7,
    margin: '0 auto 3.5rem',
  },
  divider: {
    width: 48,
    height: 3,
    background: GREEN,
    borderRadius: 4,
    margin: '1.25rem auto 1.5rem',
    border: 'none',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '1.25rem',
    marginBottom: '3.5rem',
  },
  logoCard: {
    background: '#fff',
    border: '0.5px solid #e4e4e4',
    borderRadius: 16,
    padding: '1.5rem 2rem',
    width: 160,
    height: 110,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    cursor: 'pointer',
    transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
    textDecoration: 'none',
  },
  logoImg: {
    maxWidth: '100%',
    maxHeight: 52,
    objectFit: 'contain',
    transition: 'filter 0.3s ease',
  },
  logoName: {
    fontSize: 11,
    fontWeight: 500,
    color: '#999',
    letterSpacing: '0.04em',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    transition: 'color 0.25s ease',
  },
  trustRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    fontWeight: 400,
    color: '#777',
  },
  trustDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: GREEN,
    flexShrink: 0,
  },
};

function PartnerCard({ partner }) {
  const [hovered, setHovered] = useState(false);

  const GREEN = "#3b6d11";

  return (
    <a
      href={partner.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        ...styles.logoCard,
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        borderColor: hovered ? "#bdd49a" : "#e4e4e4",
        boxShadow: hovered ? "0 8px 24px rgba(59,109,17,0.1)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Visit ${partner.name}`}
    >
      <img
        src={partner.logo}
        alt={partner.name}
        style={{
          ...styles.logoImg,
          filter: hovered
            ? "grayscale(0%) opacity(1)"
            : "grayscale(100%) opacity(0.55)",
        }}
      />

      <p
        style={{
          ...styles.logoName,
          color: hovered ? GREEN : "#999",
        }}
      >
        {partner.name}
      </p>
    </a>
  );
}

function PartnersSection() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />
      <section style={styles.root} aria-labelledby="partners-title">
        <div style={styles.decorLeft} aria-hidden="true" />
        <div style={styles.decorRight} aria-hidden="true" />

        <div style={styles.inner}>
          <span style={styles.eyebrow}>Trusted collaborators</span>
          <h2 id="partners-title" style={styles.sectionTitle}>
            Our NGO <span style={styles.titleAccent}>Partners</span>
          </h2>
          <hr style={styles.divider} />
          <p style={styles.sectionSub}>
            We collaborate with verified, trusted NGOs to ensure every donation
            reaches the people who need it most.
          </p>

          <div style={styles.grid}>
            {partners.map((partner, index) => (
              <PartnerCard key={index} partner={partner} />
            ))}
          </div>

          <div style={styles.trustRow} role="list" aria-label="Trust indicators">
            {['Verified partners only', 'Real-time coordination', 'Transparent reporting'].map((label) => (
              <div key={label} style={styles.trustItem} role="listitem">
                <div style={styles.trustDot} aria-hidden="true" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default PartnersSection;