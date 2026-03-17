import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GREEN = '#3B6D11';
const GREEN_LIGHT = '#EAF3DE';
const GREEN_MID = '#639922';

const benefits = [
  {
    icon: '⚡',
    label: 'Real-time donation notifications',
  },
  {
    icon: '🛡️',
    label: 'Verified NGO badge on your profile',
  },
  {
    icon: '📊',
    label: 'Analytics & impact dashboard',
  },
  {
    icon: '📦',
    label: 'Direct access to food donations',
  },
  {
    icon: '🎯',
    label: 'Priority support & onboarding',
  },
  {
    icon: '🤝',
    label: 'Network with other NGO partners',
  },
];

const steps = [
  { number: '01', title: 'Apply', desc: 'Submit your NGO registration details online.' },
  { number: '02', title: 'Verify', desc: 'Our team reviews and validates your documents.' },
  { number: '03', title: 'Connect', desc: 'Start receiving donations and making impact.' },
];

const styles = {
  root: {
    fontFamily: "'DM Sans', sans-serif",
    backgroundColor: '#f8f9fa',
    padding: '5rem 1.5rem 6rem',
    position: 'relative',
    overflow: 'hidden',
  },
  decorBlobTop: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 320,
    height: 320,
    borderRadius: '50%',
    background: GREEN_LIGHT,
    opacity: 0.6,
    pointerEvents: 'none',
  },
  decorBlobBottom: {
    position: 'absolute',
    bottom: -80,
    right: -60,
    width: 260,
    height: 260,
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
  headerWrap: {
    textAlign: 'center',
    marginBottom: '4rem',
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
    fontSize: 'clamp(2rem, 4vw, 3rem)',
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
    margin: '0 auto',
  },

  // Main grid
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },

  // CTA card
  ctaCard: {
    background: GREEN,
    borderRadius: 20,
    padding: '2.5rem 2rem',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: 340,
    position: 'relative',
    overflow: 'hidden',
  },
  ctaCardDecor: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    pointerEvents: 'none',
  },
  ctaCardDecor2: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
    pointerEvents: 'none',
  },
  verifiedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: '5px 12px',
    fontSize: 12,
    fontWeight: 500,
    color: '#fff',
    marginBottom: '1.25rem',
    width: 'fit-content',
  },
  ctaTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    fontWeight: 700,
    lineHeight: 1.2,
    margin: '0 0 0.75rem',
    color: '#fff',
  },
  ctaDesc: {
    fontSize: 14,
    fontWeight: 300,
    lineHeight: 1.65,
    color: 'rgba(255,255,255,0.8)',
    margin: '0 0 2rem',
  },
  ctaButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: '#fff',
    color: GREEN,
    border: 'none',
    borderRadius: 10,
    padding: '0.8rem 1.5rem',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    width: 'fit-content',
    textDecoration: 'none',
  },

  // Benefits card
  benefitsCard: {
    background: '#fff',
    border: '0.5px solid #e4e4e4',
    borderRadius: 20,
    padding: '2.5rem 2rem',
    minHeight: 340,
  },
  benefitsTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#1a1a1a',
    margin: '0 0 1.5rem',
  },
  benefitsList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 14,
    color: '#444',
    fontWeight: 300,
    lineHeight: 1.4,
  },
  benefitIcon: {
    fontSize: 16,
    flexShrink: 0,
    width: 28,
    height: 28,
    background: GREEN_LIGHT,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Steps
  stepsWrap: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  stepCard: {
    background: '#fff',
    border: '0.5px solid #e4e4e4',
    borderRadius: 16,
    padding: '1.5rem',
    transition: 'transform 0.25s ease, border-color 0.25s ease',
  },
  stepNumber: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2.5rem',
    fontWeight: 700,
    color: GREEN_LIGHT,
    lineHeight: 1,
    marginBottom: '0.5rem',
  },
  stepTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1rem',
    fontWeight: 700,
    color: '#1a1a1a',
    margin: '0 0 0.4rem',
  },
  stepDesc: {
    fontSize: 13,
    fontWeight: 300,
    color: '#777',
    lineHeight: 1.55,
    margin: 0,
  },
  stepsLabel: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#1a1a1a',
    margin: '0 0 1.25rem',
  },
};

function StepCard({ step }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        ...styles.stepCard,
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        borderColor: hovered ? '#bdd49a' : '#e4e4e4',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.stepNumber}>{step.number}</div>
      <h4 style={styles.stepTitle}>{step.title}</h4>
      <p style={styles.stepDesc}>{step.desc}</p>
    </div>
  );
}

function VerifyNGOSection() {
  const navigate = useNavigate();
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />
      <section style={styles.root} aria-labelledby="ngo-section-title">
        <div style={styles.decorBlobTop} aria-hidden="true" />
        <div style={styles.decorBlobBottom} aria-hidden="true" />

        <div style={styles.inner}>
          {/* Header */}
          <div style={styles.headerWrap}>
            <span style={styles.eyebrow}>For NGOs &amp; Partners</span>
            <h2 id="ngo-section-title" style={styles.sectionTitle}>
              Join our verified<br />
              <span style={styles.titleAccent}>partner network</span>
            </h2>
            <p style={styles.sectionSub}>
              Get certified as a trusted NGO partner and unlock direct access to food donations,
              real-time alerts, and a dashboard built for impact.
            </p>
          </div>

          {/* Main 2-col grid */}
          <div style={styles.mainGrid}>
            {/* CTA Card */}
            <div style={styles.ctaCard}>
              <div style={styles.ctaCardDecor} aria-hidden="true" />
              <div style={styles.ctaCardDecor2} aria-hidden="true" />

              <div>
                <div style={styles.verifiedBadge}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  NGO Verified Badge
                </div>
                <h3 style={styles.ctaTitle}>
                  Register your NGO.<br />Start receiving donations.
                </h3>
                <p style={styles.ctaDesc}>
                  Complete a simple one-time verification process and connect your organisation
                  to a steady stream of food donations from donors near you.
                </p>
              </div>

              <button
                style={{
                  ...styles.ctaButton,
                  transform: btnHovered ? 'translateY(-2px)' : 'translateY(0)',
                  boxShadow: btnHovered ? '0 6px 20px rgba(0,0,0,0.15)' : 'none',
                }}
                onMouseEnter={() => setBtnHovered(true)}
                onMouseLeave={() => setBtnHovered(false)}
                onClick={() => navigate('/ngo-registration')}
                aria-label="Get verified as an NGO partner"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill={GREEN} aria-hidden="true">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
                Get Verified →
              </button>
            </div>

            {/* Benefits card */}
            <div style={styles.benefitsCard}>
              <h3 style={styles.benefitsTitle}>What you unlock</h3>
              <ul style={styles.benefitsList} role="list">
                {benefits.map((b, i) => (
                  <li key={i} style={styles.benefitItem}>
                    <span style={styles.benefitIcon} aria-hidden="true">{b.icon}</span>
                    {b.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Steps */}
          <p style={styles.stepsLabel}>How it works</p>
          <div style={styles.stepsWrap}>
            {steps.map((step) => (
              <StepCard key={step.number} step={step} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default VerifyNGOSection;