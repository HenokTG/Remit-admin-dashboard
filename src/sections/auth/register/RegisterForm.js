import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
// context and modules
import { axiosInstance } from '../../../axios';
import { useGlobalContext } from '../../../context';
// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    agentName: Yup.string().required('Agent name is required'),
    phone: Yup.number().required(),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    password2: Yup.string().required('Confirm password should be same as Password'),
  });

  const defaultValues = {
    agentName: '',
    email: '',
    phone: '',
    password: '',
    password2: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
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
      password: formData.password,
      Confirm_Password: formData.password2,
    };
    console.log('Check Values: ', formData, postData);
    axiosInstance
      .post(`api/agent/register/`, postData)
      .then((res) => {
        console.log(res.data);
        navigate('/login');
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="agentName" label="Agent name" />
        <RHFTextField name="email" label="Email address" />
        <RHFTextField
          name="phone"
          label="Phone number"
          InputProps={{
            startAdornment: <InputAdornment position="start">+251</InputAdornment>,
          }}
        />

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

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Register
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
