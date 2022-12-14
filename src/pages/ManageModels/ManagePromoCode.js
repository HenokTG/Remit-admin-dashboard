import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { Stack, Typography, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// date-fns
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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

export default function ManagePromoCode() {
  const { loggedIn, profile } = useGlobalContext();
  const [exDate, setExDate] = useState('');

  const navigate = useNavigate();
  const prevLocation = useLocation();
  const { promoCode } = useParams();

  useEffect(() => {
    if (loggedIn === false) {
      navigate(`/login?redirectTo=${prevLocation.pathname}`);
    }

    if (profile.is_superuser === false) {
      navigate('/dashboard/');
    }

    // eslint-disable-next-line
  }, [profile]);

  const PromocodeSchema = Yup.object().shape({
    promoter: Yup.string().required('Promoter name is required'),
    promoCode: Yup.string().required('Promo code is required'),
    promo_discountRate: Yup.number().required('Discount percent is required'),
  });

  const defaultValues = {
    promoter: '',
    promoCode: '',
    promo_discountRate: '',
  };

  const methods = useForm({
    resolver: yupResolver(PromocodeSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    const formData = methods.getValues();
    const postData = {
      promoter: formData.promoter,
      promo_code: formData.promoCode,
      promo_discount_rate: formData.promo_discountRate / 100,
      promo_expiry_date: exDate,
    };

    console.log('Check Values: ', formData, postData);

    if (promoCode) {
      axiosInstance
        .put(`api/remit/admin/promo-codes/${promoCode.split('=')[1]}/`, postData)
        .then((res) => {
          console.log(res.data);
          navigate('/dashboard/manage-models/Promo-codes');
        })
        .catch((error) => {
          console.log(error.response.data.detail);
        });
    } else {
      axiosInstance
        .post('api/remit/admin/promo-codes/', postData)
        .then((res) => {
          console.log(res.data);
          navigate('/dashboard/manage-models/Promo-codes');
        })
        .catch((error) => {
          console.log(error.response.data.detail);
        });
    }
  };

  return (
    <Page title="Manage Promotion Codes">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <MyFormStyle>
          <Stack spacing={3}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'left', marginBottom: '1rem' }}>
              {promoCode ? 'Update' : 'Add'} Promotion Code Detail
            </Typography>
            <RHFTextField name="promoter" label="Promoter name" />
            <RHFTextField name="promoCode" label="Promotion code" />
            <RHFTextField name="promo_discountRate" label="Promotion Discount rate in percent" />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={exDate}
                name="expiryDate"
                label="Promo code expiry date"
                InputProps={{ required: true }}
                onChange={(dateValue) => {
                  setExDate(dateValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
              {promoCode ? 'Update' : 'Add'} Prono Code
            </LoadingButton>
          </Stack>
        </MyFormStyle>
      </FormProvider>
    </Page>
  );
}
