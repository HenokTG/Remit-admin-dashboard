import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { Stack, IconButton, InputAdornment, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../components/Iconify';
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

export default function AgentAddForm() {
  const { loggedIn, profile } = useGlobalContext();
  const navigate = useNavigate();
  const prevLocation = useLocation();

  useEffect(() => {
    if (loggedIn === false) {
      navigate(`/login?redirectTo=${prevLocation.pathname}`);
    }

    if (profile.is_superuser === false) {
      navigate('/dashboard/');
    }

    // eslint-disable-next-line
  }, [profile]);

  const [showPassword, setShowPassword] = useState(false);
  const [active, setActive] = useState(true);

  const AgentSchema = Yup.object().shape({
    agentName: Yup.string().required('Agent name is required'),
    phone: Yup.number().required(),
    commision: Yup.number().required('Agent commision is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    password2: Yup.string().required('Confirm password should be same as Password'),
  });

  const defaultValues = {
    agentName: '',
    email: '',
    phone: '',
    commision: '',
    password: '',
    password2: '',
  };

  const methods = useForm({
    resolver: yupResolver(AgentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    const formData = methods.getValues();
    const postData = {
      agent_name: formData.agentName,
      email: formData.email,
      phone: formData.phone,
      is_active: active,
      commission: formData.commision / 100,
      password: formData.password,
      Confirm_Password: formData.password2,
    };
    console.log('Check Values: ', formData, postData);
    axiosInstance
      .post(`api/agent/register/`, postData)
      .then((res) => {
        console.log(res.data);
        navigate('/dashboard/agents');
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  return (
    <Page title="Create Agent">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <MyFormStyle>
          <Stack spacing={3}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'left', marginBottom: '1rem' }}>
              Add Agent
            </Typography>
            <RHFTextField name="agentName" label="Agent name" />
            <RHFTextField name="email" label="Email address" />
            <RHFTextField
              name="phone"
              label="Phone number"
              InputProps={{
                startAdornment: <InputAdornment position="start">+251</InputAdornment>,
                step: '0.01',
              }}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField sx={{ width: '50%' }} name="commision" label="Agent commision in percent" />
              <FormControlLabel
                control={<Checkbox defaultChecked onChange={(e) => setActive(e.target.checked)} />}
                label="Activate Agent"
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <RHFTextField
                name="password2"
                label="Confirm password"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
              Add Agent
            </LoadingButton>
          </Stack>
        </MyFormStyle>
      </FormProvider>
    </Page>
  );
}
