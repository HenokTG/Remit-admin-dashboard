import { filter } from 'lodash';
import { sentenceCase } from 'change-case';

import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { ListHead, MoreMenu } from '../sections/@dashboard/models';
import ListToolbar from '../sections/@dashboard/ListToolbar';
// mock and context and modules
import { useGlobalContext } from '../context';
import fetchAgents from '../_fetchData/agentList';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'agent', label: 'Agent', alignRight: false },
  { id: 'name', label: 'Full Name', alignRight: false },
  { id: 'company', label: 'Company', alignRight: false },
  { id: 'commission', label: 'Commission (%)', alignRight: false },
  { id: 'phone', label: 'Phone Number', alignRight: false },
  { id: 'email', label: 'Email Address', alignRight: false },
  { id: 'isVerified', label: 'Active', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Agent() {
  const [loading, setLoading] = useState(true);
  const [isAgentDeleted, setIsAgentDeleted] = useState(false);

  const [AGENTLIST, setAGENTLIST] = useState([]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('agent');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { loggedIn } = useGlobalContext();
  const navigate = useNavigate();
  const prevLocation = useLocation();

  useEffect(() => {
    setLoading(true);
    if (loggedIn === false) {
      navigate(`/login?redirectTo=${prevLocation.pathname}`);
    }
    fetchAgents(setLoading, setAGENTLIST);
  }, [isAgentDeleted]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = AGENTLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - AGENTLIST.length) : 0;

  const filteredUsers = applySortFilter(AGENTLIST, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Dashboard: Agent">
      {!loading && (
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Agents
            </Typography>
            <Button
              variant="contained"
              component={RouterLink}
              to="/dashboard/agent-add"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Agent
            </Button>
          </Stack>

          <Card>
            <ListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
              placeHl="Users"
            />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <ListHead
                    noCheckBox={false}
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={AGENTLIST.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, agent, name, email, commission, phone, company, imageUrl, avatarUrl, isVerified } =
                        row;
                      const isItemSelected = selected.indexOf(name) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar src={imageUrl} alt={name}>
                                <Avatar alt="agent avator" src={avatarUrl} />
                              </Avatar>
                              <Typography variant="subtitle2" noWrap>
                                {agent}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{name}</TableCell>
                          <TableCell align="left">{company}</TableCell>
                          <TableCell align="right">{commission}</TableCell>
                          <TableCell align="right">{phone}</TableCell>
                          <TableCell align="left">{email}</TableCell>
                          <TableCell align="center">
                            <Label variant="ghost" color={(!isVerified && 'error') || 'success'}>
                              {isVerified ? 'Yes' : 'No'}
                            </Label>
                          </TableCell>

                          <TableCell align="right">
                            <MoreMenu
                              updateLink={`/dashboard/agent-update/agent=${id}`}
                              deletePath={`api/agent/profiles/${id}/`}
                              setDeleted={setIsAgentDeleted}
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
                          <SearchNotFound searchQuery={filterName} />
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
              count={AGENTLIST.length}
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
