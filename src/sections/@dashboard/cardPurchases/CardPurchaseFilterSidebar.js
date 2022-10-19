import PropTypes from 'prop-types';
// material
import {
  Box,
  Radio,
  Stack,
  Button,
  Drawer,
  Rating,
  Divider,
  Checkbox,
  FormGroup,
  IconButton,
  Typography,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
// ----------------------------------------------------------------------

export const FILTER_PACKAGE_OPTIONS = ['100 Birr', '200 Birr', '500 Birr', '1000 Birr'];
export const FILTER_AGENT_OPTIONS = ['Agent 1', 'Agent 2', 'Agent 3', 'Agent 4'];
export const FILTER_PRICE_OPTIONS = [
  { value: 'below', label: 'Below 220 Birr' },
  { value: 'between', label: 'Between 220 - 750 Birr' },
  { value: 'above', label: 'Above 75 Birr' },
];

// ----------------------------------------------------------------------

CardPurchaseFilterSidebar.propTypes = {
  isOpenFilter: PropTypes.bool,
  filterProps: PropTypes.object,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
};

export default function CardPurchaseFilterSidebar({ isOpenFilter, onOpenFilter, onCloseFilter, filterProps }) {
  return (
    <>
      <Button
        sx={{ margin: '5rem 2rem' }}
        disableRipple
        color="inherit"
        endIcon={<Iconify icon="ic:round-filter-list" />}
        onClick={onOpenFilter}
      >
        Filters&nbsp;
      </Button>

      <Drawer
        anchor="right"
        open={isOpenFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Filters
          </Typography>
          <IconButton onClick={onCloseFilter}>
            <Iconify icon="eva:close-fill" width={20} height={20} />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            {filterProps &&
              filterProps.map((catg, idx) => (
                <div key={idx}>
                  <Typography variant="subtitle1" gutterBottom>
                    {catg.title}
                  </Typography>
                  <RadioGroup>
                    {catg.child.map((item, index) => (
                      <FormControlLabel key={index} value={item} control={<Radio />} label={item} />
                    ))}
                  </RadioGroup>
                </div>
              ))}
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="ic:round-clear-all" />}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
