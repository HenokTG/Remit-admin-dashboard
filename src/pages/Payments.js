import { filter } from 'lodash';

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// material
import {
  Container,
  Card,
  Stack,
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
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import PaymentListHead from '../sections/@dashboard/cardPurchases/Pay_Purcahse_ListHead';
import ListToolbar from '../sections/@dashboard/ListToolbar';
// modules and  context
import fetchPayments from '../_fetchData/paymentList';
import { useGlobalContext } from '../context';
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'paymentID', label: 'Payment ID' },
  { id: 'date', label: 'Payment Time' },
  { id: 'paymentType', label: 'Payment Type' },
  { id: 'bank', label: 'Payment Bank' },
  { id: 'agentName', label: 'Payment for' },
  { id: 'cardPaidID', label: 'Card Repaid ID' },
  { id: 'paidAmount', label: 'Paid Amount' },
  { id: 'totalAgentPayment', label: 'Total Agent Payment' },
  { id: 'totalPayment', label: 'Total Payment' },
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

  const { loggedIn, profile, profilePk } = useGlobalContext();
  const navigate = useNavigate();
  const prevLocation = useLocation();

  const intialFeatchURL = profile.is_superuser
    ? 'api/agent/admin/payments/?Payment_Type=&Payment_Bank=&Agent_Name='
    : `api/agent/list-payments/${profilePk}`;

  const [PAYMENTLIST, setPAYMENTLIST] = useState([]);

  const [agentSearchKey, setAgentSearchKey] = useState('');
  const [typeSearchKey, setTypeSearchKey] = useState('');
  const [bankSearchKey, setBankSearchKey] = useState('');
  const [searchURL, setSearchURL] = useState(intialFeatchURL);

  const filterProps = [
    {
      title: 'Agent Name',
      child: [...new Set(PAYMENTLIST.map((pay) => pay.agentName))],
      valueSet: agentSearchKey,
      callChangeFunc: setAgentSearchKey,
    },
    {
      title: 'Payment type',
      child: [...new Set(PAYMENTLIST.map((pay) => pay.paymentType))],
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

    fetchPayments(profilePk, setLoading, setPAYMENTLIST, searchURL);
    // eslint-disable-next-line
  }, [searchURL]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('desc');

  const [orderBy, setOrderBy] = useState('date');

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
    <Page title="Payment Recordings">
      {!loading && (
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Payments
            </Typography>
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
                  <PaymentListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={profile.is_superuser ? TABLE_HEAD : TABLE_HEAD.slice(0, 8)}
                    onRequestSort={handleRequestSort}
                  />
                  <TableBody>
                    {filteredTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const {
                        id,
                        date,
                        paymentID,
                        paymentType,
                        bank,
                        agentName,
                        cardPaidID,
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
                          <TableCell align="left">{cardPaidID}</TableCell>
                          <TableCell align="right">{paidAmount.toFixed(2)}</TableCell>
                          <TableCell align="right">{totalAgentPayment.toFixed(2)}</TableCell>
                          {profile.is_superuser && <TableCell align="right">{totalPayment.toFixed(2)}</TableCell>}
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
