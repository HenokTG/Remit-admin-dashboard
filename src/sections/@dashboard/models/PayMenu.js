import PropTypes from 'prop-types';

import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
// component
import Iconify from '../../../components/Iconify';
// context and modules
// ----------------------------------------------------------------------

PayMenu.propTypes = {
  payLink: PropTypes.string,
  changeable: PropTypes.bool,
};
export default function PayMenu({ payLink, changeable }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(changeable && true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 230, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem component={RouterLink} to={payLink} sx={{ color: 'info.main' }}>
          <ListItemIcon>
            <Iconify icon="cib:amazon-pay" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Change Payment Status" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
