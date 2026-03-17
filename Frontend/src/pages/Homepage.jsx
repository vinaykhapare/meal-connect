import { motion } from 'framer-motion';
import Home from "../components/header/Home"
import BenefitsSection from '../components/benefits/BenefitsSection'
import PartnersSection from '../components/partners/PartnersSection'
import VerifyNGOSection from '../components/ngo/VerifyNGOSection'
import { pageAnimation, staggerContainer } from '../animations'
import { Button } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Homepage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <motion.div
      variants={pageAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Home />
      <motion.div variants={staggerContainer}>
        <BenefitsSection />
        <VerifyNGOSection />
        <PartnersSection />

        {isAuthenticated && user?.role === 'ngo' && (
          <Button 
            onClick={() => navigate('/ngo/dashboard')}
            variant="solid"
            color="primary"
          >
            Go to NGO Dashboard
          </Button>
        )}

      </motion.div>
    </motion.div>
  )
}

export default Homepage;