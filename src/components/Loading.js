import * as React from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

export default function Loading() {
  return (
    <Card sx={{ display: 'flex', height: '50vh', justifyContent: 'center', alignItems: 'center' }}>
      <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row">
        <CircularProgress color="secondary" />
        <CircularProgress color="success" />
        <CircularProgress color="inherit" />
      </Stack>
    </Card>
  );
}
