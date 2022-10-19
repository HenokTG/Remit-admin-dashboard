import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';

// @mui
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
// sections
import ProfileForm from '../sections/auth/profile/ProfileForm';
// modules and context
import { axiosInstance } from '../axios';
import { useGlobalContext } from '../context';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(0),
  position: 'fixed',
  height: '100%',
  top: 0,
  zIndex: 1,
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  marginLeft: 'calc(232px + (50% - 240px))',

  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function UpdateProfile() {
  const { loggedIn } = useGlobalContext();
  const navigate = useNavigate();
  const prevLocation = useLocation();
  
  useEffect(() => {
    if (loggedIn === false) {
      navigate(`/login?redirectTo=${prevLocation.pathname}`);
    }
  }, []);

  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  return (
    <Page title="Update Agent Profile">
      <RootStyle>
        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Manage your Tabor Remit Transactions
            </Typography>
            <img alt="register" src="/static/illustrations/illustration_register.png" />
          </SectionStyle>
        )}

        <Container>
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
              Update Agent Profile
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 5 }}>Let us know you better</Typography>

            <ProfileForm />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
