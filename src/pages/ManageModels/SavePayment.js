import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { Stack, Typography, FormLabel, FormControl, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFTextField } from '../../components/hook-form';
import Page from '../../components/Page';
// context and modules
import { axiosInstance } from '../../axios';
import { useGlobalContext } from '../../context';
// ----------------------------------------------------------------------

const MyFormStyle = styled('div')(({ theme }) => ({
  marginInline: '10%',
  textAlign: 'center',
  [theme.breakpoints.between('sm', 'md')]: {
    marginInline: '15%',
  },
  [theme.breakpoints.between('md', 'lg')]: {
    marginInline: '20%',
  },
  [theme.breakpoints.up('lg')]: {
    marginInline: '25%',
  },
}));

export default function SavePackage() {
  const { loggedIn, profile } = useGlobalContext();
  const [payMethod, setPayMethod] = useState('Bank');
  const navigate = useNavigate();
  const prevLocation = useLocation();
  const { cardTnxNumber } = useParams();

  console.log('TRX ID: ', cardTnxNumber, cardTnxNumber.split('=')[1]);

  useEffect(() => {
    if (loggedIn === false) {
      navigate(`/login?redirectTo=${prevLocation.pathname}`);
    }

    if (profile.is_superuser === false) {
      navigate('/dashboard/');
    }
    // eslint-disable-next-line
  }, [profile]);

  const PackageSchema = Yup.object().shape({
    paymentBank: Yup.string(),
    txnNumber: Yup.string().required('Transaction id is required'),
  });

  const defaultValues = { paymentType: '', paymentBank: '', txnNumber: '' };

  const methods = useForm({
    resolver: yupResolver(PackageSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    console.log('Check Submit Clicked!');
    const formData = methods.getValues();
    const postData = {
      paymentType: payMethod,
      paymentBank: payMethod === 'Bank' ? formData.paymentBank : '-',
      txnNumber: formData.txnNumber,
      cardPurchaseID: cardTnxNumber.split('=')[1],
    };

    axiosInstance
      .post(`api/agent/admin/payments/`, postData)
      .then((res) => {
        console.log(res);
        navigate('/dashboard/payment-made');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Page title="Save Payment">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <MyFormStyle>
          <Stack spacing={3}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'left', marginBottom: '1rem' }}>
              Save Payment Detail
            </Typography>
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
            <RHFTextField name="txnNumber" label="Transaction ID" />
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
              Save Payment
            </LoadingButton>
          </Stack>
        </MyFormStyle>
      </FormProvider>
    </Page>
  );
}
