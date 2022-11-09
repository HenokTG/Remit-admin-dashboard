import { axiosInstance } from '../axios';

// ----------------------------------------------------------------------

const fetchDashboardSummary = (setLoading, profilePk, setSummary, task) => {
  setLoading(true);
  if (profilePk !== '*') {
    axiosInstance
      .get(`api/agent/dashboard/summary/${profilePk}/${task}`)
      .then((res) => {
        setSummary(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }
};

export default fetchDashboardSummary;
