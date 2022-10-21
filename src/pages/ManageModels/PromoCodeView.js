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
import ListToolbar from '../../sections/@dashboard/ListToolbar';
// mock and context and modules
import { useGlobalContext } from '../../context';
import { fetchPromos } from '../../_fetchData/models';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'promoter', label: 'Promoter', alignRight: false },
  { id: 'promo_code', label: 'Promo code', alignRight: false },
  { id: 'promo_discount_rate', label: 'Promotion Discount (%)', alignRight: true },
  { id: 'promo_expiry_date', label: 'Promo Code Expiry Date', alignRight: true },
  { id: 'isExpired', label: 'Expired', alignRight: false },
  { id: 'isValidFor', label: 'Days until Expiration', alignRight: false },
  { id: '' },
];
// ----------------------------------------------------------------------

export default function PromoCodes() {
  const [loading, setLoading] = useState(true);
  const [isPromocodeDeleted, setIsPromocodeDeleted] = useState(false);

  const [PROMOLIST, setPROMOLIST] = useState([]);

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { loggedIn } = useGlobalContext();
  const navigate = useNavigate();
  const prevLocation = useLocation();

  useEffect(() => {
    setLoading(true);
    if (loggedIn === false) {
      navigate(`/login?redirectTo=${prevLocation.pathname}`);
    }
    fetchPromos(setLoading, setPROMOLIST);
  }, [isPromocodeDeleted]);

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
    <Page title="Dashboard: Agent">
      {!loading && (
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Promotion Codes
            </Typography>
            <Button
              variant="contained"
              component={RouterLink}
              to="/dashboard/manage-models/Promo-codes/add"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Promo-Code
            </Button>
          </Stack>

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
                              updateLink={`/dashboard/manage-models/Promo-codes/update/promo_code=${code}`}
                              deletePath={`api/remit/admin/promo-codes/${code}/`}
                              setDeleted={setIsPromocodeDeleted}
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
        </Container>
      )}{' '}
    </Page>
  );
}
