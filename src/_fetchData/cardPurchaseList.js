import { axiosInstance } from '../axios';

const fetchCardPurchases = (profilePk, setLoading, setCARDPURCHASELIST, URL) => {
  if (profilePk !== '*') {
    axiosInstance
      .get(URL)
      .then((res) => {
        const CARDPURCHASELIST = res.data.map((trscn) => ({
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
        console.log(res.config.url);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setCARDPURCHASELIST([]);
      });
  }
};

export default fetchCardPurchases;
