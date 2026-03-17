import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/joy';
import HomeIcon from '@mui/icons-material/Home';

const NotFound = () => {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const childVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const numberVariants = {
    initial: { scale: 0 },
    animate: { 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem'
      }}
    >
      <motion.div
        variants={numberVariants}
        style={{
          fontSize: '8rem',
          fontWeight: 'bold',
          color: '#2196f3',
          marginBottom: '1rem'
        }}
      >
        404
      </motion.div>

      <motion.div variants={childVariants}>
        <Typography level="h2" sx={{ mb: 2 }}>
          Oops! Page Not Found
        </Typography>
      </motion.div>

      <motion.div variants={childVariants}>
        <Typography 
          level="body-lg"
          sx={{ 
            mb: 4,
            maxWidth: '600px',
            color: 'text.secondary'
          }}
        >
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </Typography>
      </motion.div>

      <motion.div 
        variants={childVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => navigate('/')}
          startDecorator={<HomeIcon />}
          size="lg"
          variant="solid"
          color="primary"
          sx={{ 
            borderRadius: '50px',
            px: 4
          }}
        >
          Back to Home
        </Button>
      </motion.div>

      <Box
        component={motion.div}
        variants={childVariants}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '400px',
          height: '4px',
          background: '#e0e0e0',
          borderRadius: '2px',
          mt: 8
        }}
      >
        <Box
          component={motion.div}
          animate={{
            x: ['0%', '100%', '0%'],
            transition: {
              repeat: Infinity,
              duration: 2,
              ease: 'easeInOut'
            }
          }}
          sx={{
            position: 'absolute',
            width: '20%',
            height: '100%',
            background: 'primary.main',
            borderRadius: '2px'
          }}
        />
      </Box>
    </motion.div>
  );
};

export default NotFound; 