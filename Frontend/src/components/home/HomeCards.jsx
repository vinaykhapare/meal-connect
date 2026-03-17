import { Card, CardContent, Typography, Button, Box } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

function HomeCards() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Today's Distribution",
      description: "Check out today's food distribution statistics. See how many meals we've distributed and the impact we're making.",
      icon: <RestaurantIcon sx={{ fontSize: 40, color: '#2196f3' }} />,
      buttonText: "See Details",
      onClick: () => navigate('/about'),
      stats: "129 packets distributed"
    },
    {
      title: "Monthly Overview",
      description: "View our monthly food distribution data. Track our progress in fighting hunger and reducing food waste.",
      icon: <VolunteerActivismIcon sx={{ fontSize: 40, color: '#2196f3' }} />,
      buttonText: "See Details",
      onClick: () => navigate('/about'),
      stats: "467 packets distributed"
    }
  ];

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 4, 
      justifyContent: 'center',
      flexWrap: 'wrap',
      p: 2 
    }}>
      {cards.map((card, index) => (
        <Card
          key={index}
          variant="outlined"
          sx={{
            maxWidth: 320,
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 'md',
            },
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {card.icon}
              <Typography level="h4" sx={{ ml: 2 }}>
                {card.title}
              </Typography>
            </Box>
            <Typography level="body-md" sx={{ mb: 2 }}>
              {card.description}
            </Typography>
            <Typography level="body-sm" color="primary" sx={{ mb: 2 }}>
              {card.stats}
            </Typography>
            <Button
              variant="solid"
              color="primary"
              onClick={card.onClick}
              fullWidth
            >
              {card.buttonText}
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default HomeCards; 