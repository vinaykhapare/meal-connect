import AspectRatio from '@mui/joy/AspectRatio';
import Link from '@mui/joy/Link';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';
import PropTypes from 'prop-types';

export default function Aboutstrip({ title, description, chipLabel, imageUrl }) {
  return (
    <Card
      variant="outlined"
      orientation="horizontal"
      sx={{
        width: 320,
        '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
      }}
    >
      <AspectRatio ratio="1" sx={{ width: 90 }}>
        <img
          src={imageUrl}
          srcSet={`${imageUrl} 2x`}
          loading="lazy"
          alt={title}
        />
      </AspectRatio>
      <CardContent>
        <Typography level="title-lg" id="card-description">
          {title}
        </Typography>
        <Typography
          level="body-sm"
          aria-describedby="card-description"
          sx={{ mb: 1 }}
        >
          <Link
            overlay
            underline="none"
            href="#interactive-card"
            sx={{ color: 'text.tertiary' }}
          >
            {description}
          </Link>
        </Typography>
        <Chip
          variant="outlined"
          color="primary"
          size="sm"
          sx={{ pointerEvents: 'none' }}
        >
          {chipLabel}
        </Chip>
      </CardContent>
    </Card>
  );
}

Aboutstrip.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  chipLabel: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
};