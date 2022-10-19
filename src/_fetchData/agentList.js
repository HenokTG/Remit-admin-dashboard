import { faker } from '@faker-js/faker';
import { sample } from 'lodash';
import { axiosInstance } from '../axios';

// ----------------------------------------------------------------------

const users = [...Array(2)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/static/mock-images/avatars/avatar_${index + 1}.jpg`,
  name: faker.name.findName(),
  company: faker.company.companyName(),
  isVerified: faker.datatype.boolean(),
  phone: faker.phone.number('+251 9## ## ####'),
  get email() {
    return faker.internet.email(this.name, '', 'gmail.com', { allowSpecialCharacters: true });
  },
  commision: sample(['10.00%', '12.50%', '5.00%', '8.50%', '11.75%', '16.75%', '7.00%', '15.00%', '4.50', '20.00%']),
}));

const fetchAgents = (setLoading, setAGENTLIST) => {
  axiosInstance
    .get(`api/agent/profiles/`)
    .then((res) => {
      const AGENTLIST = res.data.map((profile, idx) => ({
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
