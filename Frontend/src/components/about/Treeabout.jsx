import Box from '@mui/material/Box';
import { styled, alpha } from '@mui/material/styles';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { useState } from 'react';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InsightsIcon from '@mui/icons-material/Insights';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EventIcon from '@mui/icons-material/Event';
import SecurityIcon from '@mui/icons-material/Security';
import InventoryIcon from '@mui/icons-material/Inventory';
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import FeedbackIcon from '@mui/icons-material/Feedback';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const FOOD_DONATION_STEPS = [
  {
    id: 'identify',
    label: 'Identify Surplus Food',
    icon: <RestaurantIcon />,
    children: [
      { id: 'restaurants', label: 'Partner with restaurants and bakeries', icon: <StorefrontIcon /> },
      { id: 'events', label: 'Collect surplus from events and parties', icon: <EventIcon /> },
    ],
  },
  {
    id: 'collect',
    label: 'Food Collection and Verification',
    icon: <VerifiedIcon />,
    children: [
      { id: 'quality-check', label: 'Ensure food is fresh and safe', icon: <SecurityIcon /> },
      { id: 'storage', label: 'Store food properly before distribution', icon: <InventoryIcon /> },
    ],
  },
  {
    id: 'distribution',
    label: 'Food Distribution',
    icon: <LocalShippingIcon />,
    children: [
      { id: 'community-centers', label: 'Distribute at local shelters and centers', icon: <HomeIcon /> },
      { id: 'direct-help', label: 'Deliver food to families in need', icon: <GroupsIcon /> },
    ],
  },
  {
    id: 'impact',
    label: 'Impact and Feedback',
    icon: <InsightsIcon />,
    children: [
      { id: 'beneficiary-feedback', label: 'Collect feedback from recipients', icon: <FeedbackIcon /> },
      { id: 'growth', label: 'Expand outreach and partnerships', icon: <TrendingUpIcon /> },
    ],
  },
];

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    margin: theme.spacing(0.5, 0),
    transition: 'all 0.3s ease',
    
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      transform: 'translateX(8px)',
    },

    [`& .${treeItemClasses.label}`]: {
      fontSize: '1em',
      fontWeight: 600,
      color: theme.palette.text.primary,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
    },
  },

  [`& .${treeItemClasses.iconContainer}`]: {
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    padding: theme.spacing(0.5),
    marginRight: theme.spacing(1),
    transition: 'transform 0.3s ease',

    '& svg': {
      fontSize: '1.2rem',
    },

    '&:hover': {
      transform: 'rotate(360deg)',
    },
  },

  [`& .${treeItemClasses.group}`]: {
    marginLeft: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    borderLeft: `2px solid ${alpha(theme.palette.primary.main, 0.4)}`,
  },

  '&:hover > $content': {
    backgroundColor: theme.palette.action.hover,
  },

  // Animation for expanding/collapsing
  [`& .${treeItemClasses.group}`]: {
    transition: 'opacity 0.3s ease',
  },
}));

export default function Treeabout() {
  const [expanded, setExpanded] = useState(['identify']);
  const [selected, setSelected] = useState([]);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };

  const renderTree = (nodes) => (
    <CustomTreeItem 
      key={nodes.id} 
      nodeId={nodes.id} 
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {nodes.icon}
          <span>{nodes.label}</span>
        </Box>
      }
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </CustomTreeItem>
  );

  return (
    <Box 
      sx={{ 
        minHeight: 352, 
        width: '100%',
        maxWidth: 800,
        margin: '0 auto',
        padding: 3,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
        '& .MuiTreeItem-root': {
          '&:hover > .MuiTreeItem-content': {
            backgroundColor: 'action.hover',
          },
        },
      }}
    >
      <RichTreeView
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
        slots={{ item: CustomTreeItem }}
        items={FOOD_DONATION_STEPS}
        aria-label="food donation process"
      />
    </Box>
  );
}