import PropTypes from 'prop-types';
import { useState } from 'react';
// material
import { styled } from '@mui/material/styles';
import { Stack, Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment } from '@mui/material';
// component
import Iconify from '../../components/Iconify';
import { CardPurchaseFilterSidebar } from './cardPurchases';
// modules and  context
import { useGlobalContext } from '../../context';
// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  margin: '2rem 0 1rem 1rem',
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

// ----------------------------------------------------------------------

ListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  placeHl: PropTypes.string,
  filterProps: PropTypes.array,
  onFilterName: PropTypes.func,
  handleBackendFilter: PropTypes.func,
  clearBackendFilter: PropTypes.func,
};

export default function ListToolbar({
  numSelected,
  placeHl,
  filterName,
  onFilterName,
  filterProps,
  handleBackendFilter,
  clearBackendFilter,
}) {
  const [openFilter, setOpenFilter] = useState(false);
  const { profile } = useGlobalContext();

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          placeholder={`Search ${placeHl}...`}
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 && placeHl === 'Users' && (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      )}
      {profile.is_superuser && placeHl !== 'Users' && (
        <Stack
          direction="row"
          flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
          spacing={1}
          flexShrink={0}
          sx={{ my: 1, mb: 5 }}
        >
          <CardPurchaseFilterSidebar
            isOpenFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
            filterProps={filterProps}
            handleBackendFilter={handleBackendFilter}
            clearBackendFilter={clearBackendFilter}
          />
        </Stack>
      )}
    </RootStyle>
  );
}
