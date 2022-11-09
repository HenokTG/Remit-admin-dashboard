import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
// context and modules
import { axiosInstance } from '../../../axios';
import { useGlobalContext } from '../../../context';
// ----------------------------------------------------------------------
const queryString = require('query-string');

export default function LoginForm() {
  const { setLoggedIn, setProfilePk } = useGlobalContext();
  const navigate = useNavigate();
  const nextLocation = useLocation();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    agentName: Yup.string().required('Agent name is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    agentName: '',
    password: '',
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    const { redirectTo } = queryString.parse(nextLocation.search);
    const formData = methods.getValues();
    const postData = {
      agent_name: formData.agentName,
      password: formData.password,
    };
    axiosInstance
      .post(`api/token/`, postData)
      .then((res) => {
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        axiosInstance.defaults.headers.Authorization = `JWT ${localStorage.getItem('access_token')}`;
        setLoggedIn(true);
        setProfilePk(postData.agent_name);
        navigate(!redirectTo ? '/dashboard' : redirectTo, { replace: true });
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="agentName" label="Agent name" />
        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            autoComplete: 'true',
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        Login
      </LoadingButton>
    </FormProvider>
  );
}
