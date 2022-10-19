import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';

// @mui
import { styled } from '@mui/material/styles';
import { Card, MenuItem, Typography, Box, Avatar } from '@mui/material';

// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import Logo from '../components/Logo';
// sections
import ProfileView from '../sections/auth/profile/ProfileView';
// modules and context
import { axiosInstance } from '../axios';
import { useGlobalContext } from '../context';
import account from '../_fetchData/account';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  margin: theme.spacing(5),
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.grey[500_12],
}));

const ProfileHeaderStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 2.5),
  backgroundColor: theme.palette.grey[500_12],
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  margin: theme.spacing(2, 5),
  gap: theme.spacing(3),
}));

// ----------------------------------------------------------------------

export default function Profile() {
  const { loggedIn, profile } = useGlobalContext();
  const navigate = useNavigate();
  const prevLocation = useLocation();
  
  useEffect(() => {
    if (loggedIn === false) {
      navigate(`/login?redirectTo=${prevLocation.pathname}`);
    }
  }, [profile]);

  return (
    <Page title="Agent Profile View">
      <RootStyle>
        <SectionStyle>
          <ProfileHeaderStyle>
            <Box>
              <AccountStyle>
                <Avatar src={account.photoURL} alt="profile" sx={{ height: '20%', width: '20%' }}>
                  <Avatar src={account.avatorURL} alt="avator" />
                </Avatar>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h4" sx={{ color: 'text.primary' }}>
                    {account.displayName}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    {account.role}
                  </Typography>
                </Box>
              </AccountStyle>
            </Box>
            <MenuItem
              sx={{ m: 3, color: '#048eff', border: '1px solid #048eff', borderRadius: 1 }}
              key="Logout"
              to="/agent-profile-update"
              component={RouterLink}
            >
              Update Agent Profile
            </MenuItem>
          </ProfileHeaderStyle>
          <ProfileView profile={account} /> {/* Camge This to "profile" object */}
        </SectionStyle>
      </RootStyle>
    </Page>
  );
}
