import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { Stack, Typography, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFTextField } from '../../components/hook-form';
import Page from '../../components/Page';
// context and modules
import { axiosInstance } from '../../axios';
import { useGlobalContext } from '../../context';
import { fetchAgentsNames } from '../../_fetchData/agentList';

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

export default function PublishNews() {
  const { loggedIn, profile } = useGlobalContext();
  const navigate = useNavigate();
  const prevLocation = useLocation();

  const [agentNameList, setAgentNameList] = useState([]);

  useEffect(() => {
    if (loggedIn === false) {
      navigate(`/login?redirectTo=${prevLocation.pathname}`);
    }

    if (profile.is_superuser === false) {
      navigate('/dashboard/');
    }

    fetchAgentsNames(setAgentNameList);

    // eslint-disable-next-line
  }, [profile]);

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
    <Page title="Send Notifications">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <MyFormStyle>
          <Stack spacing={3}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'left', marginBottom: '1rem' }}>
              Send notice
            </Typography>
            <RHFTextField select name="recieverAgent" label="The agent name the notification for">
              {agentNameList.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </RHFTextField>
            <RHFTextField name="task" label="Notification title" />
            <RHFTextField name="notice" label="Notification content" multiline rows="4" />
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
              Send
            </LoadingButton>
          </Stack>
        </MyFormStyle>
      </FormProvider>
    </Page>
  );
}
