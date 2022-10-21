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
    newsTitle: Yup.string().required(),
    newsContent: Yup.string().required(),
  });

  const defaultValues = {
    newsTitle: '',
    newsContent: '',
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
      news_title: formData.newsTitle,
      news_content: formData.newsContent,
    };
    console.log('Check Values: ', formData, postData);

    axiosInstance
      .post(`api/agent/admin/create-news/`, postData)
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
          Publish news
        </Typography>
        <RHFTextField name="newsTitle" label="News headline" />
        <RHFTextField name="newsContent" label="News content" multiline rows="4" />
        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Publish
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
