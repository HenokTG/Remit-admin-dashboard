import { axiosInstance } from '../axios';

const fetchPayments = (profilePk, setLoading, setPAYMENTLIST, URL) => {
  if (profilePk !== '*') {
    axiosInstance
      .get(URL)
      .then((res) => {

        const PAYMENTLIST = res.data.map((pay) => ({
          id: pay.id,
          paymentID: pay.transaction_number,
          cardPaidID: pay.card_paid_id,
          paymentType: pay.payment_type,
          bank: pay.payment_bank,
          agentName: pay.paid_agent.agent_name,
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
        console.log(res.config.url);
      })
      .catch((error) => {
        console.log(error.config.url);
        setLoading(false);
        setPAYMENTLIST([]);
      });
  }
};

export default fetchPayments;
