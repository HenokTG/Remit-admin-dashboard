import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { Stack, Typography, FormControlLabel, Checkbox } from '@mui/material';
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

export default function AgentUpdateForm() {
  const [active, setActive] = useState(true);

  const { loggedIn, profile } = useGlobalContext();
  const navigate = useNavigate();
  const prevLocation = useLocation();
  const { agentName } = useParams();

  useEffect(() => {
    if (loggedIn === false) {
      navigate(`/login?redirectTo=${prevLocation.pathname}`);
    } else if (profile.is_superuser === false) {
      navigate('/dashboard/');
    }

    // eslint-disable-next-line
  }, [profile]);

  const AgentUpdateSchema = Yup.object().shape({
    commision: Yup.number().required('Agent commision is required'),
  });

  const defaultValues = {
    commision: '',
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
      is_active: active,
      commission: formData.commision / 100,
    };
    console.log('Check Values: ', formData, postData);
    axiosInstance
      .put(`api/agent/profiles/${agentName.split('=')[1]}/`, postData)
      .then((res) => {
        console.log(res.data);
        navigate('/dashboard/agents');
      })
      .catch((error) => {
        console.log(error.response.data.detail);
      });
  };

  return (
    <Page title="Update Agent Status">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <MyFormStyle>
          <Stack spacing={3}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'left', marginBottom: '1rem' }}>
              Update Agent Profile
            </Typography>
            <RHFTextField name="commision" label="Agent commision in percent" />
            <FormControlLabel
              control={<Checkbox defaultChecked onChange={(e) => setActive(e.target.checked)} />}
              label="Activate Agent"
            />
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
              Update
            </LoadingButton>
          </Stack>
        </MyFormStyle>
      </FormProvider>
    </Page>
  );
}
