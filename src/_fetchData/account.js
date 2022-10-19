import { axiosInstance } from '../axios';

// ----------------------------------------------------------------------

const fetchAccount = (profilePk, setAccount, setProfile) => {
  if (profilePk !== '*') {
    axiosInstance
      .get(`api/agent/profiles/${profilePk}/`)
      .then((res) => {
        let dispName = res.data.first_name ? `${res.data.first_name} ${res.data.last_name}` : res.data.business_name;
        dispName = dispName !== null ? dispName : res.data.agent_name;
        const phoneNo = res.data.phone.toString();
        setAccount({
          displayName: dispName,
          email: res.data.email,
          phone: `+251 ${phoneNo.slice(0, 3)} ${phoneNo.slice(3, 5)} ${phoneNo.slice(5)}`,
          role: res.data.is_superuser ? 'Admin' : 'Agent',
          photoURL: res.data.image,
          avatorURL: '/static/mock-images/avatars/avatar_default.jpg',
        });
        setProfile(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

export default fetchAccount;
