import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFTextField } from '../../components/hook-form';
// context and modules
import { axiosInstance } from '../../axios';
import { useGlobalContext } from '../../context';
// ----------------------------------------------------------------------

export default function Currency() {
  const { loggedIn } = useGlobalContext();
  const [isForexRateAdded, setIsForexRateAdded] = useState(false);

  const navigate = useNavigate();
  const prevLocation = useLocation();

  const [exchangeData, setExchangeData] = useState({});

  useEffect(() => {
    if (loggedIn === false) {
      navigate(`/login?redirectTo=${prevLocation.pathname}`);
    }
    axiosInstance
      .get('api/agent/admin/currency/1')
      .then((res) => {
        setExchangeData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // eslint-disable-next-line
  }, [isForexRateAdded]);

  const currencyUpdateOn = exchangeData.update_on && new Date(exchangeData.update_on).toString();
  const forexRate = exchangeData.forex_rate && exchangeData.forex_rate.toFixed(2);

  const AgentUpdateSchema = Yup.object().shape({
    forexRateUSD: Yup.number().required('USD to ETB conversion rate is required'),
  });

  const defaultValues = {
    forexRateUSD: '',
  };

  const methods = useForm({
    resolver: yupResolver(AgentUpdateSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    const formData = methods.getValues();
    const postData = {
      update_on: new Date(),
      forex_rate: formData.forexRateUSD,
    };
    console.log('Check Values: ', formData, postData);
    if (forexRate) {
      axiosInstance
        .put('api/agent/admin/currency/1/', postData)
        .then((res) => {
          console.log(res.data);
          navigate('/dashboard/manage-models/Packages');
        })
        .catch((error) => {
          console.log(error.response.data.detail);
        });
    } else {
      axiosInstance
        .post('api/agent/admin/currency/', postData)
        .then((res) => {
          console.log(res.data);
          setIsForexRateAdded(true);
        })
        .catch((error) => {
          console.log(error.response.data.detail);
        });
    }
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ marginInline: '30%' }}>
        <Typography variant="h4">Forex Conversion Rate</Typography>
        {!forexRate ? (
          <Typography paragraph align="justify">
            Please add USD to Ethiopian Birr {'(ETB)'} converion rate
          </Typography>
        ) : (
          <Typography paragraph align="justify" sx={{ marginBottom: '5rem', lineSpacing: '1rem' }}>
            As of {currencyUpdateOn}, the currencey excahnge rate from USD to Ethiopian birr {'(ETB)'} is{' '}
            <strong style={{ color: '#1E90FF' }}>{forexRate}</strong>. Update exchange rate by submiting new rate in the
            box below. This rate will be used to convert the sells price of remit packages from ethiopian birr to USD
            sells price for PayPal transaction.
          </Typography>
        )}
        <RHFTextField name="forexRateUSD" label="USD to ETB Conversion rate" />
        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Update Forex rate
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
