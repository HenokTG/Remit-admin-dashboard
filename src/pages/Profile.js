import { useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';

// @mui
import { styled } from '@mui/material/styles';
import { Card, MenuItem, Typography, Box, Avatar } from '@mui/material';

// hooks
// import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
// sections
import ProfileView from '../sections/auth/profile/ProfileView';
// modules and context
import { useGlobalContext } from '../context';
// ----------------------------------------------------------------------
// Themes
const SectionStyle = styled(Card)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.grey[500_12],
}));

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.between('xs', 'md')]: {
    display: 'flex',
    margin: theme.spacing(0, 2),
  },
  [theme.breakpoints.up('md')]: {
    margin: theme.spacing(0, 5),
  },
}));

const ProfileHeaderStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 2),
  backgroundColor: theme.palette.grey[500_12],
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
  alignItems: 'center',
  margin: theme.spacing(1),
  gap: theme.spacing(1),
}));

// ----------------------------------------------------------------------

export default function Profile() {
  const { loggedIn, account, profile } = useGlobalContext();
  const navigate = useNavigate();
  const prevLocation = useLocation();

  useEffect(() => {
    if (loggedIn === false) {
      navigate(`/login?redirectTo=${prevLocation.pathname}`);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Page title="Agent Profile View">
      <RootStyle>
        <SectionStyle>
          <ProfileHeaderStyle>
            <Box>
              <AccountStyle>
                <Avatar src={account.photoURL} alt="profile" sx={{ width: 75, height: 75 }}>
                  <Avatar src={account.avatorURL} alt="avator" sx={{ width: 75, height: 75 }} />
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
              sx={{ m: 3, color: '#f05e09', border: '1px solid #f05e09', borderRadius: 1 }}
              key="Logout"
              to="/agent-profile-update"
              component={RouterLink}
            >
              Update Agent Profile
            </MenuItem>
          </ProfileHeaderStyle>
          <ProfileView profile={profile} /> {/* Camge This to "profile" object */}
        </SectionStyle>
      </RootStyle>
    </Page>
  );
}
