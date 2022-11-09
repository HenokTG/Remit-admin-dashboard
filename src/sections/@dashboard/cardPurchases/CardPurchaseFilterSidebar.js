import PropTypes from 'prop-types';
// material
import {
  Box,
  Radio,
  Stack,
  MenuItem,
  TextField,
  Button,
  Drawer,
  Divider,
  IconButton,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
// ----------------------------------------------------------------------

CardPurchaseFilterSidebar.propTypes = {
  isOpenFilter: PropTypes.bool,
  filterProps: PropTypes.array,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  handleBackendFilter: PropTypes.func,
  clearBackendFilter: PropTypes.func,
};

export default function CardPurchaseFilterSidebar({
  isOpenFilter,
  onOpenFilter,
  onCloseFilter,
  filterProps,
  handleBackendFilter,
  clearBackendFilter,
}) {
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
            {filterProps && (
              <FormControl fullWidth>
                <TextField
                  select
                  name="selectAgent"
                  label={filterProps[0].title}
                  value={filterProps[0].valueSet}
                  onChange={(elem) => filterProps[0].callChangeFunc(elem.target.value)}
                >
                  {filterProps[0].child.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            )}

            {filterProps &&
              filterProps.slice(1).map((catg, idx) => {
                const { title, child, valueSet, callChangeFunc } = catg;
                return (
                  <FormControl key={idx}>
                    <FormLabel id={`payment-filter-radio_${idx}`}>
                      <Typography variant="subtitle1" gutterBottom>
                        {title}
                      </Typography>
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby={`controlled-radio-buttons-${title}-group`}
                      value={valueSet}
                      onChange={(elem) => callChangeFunc(elem.target.value)}
                    >
                      {child.map((item, index) => {
                        const checkBoolFalse = typeof item === 'boolean' && item ? 'Yes' : 'No';
                        const mylable = typeof item === 'boolean' && checkBoolFalse === 'No' ? 'No' : item;
                        return (
                          <FormControlLabel
                            key={index}
                            value={item}
                            control={<Radio />}
                            label={checkBoolFalse === 'Yes' ? 'Yes' : mylable}
                          />
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                );
              })}
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="primary"
            variant="outlined"
            startIcon={<Iconify icon="ic:round-clear-all" />}
            sx={{ mb: 1 }}
            onClick={() => handleBackendFilter()}
          >
            Apply Filter
          </Button>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="error"
            variant="outlined"
            startIcon={<Iconify icon="ic:round-clear-all" />}
            onClick={() => clearBackendFilter()}
          >
            Clear Filter
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
