import PropTypes from 'prop-types';

// @mui
import { styled } from '@mui/material/styles';
import { Card, Paper, Typography, Stack, Divider } from '@mui/material';
// components
// Themes
const ProfileElemStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexFlow: 'row wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  width: '50%',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

ProfileView.propTypes = {
  profile: PropTypes.object,
};

export default function ProfileView({ profile }) {
  const personalKeys = ['first_name', 'last_name', 'email', 'phone', 'commission'];
  const personalField = ['First Name:', 'Last Name:', 'Email:', 'Phone:', 'Commission (%):'];
  const businessKeys = ['business_name', 'region', 'zone', 'woreda', 'street'];
  const businessField = ['Bussiness:', 'Region:', 'Zone:', 'Wereda/District:', 'Town/Street:'];

  return (
    <Card sx={{ width: '100%', textAlign: 'center', padding: '1rem' }}>
      <Typography variant="h4" sx={{ color: 'text.primary', padding: '2rem' }}>
        Profile Detail
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
        alignItems="center"
        justifyContent="space-evenly"
        divider={<Divider orientation="vertical" flexItem />}
        sx={{ marginBottom: '1rem' }}
      >
        <Item>
          <Typography variant="h6" sx={{ color: 'text.primary', padding: '2rem' }}>
            Personal Info
          </Typography>
          {Object.keys(profile)
            .filter((key) => personalKeys.includes(key))
            .map((key, index) => (
              <ProfileElemStyle key={index}>
                <Typography variant="strong" sx={{ color: 'text.primary' }}>
                  {personalField[personalKeys.indexOf(key)]}
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                  {key === 'commission' ? (profile[key] * 100).toFixed(2) : profile[key]}
                </Typography>
              </ProfileElemStyle>
            ))}
        </Item>
        <Item>
          <Typography variant="h6" sx={{ color: 'text.primary', padding: '2rem' }}>
            Business Info
          </Typography>
          {Object.keys(profile)
            .filter((key) => businessKeys.includes(key))
            .map((key, index) => (
              <ProfileElemStyle key={index}>
                <Typography variant="strong" sx={{ color: 'text.primary' }}>
                  {businessField[businessKeys.indexOf(key)]}
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                  {profile[key]}
                </Typography>
              </ProfileElemStyle>
            ))}
        </Item>
      </Stack>
      <Divider orientation="horizontal" flexItem />
      <Stack
        spacing={2}
        direction="column"
        justifyContent="space-around"
        alignItems="flex-start"
        sx={{ margin: '1rem 2rem' }}
      >
        <Typography variant="h6" sx={{ color: 'text.primary' }}>
          Description:
        </Typography>
        <Typography variant="p" sx={{ color: 'text.primary', textAlign: 'justify' }}>
          {profile.description}
        </Typography>
      </Stack>
    </Card>
  );
}
