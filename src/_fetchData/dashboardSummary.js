import { axiosInstance } from '../axios';

// ----------------------------------------------------------------------

const fetchDashboardSummary = (profilePk, setSummary, task) => {
  if (profilePk !== '*') {
    axiosInstance
      .get(`api/agent/dashboard/summary/${profilePk}/${task}`)
      .then((res) => {
        setSummary(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

export default fetchDashboardSummary;
