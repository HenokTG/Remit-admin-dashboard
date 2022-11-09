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
import { fetchPromos } from '../../_fetchData/models';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'promoter', label: 'Promoter' },
  { id: 'promo_code', label: 'Promo code' },
  { id: 'promo_discount_rate', label: 'Promotion Discount (%)' },
  { id: 'promo_expiry_date', label: 'Promo Code Expiry Date' },
  { id: 'isExpired', label: 'Expired' },
  { id: 'isValidFor', label: 'Days until Expiration' },
  { id: '' },
];
// ----------------------------------------------------------------------

export default function PromoCodes() {
  const [PromocodeLoading, setPromocodeLoading] = useState(true);

  const [deletedPromocodeID, setDeletedPromocodeID] = useState(0);

  const [PROMOLIST, setPROMOLIST] = useState([]);

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { loggedIn, profile } = useGlobalContext();
  const navigate = useNavigate();
  const prevLocation = useLocation();

  useEffect(() => {
    setPromocodeLoading(true);
    if (loggedIn === false) {
      navigate(`/login?redirectTo=${prevLocation.pathname}`);
    }

    if (profile.is_superuser === false) {
      navigate('/dashboard/');
    }

    fetchPromos(setPromocodeLoading, setPROMOLIST);
    // eslint-disable-next-line
  }, [deletedPromocodeID, profile]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - PROMOLIST.length) : 0;

  const sortedPromocodes = PROMOLIST;
  const isUserNotFound = sortedPromocodes.length === 0;

  return (
    <Page title="Promotion Code List">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Promotion Codes
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/dashboard/manage-models/promo-codes/add"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Promo-Code
          </Button>
        </Stack>
        {PromocodeLoading ? (
          <Loading />
        ) : (
          <Card>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800, paddingInline: '2rem', marginTop: '2rem' }}>
                <Table>
                  <ListHead noCheckBox headLabel={TABLE_HEAD} rowCount={PROMOLIST.length} />
                  <TableBody>
                    {sortedPromocodes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, promter, code, date, rate, isExpired, remainingDays } = row;

                      return (
                        <TableRow hover key={id}>
                          <TableCell align="left">
                            <Label>
                              <Typography>{promter}</Typography>
                            </Label>
                          </TableCell>
                          <TableCell align="left">{code}</TableCell>
                          <TableCell align="right">{rate.toFixed(2)}</TableCell>
                          <TableCell align="right">{date}</TableCell>
                          <TableCell align="center">
                            <Label variant="ghost" color={(isExpired && 'error') || 'success'}>
                              {isExpired ? 'Yes' : 'No'}
                            </Label>
                          </TableCell>
                          <TableCell align="right">
                            {remainingDays && remainingDays.day > 0 ? (
                              `${`${remainingDays.day && `${remainingDays.day} day(s)`} ${
                                remainingDays.hour && `${remainingDays.hour} hour(s)`
                              } ${remainingDays.min && `${remainingDays.min} minute(s)`}`}`
                            ) : (
                              <Label variant="ghost" color={'error'}>{`${Math.abs(
                                remainingDays.day
                              )} day(s) passed`}</Label>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <MoreMenu
                              updateLink={`/dashboard/manage-models/promo-codes/update/promo_code=${code}`}
                              deletePath={`api/remit/admin/promo-codes/${code}/`}
                              setDeleted={{
                                setDeletedID: setDeletedPromocodeID,
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
              count={PROMOLIST.length}
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
