import { useState } from 'react';
// material
import { styled, alpha } from '@mui/material/styles';
import { TextField, Slide, InputAdornment, MenuItem } from '@mui/material';
// component
import Iconify from '../../components/Iconify';

// context and modules
import { useGlobalContext } from '../../context';
import fetchDashboardSummary from '../../_fetchData/dashboardSummary';
import { fetchAgentsNames } from '../../_fetchData/agentList';

// ----------------------------------------------------------------------

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const SearchbarStyle = styled('div')(({ theme }) => ({
  top: 0,
  left: '3%',
  zIndex: 99,
  width: '85%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  height: APPBAR_MOBILE,
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  backgroundColor: `${alpha(theme.palette.background.default, 0.72)}`,
  [theme.breakpoints.up('md')]: {
    height: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

export default function Searchbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const { setSummary, profile, setIsSummaryLoading } = useGlobalContext();

  const [agentNameList, setAgentNameList] = useState([]);

  fetchAgentsNames(setAgentNameList, 'search');

  const handlSearch = (agentName) => {
    setSearchTerm(agentName);
    const [task, validAgent] = agentName === 'All' ? ['retrieve', profile.agent_name] : ['search', agentName];
    fetchDashboardSummary(setIsSummaryLoading, validAgent, setSummary, task);
  };

  return (
    <div>
      <Slide direction="down" in mountOnEnter unmountOnExit>
        <SearchbarStyle>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                </InputAdornment>
              ),
            }}
            label="Select Agent to Display Summary"
            variant="filled"
            select
            fullWidth
            value={searchTerm}
            onChange={(e) => handlSearch(e.target.value)}
          >
            {agentNameList.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </SearchbarStyle>
      </Slide>
    </div>
  );
}
