import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';
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

export default function Currency() {
  const { loggedIn, profile } = useGlobalContext();
  const [isForexRateAdded, setIsForexRateAdded] = useState(null);

  const navigate = useNavigate();
  const prevLocation = useLocation();

  const [exchangeData, setExchangeData] = useState({});

  useEffect(() => {
    if (loggedIn === false) {
      navigate(`/login?redirectTo=${prevLocation.pathname}`);
    }

    if (profile.is_superuser === false) {
      navigate('/dashboard/');
    }

    axiosInstance
      .get('api/agent/admin/currency')
      .then((res) => {
        setExchangeData(res.data.length >= 1 ? res.data[0] : {});
      })
      .catch((error) => {
        console.log(error);
      });

    // eslint-disable-next-line
  }, [isForexRateAdded, profile]);
  console.log('Currxy Update: ', exchangeData);

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
      updated_by: profile.agent_name,
      update_on: new Date(),
      forex_rate: formData.forexRateUSD,
    };
    if (forexRate) {
      axiosInstance
        .put(`api/agent/admin/currency/${exchangeData.id}/`, postData)
        .then(() => {
          navigate('/dashboard/manage-models/packages');
        })
        .catch((error) => {
          console.log(error.response.data.detail);
        });
    } else {
      axiosInstance
        .post('api/agent/admin/currency/', postData)
        .then((res) => {
          setIsForexRateAdded(res.data.id);
        })
        .catch((error) => {
          console.log(error.response.data.detail);
        });
    }
  };
  return (
    <Page title="ETB to USD Exchange Rate">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <MyFormStyle>
          <Stack spacing={3}>
            <Typography variant="h4">Forex Conversion Rate</Typography>
            {!forexRate ? (
              <Typography paragraph align="justify">
                Please add USD to Ethiopian Birr {'(ETB)'} converion rate
              </Typography>
            ) : (
              <Typography paragraph align="justify" sx={{ marginBottom: '5rem', lineSpacing: '1rem' }}>
                As of {currencyUpdateOn}, the currencey excahnge rate from USD to Ethiopian birr {'(ETB)'} is{' '}
                <strong style={{ color: '#1E90FF' }}>{forexRate}</strong>. Update exchange rate by submiting new rate in
                the box below. This rate will be used to convert the sells price of remit packages from ethiopian birr
                to USD sells price for PayPal transaction.
              </Typography>
            )}
            <RHFTextField name="forexRateUSD" label="USD to ETB Conversion rate" />
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
              Update Forex rate
            </LoadingButton>
          </Stack>
        </MyFormStyle>
      </FormProvider>
    </Page>
  );
}
