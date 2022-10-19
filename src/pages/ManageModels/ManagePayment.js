import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Typography, FormLabel, FormControl, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFTextField } from '../../components/hook-form';
// context and modules
import { axiosInstance } from '../../axios';
import { useGlobalContext } from '../../context';
// ----------------------------------------------------------------------

export default function ManagePackage() {
  const { loggedIn, profile } = useGlobalContext();
  const [payMethod, setPayMethod] = useState('bank');
  const navigate = useNavigate();
  const prevLocation = useLocation();
  const { paymentNumber } = useParams();

  useEffect(() => {
    if (loggedIn === false) {
      navigate(`/login?redirectTo=${prevLocation.pathname}`);
    }
  }, []);

  const PackageSchema = Yup.object().shape({
    AgentCode: Yup.string().required('Agent name is required'),
    paymentBank: Yup.string(),
    txnNumber: Yup.string().required('Transaction id is required'),
    paidAmount: Yup.number().required(),
  });

  const defaultValues = {
    AgentCode: '',
    paymentType: '',
    paymentBank: '',
    txnNumber: '',
    paidAmount: '',
  };

  const methods = useForm({
    resolver: yupResolver(PackageSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    const formData = methods.getValues();
    const postData = {
      AgentCode: formData.AgentCode,
      paymentType: payMethod,
      paymentBank: payMethod === 'Bank' ? formData.paymentBank : '-',
      txnNumber: formData.txnNumber,
      paidAmount: formData.paidAmount,
    };
    console.log('Check Values: ', formData, postData);

    if (paymentNumber) {
      axiosInstance
        .put(`api/agent/admin/payments/${paymentNumber.split('=')[1]}/`, postData)
        .then((res) => {
          console.log(res.data);
          navigate('/dashboard/payment-made');
        })
        .catch((error) => {
          console.log(error.response.data.detail);
        });
    } else {
      axiosInstance
        .post('api/agent/admin/payments/', postData)
        .then((res) => {
          console.log(res.data);
          navigate('/dashboard/payment-made');
        })
        .catch((error) => {
          console.log(error.response.data.detail);
        });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ marginInline: '30%' }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'left', marginBottom: '1rem' }}>
          {paymentNumber ? 'Update' : 'Add'} Payment Detail
        </Typography>
        <RHFTextField name="AgentCode" label="Agent name" />
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">Method of Payment</FormLabel>
          <RadioGroup
            aria-labelledby="controlled-radio-buttons-payment-type-group"
            name="paymentType"
            value={payMethod}
            onChange={(elem) => setPayMethod(elem.target.value)}
          >
            <FormControlLabel value="Cash" control={<Radio />} label="Cash" />
            <FormControlLabel value="Bank" control={<Radio />} label="Bank Transaction" />
          </RadioGroup>
        </FormControl>
        {payMethod === 'Bank' && <RHFTextField name="paymentBank" label="Bank name" />}
        <RHFTextField name="txnNumber" label="Transaction number" />
        <RHFTextField name="paidAmount" label="Paid amount" />
        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          {paymentNumber ? 'Update' : 'Add'} Payment
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
