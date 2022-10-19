import { axiosInstance } from '../axios';

const fetchPayments = (setLoading, setPAYMENTLIST, URL) => {
  axiosInstance
    .get(URL)
    .then((res) => {
      const PAYMENTLIST = res.data.map((pay, idx) => ({
        id: pay.id,
        paymentID: pay.transaction_number,
        paymentType: pay.payment_type,
        bank: pay.payment_bank,
        agentName: pay.agent_name,
        paidAmount: pay.paid_amount,
        totalAgentPayment: pay.total_agent_payment,
        totalPayment: pay.total_payment,

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
