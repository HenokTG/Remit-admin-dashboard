import * as Yup from 'yup';
import { useEffect } from 'react';
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

export default function PublishNews() {
  const { loggedIn } = useGlobalContext();
  const navigate = useNavigate();
  const prevLocation = useLocation();

  useEffect(() => {
    if (loggedIn === false) {
      navigate(`/login?redirectTo=${prevLocation.pathname}`);
    }
    // eslint-disable-next-line
  }, []);

  const PackageSchema = Yup.object().shape({
    recieverAgent: Yup.string().required(),
    task: Yup.string().required(),
    notice: Yup.string().required(),
  });

  const defaultValues = {
    recieverAgent: '',
    task: '',
    notice: '',
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
      reciever_agent: formData.recieverAgent,
      task: formData.task,
      notice: formData.notice,
    };
    console.log('Check Values: ', formData, postData);

    axiosInstance
      .post(`api/agent/admin/create-notice/`, postData)
      .then((res) => {
        console.log(res.data);
        navigate('/dashboard');
      })
      .catch((error) => {
        console.log(error.response.data.detail);
      });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ marginInline: '30%' }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'left', marginBottom: '1rem' }}>
          Send notice
        </Typography>
        <RHFTextField name="recieverAgent" label="The agent name the notification for" />
        <RHFTextField name="task" label="Notification title" />
        <RHFTextField name="notice" label="Notification content" multiline rows="4" />
        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Send
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
