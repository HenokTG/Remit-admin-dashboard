import { useState, useEffect } from 'react';
// @mui
import PropTypes from 'prop-types';
import { Box, Stack, Link, Card, Button, Divider, Typography, CardHeader } from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
// context and modules
import { fetchNewsDetail } from '../../../_fetchData/models';
// ----------------------------------------------------------------------

AppNewsUpdate.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function AppNewsUpdate({ title, subheader, list, ...other }) {
  const [margin, setMargin] = useState([0, 3]);
  const [newsID, setNewsID] = useState(0);
  const [isViewHeadline, setIsViewHeadline] = useState(true);

  const handlePrev = (step) => {
    const newMarg = [margin[0] - step, margin[1] - step];
    newMarg[0] = newMarg[0] <= 0 ? 0 : newMarg[0];
    newMarg[1] = newMarg[1] <= step ? step : newMarg[1];

    console.log('prev', newMarg);

    setMargin(newMarg);
  };
  const handleNext = (step) => {
    const newMarg = [margin[0] + step, margin[1] + step];
    newMarg[0] = newMarg[0] >= list.length - step ? list.length - step : newMarg[0];
    newMarg[1] = newMarg[1] >= list.length ? list.length : newMarg[1];

    console.log('next', newMarg);

    setMargin(newMarg);
  };

  return (
    <>
      {isViewHeadline ? (
        <Card {...other}>
          <CardHeader title={`${title} (${list.length})`} subheader={subheader} />

          <Scrollbar>
            <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
              {list.slice(margin[0], margin[1]).map((news) => (
                <NewsItem key={news.id} news={news} setDetailView={setIsViewHeadline} setNewsID={setNewsID} />
              ))}
            </Stack>
          </Scrollbar>

          <Divider />

          <Box sx={{ width: '100%', py: 2, px: 5, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              size="small"
              color="inherit"
              disabled={margin[0] === 0 && true}
              startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}
              onClick={() => handlePrev(3)}
            >
              previous
            </Button>
            <Button
              size="small"
              color="inherit"
              disabled={margin[1] === list.length && true}
              endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}
              onClick={() => handleNext(3)}
            >
              next
            </Button>
          </Box>
        </Card>
      ) : (
        <Card>
          <NewsDetail newsID={newsID} setDetailView={setIsViewHeadline} />
        </Card>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

NewsItem.propTypes = {
  news: PropTypes.shape({
    id: PropTypes.number,
    description: PropTypes.string,
    image: PropTypes.string,
    postedAt: PropTypes.instanceOf(Date),
    title: PropTypes.string,
  }),
  setDetailView: PropTypes.func,
  setNewsID: PropTypes.func,
};

function NewsItem({ news, setDetailView, setNewsID }) {
  const { id, image, title, description, postedAt } = news;

  const handleChooseNews = () => {
    setNewsID(id);
    setDetailView(false);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box component="img" alt={title} src={image} sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }} />

      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Link color="inherit" variant="subtitle2" underline="hover" noWrap onClick={handleChooseNews}>
          {title}
        </Link>

        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {description}
        </Typography>
      </Box>

      <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
        {fToNow(postedAt)}
      </Typography>
    </Stack>
  );
}

// ----------------------------------------------------------------------

NewsDetail.propTypes = {
  newsID: PropTypes.number,
  setDetailView: PropTypes.func,
};

function NewsDetail({ newsID, setDetailView }) {
  const [newDeatil, setNewDeatil] = useState({ title: '', description: '', postedAt: Date() });

  useEffect(() => {
    fetchNewsDetail(newsID, setNewDeatil);
    // eslint-disable-next-line
  }, []);
  
  const { title, description, postedAt } = newDeatil;

  return (
    <Box sx={{ minWidth: 240, width: '100%', px: 5 }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}
      >
        <Typography color="inherit" variant="h4" noWrap>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
          {fToNow(postedAt)}
        </Typography>
      </Stack>
      <Typography variant="body2" sx={{ color: 'text.primary', my: 3 }}>
        {description}
      </Typography>
      <Divider />

      <Button
        size="small"
        color="inherit"
        startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}
        onClick={() => setDetailView(true)}
        sx={{ my: 2 }}
      >
        back to headlines
      </Button>
    </Box>
  );
}
