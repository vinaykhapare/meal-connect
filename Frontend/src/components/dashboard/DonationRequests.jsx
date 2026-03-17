import { useState, useEffect } from 'react';
import {
  Table,
  Sheet,
  Button,
  Chip,
  CircularProgress,
  Typography,
  Select,
  Option
} from '@mui/joy';
import { motion } from 'framer-motion';
import { fadeInUp } from '../../animations';

function DonationRequests() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/receiver/available-donations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setDonations(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (donationId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/receiver/accept-donation/${donationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        // Refresh donations list
        fetchDonations();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="danger">{error}</Typography>;

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
    >
      <Sheet>
        <Typography level="h4" sx={{ mb: 2 }}>
          Available Donations
        </Typography>
        
        <Table>
          <thead>
            <tr>
              <th>Donor</th>
              <th>Food Type</th>
              <th>Quantity</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation._id}>
                <td>{donation.name}</td>
                <td>{donation.foodType}</td>
                <td>{donation.totalCount}</td>
                <td>{donation.address}</td>
                <td>
                  <Chip
                    variant="soft"
                    color={donation.status === 'Pending' ? 'warning' : 'success'}
                  >
                    {donation.status}
                  </Chip>
                </td>
                <td>
                  {donation.status === 'Pending' && (
                    <Button
                      size="sm"
                      color="primary"
                      onClick={() => handleStatusUpdate(donation._id, 'Accepted')}
                    >
                      Accept
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </motion.div>
  );
}

export default DonationRequests; 