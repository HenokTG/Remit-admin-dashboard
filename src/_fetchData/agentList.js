import { axiosInstance } from '../axios';

// ----------------------------------------------------------------------

export const fetchAgentsNames = (setAgentNameList, task) => {
  axiosInstance
    .get(`api/agent/profiles/`)
    .then((res) => {
      const AGENTNAMELIST = res.data.map((agent) => agent.agent_name).filter((agentName) => agentName !== 'deleted');
      if (task === 'search') {
        AGENTNAMELIST.unshift('All');
      }
      setAgentNameList(AGENTNAMELIST);
    })
    .catch((error) => {
      console.log(error);
      setAgentNameList([]);
    });
};

const fetchAgents = (setLoading, setAGENTLIST) => {
  axiosInstance
    .get(`api/agent/profiles/`)
    .then((res) => {
      const AGENTLIST = res.data
        .filter((agent) => agent.agent_name !== 'deleted')
        .map((profile) => ({
          id: profile.agent_name,
          imageUrl: profile.image,
          agent: profile.agent_name,
          name: `${profile.first_name ? profile.first_name : ''} ${profile.last_name ? profile.last_name : ''}`,
          company: profile.business_name ? profile.business_name : '-',
          phone: `+251 ${profile.phone.toString().slice(0, 3)} ${profile.phone.toString().slice(3, 5)} ${profile.phone
            .toString()
            .slice(5)}`,
          email: profile.email ? profile.email : '-',
          commission: profile.commission ? (profile.commission * 100).toFixed(2) : '-',
          isVerified: profile.is_active,
          avatarUrl: `/static/mock-images/avatars/avatar_default.jpg`,
        }));
      setLoading(false);
      setAGENTLIST(AGENTLIST);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
      setAGENTLIST([]);
    });
};

export default fetchAgents;
