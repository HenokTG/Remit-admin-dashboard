import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// @mui
import { Grid, Container, Typography } from '@mui/material';
// import { Telegram } from 'react-share-icons';
import Telegram from 'react-share-icons/lib/Telegram';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections
import { AppNewsUpdate, AppContactUs, AppWidgetSummary } from '../sections/@dashboard/app';
// context and modules
import fetchDashboardSummary from '../_fetchData/dashboardSummary';
import { fetchNewsUpdate } from '../_fetchData/models';
import { useGlobalContext } from '../context';
// ----------------------------------------------------------------------

export default function DashboardApp() {
  const { loggedIn, profilePk, summary, setSummary, searchClosed } = useGlobalContext();
  const [newsList, setNewsList] = useState([]);

  const navigate = useNavigate();
  const prevLocation = useLocation();

  useEffect(() => {
    if (loggedIn === false) {
      navigate(`/login?redirectTo=${prevLocation.pathname}`);
    }

    fetchDashboardSummary(profilePk, setSummary, 'retrieve');
    fetchNewsUpdate(setNewsList);
    // eslint-disable-next-line
  }, [searchClosed, summary]);

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={2}>
            <AppWidgetSummary
              title="Card Purchased"
              total={summary ? summary.no_of_sells : 0}
              icon={'ant-design:mobile-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
            <AppWidgetSummary
              title="Sells Total"
              total={summary ? summary.total_sells : 0}
              color="success"
              icon={'ant-design:dollar-circle-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
            <AppWidgetSummary
              title="Commission Total"
              total={summary ? summary.total_commission : 0}
              color="info"
              icon={'ant-design:dollar-circle-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
            <AppWidgetSummary
              title="Commission Paid Total"
              total={summary ? summary.reimbursed_amount : 0}
              color="success"
              icon={'ant-design:carry-out-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
            <AppWidgetSummary
              title="Commission Unpaid Total"
              total={summary ? summary.remaining_amount : 0}
              color="warning"
              icon={'ant-design:pause-circle-filled'}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate title="News Update" list={newsList} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppContactUs
              title="Contact Us"
              list={[
                {
                  name: 'FaceBook',
                  link: '323234',
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} height={32} />,
                },
                {
                  name: 'Telegram',
                  link: 341212,
                  icon: <Telegram className="shares-telegram" style={{ height: 32, width: 32 }} />,
                },
                {
                  name: 'Linkedin',
                  link: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} height={32} />,
                },
                {
                  name: 'Twitter',
                  link: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} height={32} />,
                },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
