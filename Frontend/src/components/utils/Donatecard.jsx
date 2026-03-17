import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardActions from '@mui/joy/CardActions';
import CircularProgress from '@mui/joy/CircularProgress';
import Typography from '@mui/joy/Typography';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { Link } from 'react-router-dom';

export default function Donatecard() {
  return (
    <Card variant="solid" color="primary" invertedColors className="shadow-xl">
      <CardContent orientation="horizontal">
        <CircularProgress size="lg" determinate value={20}>
          <RestaurantIcon />
        </CircularProgress>
        <CardContent>
          <Typography level="body-md">Total Donation</Typography>
          <Typography level="h2">200</Typography>
        </CardContent>
      </CardContent>
      <CardActions>
        <Button variant="soft" size="sm" disabled>
          Increase Donation
        </Button>
        <Button variant="solid" size="sm">
          <Link to="/donate">Donate</Link>
        </Button>
      </CardActions>
    </Card>
  );
}