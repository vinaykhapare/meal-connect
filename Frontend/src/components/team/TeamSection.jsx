import { Box, Typography, Card, CardContent, Avatar } from '@mui/joy';
import Grid from '@mui/joy/Grid';

// Import team member images
import member1 from '../../assets/team/member1.jpg';
import member2 from '../../assets/team/member2.jpg';
import member3 from '../../assets/team/member3.jpg';

const teamMembers = [
  {
    name: "Rahul Sharma",
    role: "Founder & CEO",
    image: member1,
    description: "With over 10 years of experience in food waste management and social initiatives, Rahul leads our mission to connect surplus food with those in need."
  },
  {
    name: "Priya Patel",
    role: "Operations Director",
    image: member2,
    description: "Priya oversees our daily operations and partnerships with restaurants, ensuring smooth coordination between donors and recipients."
  },
  {
    name: "Amit Kumar",
    role: "Technology Head",
    image: member3,
    description: "Amit leads our technical initiatives, developing innovative solutions to streamline food donation and distribution processes."
  }
];

function TeamSection() {
  return (
    <Box
      sx={{
        py: 8,
        px: { xs: 2, md: 6 },
        backgroundColor: 'background.surface',
      }}
    >
      <Typography
        level="h1"
        sx={{
          mb: 2,
          textAlign: 'center',
          fontSize: { xs: '2rem', md: '3rem' },
          fontWeight: 'bold',
          color: 'primary.main'
        }}
      >
        Meet Our Team
      </Typography>
      
      <Typography
        level="body1"
        sx={{
          mb: 6,
          textAlign: 'center',
          maxWidth: '800px',
          mx: 'auto',
          color: 'text.secondary'
        }}
      >
        Our dedicated team works tirelessly to bridge the gap between food surplus and scarcity,
        making a positive impact in our community.
      </Typography>

      <Grid 
        container 
        spacing={4}
        sx={{
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'stretch',
        }}
      >
        {teamMembers.map((member, index) => (
          <Grid key={index} xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 'md',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  src={member.image}
                  alt={member.name}
                  sx={{
                    width: 200,
                    height: 200,
                    mx: 'auto',
                    mb: 2,
                    border: '4px solid',
                    borderColor: 'primary.500',
                  }}
                />
                <Typography
                  level="h4"
                  sx={{
                    mb: 1,
                    color: 'primary.main',
                  }}
                >
                  {member.name}
                </Typography>
                <Typography
                  level="title-lg"
                  sx={{
                    mb: 2,
                    color: 'text.secondary',
                  }}
                >
                  {member.role}
                </Typography>
                <Typography level="body1">
                  {member.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default TeamSection; 