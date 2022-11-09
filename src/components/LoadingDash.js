import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function DashboardLoading() {
  return (
    <Box sx={{ display: 'flex', height: '10vh', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress />
    </Box>
  );
}
