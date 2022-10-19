import { axiosInstance } from '../axios';

const fetchPayments = (setLoading, setPAYMENTLIST) => {
  axiosInstance
    .get(`api/agent/admin/payments/`)
    .then((res) => {
      const PAYMENTLIST = res.data.map((pay, idx) => ({
        id: pay.id,
        paymentID: pay.transaction_number,
        payType: pay.payment_type,
        bank: pay.payment_bank,
        name: pay.agent_name,
        paid: pay.paid_amount,
        total: pay.total_payment,

        get date() {
          const dbDate = new Date(pay.payment_time).toString();
          return dbDate.split('G')[0];
        },
      }));
      setLoading(false);
      setPAYMENTLIST(PAYMENTLIST);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
      setPAYMENTLIST([]);
    });
};

export default fetchPayments;
