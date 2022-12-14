import * as Yup from 'yup';
import { useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

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

export default function ManagePackage() {
  const { loggedIn, profile } = useGlobalContext();
  const navigate = useNavigate();
  const prevLocation = useLocation();
  const { packageId } = useParams();

  useEffect(() => {
    if (loggedIn === false) {
      navigate(`/login?redirectTo=${prevLocation.pathname}`);
    } else if (profile.is_superuser === false) {
      navigate('/dashboard/');
    }

    // eslint-disable-next-line
  }, [profile]);

  const PackageSchema = Yup.object().shape({
    packageOrder: Yup.number().required(),
    airtimeValue: Yup.number().required(),
    priceETB: Yup.number().required(),
    discountRate: Yup.number().required(),
  });

  const defaultValues = {
    packageOrder: '',
    airtimeValue: '',
    priceETB: '',
    discountRate: '',
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
      package_order: formData.packageOrder,
      airtime_value: formData.airtimeValue,
      selling_price_ETB: formData.priceETB,
      discount_rate: formData.discountRate / 100,
    };
    console.log('Check Values: ', formData, postData);

    if (packageId) {
      axiosInstance
        .put(`api/remit/admin/packages/${packageId.split('=')[1]}/`, postData)
        .then((res) => {
          console.log(res.data);
          navigate('/dashboard/manage-models/Packages');
        })
        .catch((error) => {
          console.log(error.response.data.detail);
        });
    } else {
      axiosInstance
        .post('api/remit/admin/packages/', postData)
        .then((res) => {
          console.log(res.data);
          navigate('/dashboard/manage-models/Packages');
        })
        .catch((error) => {
          console.log(error.response.data.detail);
        });
    }
  };

  return (
    <Page title="Manage Card Packages">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <MyFormStyle>
          <Stack spacing={3}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'left', marginBottom: '1rem' }}>
              {packageId ? 'Update' : 'Add'} Package Detail
            </Typography>
            <RHFTextField name="packageOrder" label="Package order" />
            <RHFTextField name="airtimeValue" label="Airtime value in ETB" />
            <RHFTextField name="priceETB" label="Selling price in ETB" />
            <RHFTextField name="discountRate" label="Package discount rate in percent" />
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
              {packageId ? 'Update' : 'Add'} Package
            </LoadingButton>
          </Stack>
        </MyFormStyle>
      </FormProvider>
    </Page>
  );
}
