import { faker } from '@faker-js/faker';
import { sample } from 'lodash';
import { axiosInstance } from '../axios';

const cardList = [...Array(30)].map((_, index) => {
  return {
    transactionID: faker.datatype.uuid().slice(0, 15),
    status: sample(['COMMITTED', 'APPROVED']),
    date: faker.date.recent(10),
    airtime: faker.datatype.number({ min: 100, max: 5000, precision: 100 }),
    price: faker.datatype.number({ min: 110, max: 5500, precision: 0.01 }),
    name: faker.name.findName(),
    commision: sample(['10.00%', '12.50%', '5.00%', '8.50%', '11.75%', '16.75%', '7.00%', '15.00%', '4.50', '20.00%']),
    Payment: faker.datatype.number({ min: 11, max: 250, precision: 0.01 }),
    Paid: faker.datatype.boolean(),
  };
});

const fetchCardPurchases = (setLoading, setCARDPURCHASELIST, isSuperuser) => {
  axiosInstance
    .get(`api/remit${isSuperuser ? '/admin' : ''}/transactions/`)
    .then((res) => {
      const CARDPURCHASELIST = res.data.map((trscn, idx) => ({
        transactionID: trscn.transaction_id,
        status: trscn.transaction_status === 'commited' ? 'COMMITTED' : trscn.transaction_status,
        airtime: trscn.airtime_amount,
        price: trscn.sells_amount_ETB,
        name: trscn.agent_name,
        commision: trscn.commision ? trscn.commision : 0,
        get Payment() {
          return this.price * this.commision;
        },
        payment: trscn.payment_owed,
        paid: trscn.is_commission_paid,
        get date() {
          const dbDate = new Date(trscn.committed_on).toString();
          return dbDate.split('G')[0];
        },
      }));
      setLoading(false);
      setCARDPURCHASELIST(CARDPURCHASELIST);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
      setCARDPURCHASELIST([]);
    });
};

export default fetchCardPurchases;
