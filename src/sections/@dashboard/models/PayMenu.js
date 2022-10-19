import PropTypes from 'prop-types';

import { useRef, useState } from 'react';

// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
// component
import Iconify from '../../../components/Iconify';
// context and modules
import { axiosInstance } from '../../../axios';
// ----------------------------------------------------------------------

PayMenu.propTypes = {
  payLink: PropTypes.string,
  chgable: PropTypes.bool,
  setPaid: PropTypes.func,
};
export default function PayMenu({ payLink, chgable, setPaid }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handlePay = (payLink) => {
    console.log('Pay path: ', payLink);
    axiosInstance
      .put(payLink, { is_commission_paid: true })
      .then((res) => {
        console.log(res.data);
        setPaid(chgable);
      })
      .catch((error) => {
        console.log(error.response.data.detail);
      });
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(chgable && true)}>
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
        <MenuItem sx={{ color: 'success.main' }} onClick={() => handlePay(payLink)}>
          <ListItemIcon>
            <Iconify icon="cib:amazon-pay" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Change Payment Status" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
