import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import { styled } from '@mui/material/styles';
import { Card, MenuItem, Typography, Box, Grid, Stack, IconButton, InputAdornment, Divider } from '@mui/material';
// components
import Iconify from '../../../components/Iconify';
// ----------------------------------------------------------------------

const ProfileElemStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
}));

export default function ProfileView({ profile }) {
  return (
    <Stack spacing={3} sx={{ textAlign: 'center', marginTop: 5, width: '100%' }}>
      <h3>Profile Detail</h3>
      <Grid spacing={5} sx={{ gridTemplateColumns: '1fr 1fr' }}>
        <ProfileElemStyle>
          <Typography variant="strong" sx={{ color: 'text.primary' }}>
            First Name:
          </Typography>
          <Typography variant="p" sx={{ color: 'text.secondary' }}>
            {profile.displayName}
          </Typography>
        </ProfileElemStyle>
        <ProfileElemStyle>
          <Typography variant="strong" sx={{ color: 'text.primary' }}>
            Role:
          </Typography>
          <Typography variant="p" sx={{ color: 'text.secondary' }}>
            {profile.role}
          </Typography>
        </ProfileElemStyle>
      </Grid>
    </Stack>
  );
}
