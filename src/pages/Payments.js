import { filter } from 'lodash';

import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';

// material
import {
  Container,
  Card,
  Stack,
  Button,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import CardPurchaseListHead from '../sections/@dashboard/cardPurchases/CardPurchaseListHead';
import { MoreMenu } from '../sections/@dashboard/models';
import ListToolbar from '../sections/@dashboard/ListToolbar';
// mock
import fetchPayments from '../_fetchData/paymentList';
import { useGlobalContext } from '../context';
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'paymentID', label: 'Transaction ID', alignRight: false },
  { id: 'date', label: 'Payment Time', alignRight: false },
  { id: 'paymentType', label: 'Payment Type', alignRight: false },
  { id: 'bank', label: 'Payment Bank', alignRight: false },
  { id: 'agentName', label: 'Payment for', alignRight: false },
  { id: 'paidAmount', label: 'Paid Amount', alignRight: false },
  { id: 'totalAgentPayment', label: 'Total Agent Payment', alignRight: false },
  { id: 'totalPayment', label: 'Total Payment', alignRight: false },
  { id: '' },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_transaction) => _transaction.paymentID.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function CardPurchases() {
  const [loading, setLoading] = useState(true);

  const { loggedIn } = useGlobalContext();
  const navigate = useNavigate();
  const prevLocation = useLocation();

  const [isPaymentDeleted, setIsPaymentDeleted] = useState(false);
  const [PAYMENTLIST, setPAYMENTLIST] = useState([]);

  const [agentSearchKey, setAgentSearchKey] = useState('');
  const [typeSearchKey, setTypeSearchKey] = useState('');
  const [bankSearchKey, setBankSearchKey] = useState('');
  const [searchURL, setSearchURL] = useState('api/agent/admin/payments/?Payment_Type=&Payment_Bank=&Agent_Name=');

  const filterProps = [
    {
      title: 'Agent Name',
      child: [...new Set(PAYMENTLIST.map((pay) => pay.name))],
      valueSet: agentSearchKey,
      callChangeFunc: setAgentSearchKey,
    },
    {
      title: 'Payment type',
      child: [...new Set(PAYMENTLIST.map((pay) => pay.payType))],
      valueSet: typeSearchKey,
      callChangeFunc: setTypeSearchKey,
    },
    {
      title: 'Payment Bank',
      child: [...new Set(PAYMENTLIST.map((pay) => pay.bank))].filter((elem) => elem !== '-'),
      valueSet: bankSearchKey,
      callChangeFunc: setBankSearchKey,
    },
  ];

  const handleBackendFilter = () => {
    const paymentBackendURL = `api/agent/admin/payments/?Payment_Type=${typeSearchKey}&Payment_Bank=${bankSearchKey}&Agent_Name=${agentSearchKey}`;
    setSearchURL(paymentBackendURL);
  };

  const clearBackendFilter = () => {
    setAgentSearchKey(null);
    setTypeSearchKey(null);
    setBankSearchKey(null);
    const paymentBackendURL = 'api/agent/admin/payments/?Payment_Type=&Payment_Bank=&Agent_Name=';
    setSearchURL(paymentBackendURL);
  };

  useEffect(() => {
    setLoading(true);
    if (loggedIn === false) {
      navigate(`/login?redirectTo=${prevLocation.pathname}`);
    }

    fetchPayments(setLoading, setPAYMENTLIST, searchURL);

  }, [isPaymentDeleted, searchURL]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('paymentID');

  const [filterPaymentID, setFilterPaymentID] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByPaymentID = (event) => {
    setFilterPaymentID(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - PAYMENTLIST.length) : 0;

  const filteredTransactions = applySortFilter(PAYMENTLIST, getComparator(order, orderBy), filterPaymentID);

  const isCardPurchaseNotFound = filteredTransactions.length === 0;

  return (
    <Page title="Dashboard: Card Purchases">
      {!loading && (
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Payments
            </Typography>
            <Button
              variant="contained"
              component={RouterLink}
              to="/dashboard/payment-made/add"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Payment
            </Button>
          </Stack>
          <Card>
            <ListToolbar
              filterName={filterPaymentID}
              onFilterName={handleFilterByPaymentID}
              placeHl="Payment"
              filterProps={filterProps}
              handleBackendFilter={handleBackendFilter}
              clearBackendFilter={clearBackendFilter}
            />
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800, paddingInline: '2rem', marginTop: '2rem' }}>
                <Table>
                  <CardPurchaseListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    onRequestSort={handleRequestSort}
                  />
                  <TableBody>
                    {filteredTransactions
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        const {
                          id,
                          date,
                          paymentID,
                          paymentType,
                          bank,
                          agentName,
                          paidAmount,
                          totalAgentPayment,
                          totalPayment,
                        } = row;

                        return (
                          <TableRow hover key={id} tabIndex={-1}>
                            <TableCell component="th" scope="row" padding="normal">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography variant="subtitle2" noWrap>
                                  {paymentID}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="right">{date}</TableCell>
                            <TableCell align="center">{paymentType}</TableCell>
                            <TableCell align="left">{bank}</TableCell>
                            <TableCell align="left">{agentName}</TableCell>
                            <TableCell align="right">{paidAmount.toFixed(2)}</TableCell>
                            <TableCell align="right">{totalAgentPayment.toFixed(2)}</TableCell>
                            <TableCell align="right">{totalPayment.toFixed(2)}</TableCell>

                            <TableCell align="right">
                              <MoreMenu
                                updateLink={`/dashboard/payment-made/update/payment_number=${id}`}
                                deletePath={`api/agent/admin/payments/${id}/`}
                                setDeleted={setIsPaymentDeleted}
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

                  {isCardPurchaseNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterPaymentID} />
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
              count={PAYMENTLIST.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
      )}
    </Page>
  );
}
