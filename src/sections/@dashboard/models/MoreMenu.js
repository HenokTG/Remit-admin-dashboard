import PropTypes from 'prop-types';

import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
// component
import Iconify from '../../../components/Iconify';
// context and modules
import { axiosInstance } from '../../../axios';
// ----------------------------------------------------------------------

MoreMenu.propTypes = {
  updateLink: PropTypes.string,
  deletePath: PropTypes.string,
  setDeleted: PropTypes.object,
};
export default function MoreMenu({ updateLink, deletePath, setDeleted }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const { setDeletedID, deletedID } = setDeleted;

  const handleDelete = (deletePath) => {
    console.log('Delete path: ', deletePath);
    axiosInstance
      .delete(deletePath)
      .then((res) => {
        console.log(res.data);
        setDeletedID(deletedID);
      })
      .catch((error) => {
        console.log(error.response.data.detail);
      });
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem component={RouterLink} to={updateLink} sx={{ color: 'info.main' }}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={() => handleDelete(deletePath)}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
