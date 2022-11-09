import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Page from '../../components/Page';
import Loading from '../../components/Loading';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import Iconify from '../../components/Iconify';
import SearchNotFound from '../../components/SearchNotFound';
import { ListHead, MoreMenu } from '../../sections/@dashboard/models';
// mock and context and modules
import { useGlobalContext } from '../../context';
import { fetchPackages } from '../../_fetchData/models';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'packageOrder', label: 'Package order' },
  { id: 'airtimeValue', label: 'Airtime Value' },
  { id: 'sellingPriceETB', label: 'Selling Price ETB' },
  { id: 'forexRate', label: 'USD to ETB rate' },
  { id: 'sellingPriceUSD', label: 'Selling Price USD' },
  { id: 'packageDisc', label: 'Package discount (%)' },
  { id: '' },
];
// ----------------------------------------------------------------------

export default function Packages() {
  const [packageLoading, setPackageLoading] = useState(true);

  const [deletedPackageID, setDeletedPackageID] = useState(0);

  const [PACKAGELIST, setPACKAGELIST] = useState([]);

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { loggedIn, profile } = useGlobalContext();
  const navigate = useNavigate();
  const prevLocation = useLocation();

  useEffect(() => {
    setPackageLoading(true);
    if (loggedIn === false) {
      navigate(`/login?redirectTo=${prevLocation.pathname}`);
    }

    if (profile.is_superuser === false) {
      navigate('/dashboard/');
    }

    fetchPackages(setPackageLoading, setPACKAGELIST);

    // eslint-disable-next-line
  }, [deletedPackageID, profile]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - PACKAGELIST.length) : 0;

  const sortedPackages = PACKAGELIST;

  const isUserNotFound = sortedPackages.length === 0;

  return (
    <Page title="Mobile Package List">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Packages
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/dashboard/manage-models/packages/add"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Package
          </Button>
        </Stack>
        {packageLoading ? (
          <Loading />
        ) : (
          <Card>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800, paddingInline: '2rem', marginTop: '2rem' }}>
                <Table sx={{}}>
                  <ListHead headLabel={TABLE_HEAD} rowCount={PACKAGELIST.length} noCheckBox />
                  <TableBody>
                    {sortedPackages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, ETB, forexRate, USD, value, order, packageDisc } = row;
                      return (
                        <TableRow hover key={id}>
                          <TableCell align="left">
                            <Label>
                              <Typography>Package {order}</Typography>
                            </Label>
                          </TableCell>
                          <TableCell align="right">{value}</TableCell>
                          <TableCell align="right">{ETB && ETB.toFixed(2)}</TableCell>
                          <TableCell align="right">{forexRate && forexRate.toFixed(2)}</TableCell>
                          <TableCell align="right">{USD && USD.toFixed(2)}</TableCell>
                          <TableCell align="right">{packageDisc && packageDisc.toFixed(2)}</TableCell>
                          <TableCell align="right">
                            <MoreMenu
                              updateLink={`/dashboard/manage-models/packages/update/package_id=${id}`}
                              deletePath={`api/remit/admin/packages/${id}/`}
                              setDeleted={{
                                setDeletedID: setDeletedPackageID,
                                deletedID: id,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>

                  {isUserNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <SearchNotFound />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={PACKAGELIST.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        )}
      </Container>
    </Page>
  );
}
