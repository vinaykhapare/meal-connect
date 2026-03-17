import React, { useState } from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import { useNavigate } from 'react-router-dom';

const BLUE = '#1565C0';
const BLUE_LIGHT = '#E3F2FD';
const BLUE_MID = '#1976D2';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Donate', path: '/donate' },
  { label: 'Contact', path: '/contact' },
];

const socialLinks = [
  {
    label: 'Instagram',
    url: 'https://instagram.com/mealconnect',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.2" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    url: 'https://linkedin.com/company/mealconnect',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    url: 'https://twitter.com/mealconnect',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

const footerLinks = {
  Platform: [
    { label: 'Donate Food' },
    { label: 'NGO Partners' },
    { label: 'Verify NGO' },
    { label: 'Dashboard' },
  ],
  Company: [
    { label: 'About Us' },
    { label: 'How It Works' },
    { label: 'Contact' },
    { label: 'Blog' },
  ],
  Legal: [
    { label: 'Privacy Policy' },
    { label: 'Terms of Service' },
    { label: 'Cookie Policy' },
  ],
};

function SocialButton({ social }) {
  const [hovered, setHovered] = useState(false);

  return (
    <IconButton
      component="a"
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        width: 38,
        height: 38,
        borderRadius: '10px',
        border: '0.5px solid',
        borderColor: hovered ? BLUE_MID : 'rgba(255,255,255,0.15)',
        backgroundColor: hovered ? BLUE_LIGHT : 'transparent',
        color: hovered ? BLUE : 'rgba(255,255,255,0.6)',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        '&:hover': { backgroundColor: hovered ? BLUE_LIGHT : 'transparent' },
      }}
    >
      {social.icon}
    </IconButton>
  );
}

function Footer() {
  const navigate = useNavigate();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#0D2137',
        color: '#fff',
        pt: 6,
        pb: 3,
        px: { xs: 2, md: 6 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blobs */}
      <Box sx={{
        position: 'absolute', top: -80, left: -80,
        width: 260, height: 260, borderRadius: '50%',
        background: BLUE, opacity: 0.12, pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', bottom: -40, right: -40,
        width: 180, height: 180, borderRadius: '50%',
        background: BLUE_MID, opacity: 0.08, pointerEvents: 'none',
      }} />

      <Box sx={{ maxWidth: 1100, mx: 'auto', position: 'relative', zIndex: 1 }}>

        {/* Top grid */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1.8fr 1fr 1fr 1fr' },
          gap: { xs: 4, md: 6 },
          mb: 6,
        }}>

          {/* Brand column */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
              <Box sx={{
                width: 36, height: 36, borderRadius: '10px',
                background: BLUE_MID,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                  <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-4.5-6.72-5-8.03-5-1.31 0-8.03.5-8.03 5v4h16.06v-4z" />
                </svg>
              </Box>
              <Box>
                <Typography sx={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#fff',
                  lineHeight: 1,
                  letterSpacing: '-0.01em',
                }}>
                  MealConnect
                </Typography>
                <Typography sx={{
                  fontSize: '0.6rem',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}>
                  Nourishing Communities
                </Typography>
              </Box>
            </Box>

            <Typography sx={{
              fontSize: '0.875rem',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.7,
              maxWidth: 280,
              mb: 3,
            }}>
              Connecting surplus food with people who need it most — reducing waste,
              fighting hunger, one meal at a time.
            </Typography>

            {/* Stats strip */}
            <Box sx={{
              display: 'flex',
              gap: 3,
              mb: 3,
              pb: 3,
              borderBottom: '0.5px solid rgba(255,255,255,0.1)',
            }}>
              {[
                { val: '200+', label: 'Donations' },
                { val: '50+', label: 'NGOs' },
                { val: '5K+', label: 'Meals' },
              ].map((s) => (
                <Box key={s.label}>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                    {s.val}
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}>
                    {s.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Social icons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social) => (
                <SocialButton key={social.label} social={social} />
              ))}
            </Box>
          </Box>

          {/* Link columns — static text only */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <Box key={category}>
              <Typography sx={{
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: BLUE_LIGHT,
                mb: 2,
              }}>
                {category}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {links.map((link) => (
                  <Typography
                    key={link.label}
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 300,
                      color: 'rgba(255,255,255,0.55)',
                      display: 'block',
                    }}
                  >
                    {link.label}
                  </Typography>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Bottom bar */}
        <Box sx={{
          borderTop: '0.5px solid rgba(255,255,255,0.1)',
          pt: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}>
          <Typography sx={{
            fontSize: '0.8rem',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.3)',
          }}>
            © {new Date().getFullYear()} MealConnect. All rights reserved.
          </Typography>

          {/* ✅ Only these 4 items navigate */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {navItems.map((item) => (
              <Typography
                key={item.label}
                onClick={() => navigate(item.path)}
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.55)',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                  '&:hover': { color: '#fff' },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Box>
        </Box>

      </Box>
    </Box>
  );
}

export default Footer;