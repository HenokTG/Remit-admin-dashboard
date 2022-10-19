import { filter } from 'lodash';
import { sentenceCase } from 'change-case';

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
  { id: 'packageOrder', label: 'Package order', alignRight: false },
  { id: 'airtimeValue', label: 'Airtime Value', alignRight: true },
  { id: 'sellingPriceETB', label: 'Selling Price ETB', alignRight: true },
  { id: 'forexRate', label: 'USD to ETB rate', alignRight: true },
  { id: 'sellingPriceUSD', label: 'Selling Price USD', alignRight: true },
  { id: 'packageDisc', label: 'Package discount (%)', alignRight: true },
  { id: '' },
];
// ----------------------------------------------------------------------

export default function Packages() {
  const [loading, setLoading] = useState(true);
  const [isPackageDeleted, setIsPackageDeleted] = useState(false);

  const [PACKAGELIST, setPACKAGELIST] = useState([]);

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { loggedIn, profile } = useGlobalContext();
  const navigate = useNavigate();
  const prevLocation = useLocation();

  useEffect(() => {
    setLoading(true);
    if (loggedIn === false) {
      navigate(`/login?redirectTo=${prevLocation.pathname}`);
    }
    fetchPackages(setLoading, setPACKAGELIST);
  }, [isPackageDeleted]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - PACKAGELIST.length) : 0;

  const sortedPackages = PACKAGELIST

  const isUserNotFound = sortedPackages.length === 0;

  return (
    <Page title="Dashboard: Agent">
      {!loading && (
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Packages
            </Typography>
            <Button
              variant="contained"
              component={RouterLink}
              to="/dashboard/manage-models/Packages/add"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Package
            </Button>
          </Stack>

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
                          <TableCell align="right">{ETB.toFixed(2)}</TableCell>
                          <TableCell align="right">{forexRate.toFixed(2)}</TableCell>
                          <TableCell align="right">{USD.toFixed(2)}</TableCell>
                          <TableCell align="right">{packageDisc.toFixed(2)}</TableCell>
                          <TableCell align="right">
                            <MoreMenu
                              updateLink={`/dashboard/manage-models/Packages/update/package_id=${id}`}
                              deletePath={`api/remit/admin/packages/${id}/`}
                              setDeleted={setIsPackageDeleted}
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
        </Container>
      )}{' '}
    </Page>
  );
}
