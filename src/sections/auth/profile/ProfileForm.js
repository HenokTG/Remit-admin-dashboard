import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Button, Typography, InputAdornment, Divider, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
// context and modules
import { axiosInstance } from '../../../axios';
import { useGlobalContext } from '../../../context';
// ----------------------------------------------------------------------

export default function ProfileForm() {
  const navigate = useNavigate();
  const { profilePk, setProfilePk } = useGlobalContext();
  const [uploadPhoto, setUploadPhoto] = useState(null);

  const UpdateSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    phone: Yup.number().required(),
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    businessName: Yup.string(),
    region: Yup.string(),
    zone: Yup.string(),
    woreda: Yup.string(),
    street: Yup.string(),
    description: Yup.string().required('Write brief description about the business'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    region: '',
    zone: '',
    woreda: '',
    street: '',
    description: '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateSchema),
    defaultValues,
  });

  const validatePhoto = (e) => {
    const file = e.target.files[0];
    console.log('File Size:', file.size, file?.size / 1024, 'KB');
    if (file.size < 2 * 1024 * 1024) {
      setUploadPhoto(file);
    }
  };

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    const formData = methods.getValues();
    const postData = new FormData();
    postData.append('first_name', formData.firstName);
    postData.append('last_name', formData.lastName);
    postData.append('email', formData.email);
    postData.append('phone', formData.phone);
    postData.append('business_name', formData.businessName);
    postData.append('region', formData.region);
    postData.append('zone', formData.zone);
    postData.append('woreda', formData.woreda);
    postData.append('street', formData.street);
    postData.append('description', formData.description);
    postData.append('image', uploadPhoto);

    axiosInstance
      .put(`api/agent/profiles/${profilePk}/`, postData, config)
      .then((res) => {
        console.log(res);
        console.log(res.data);
        navigate('/dashboard/agent-profile', { replace: true });
        setProfilePk();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        <RHFTextField name="email" label="Email address" />
        <RHFTextField
          name="phone"
          label="Phone number"
          InputProps={{
            startAdornment: <InputAdornment position="start">+251</InputAdornment>,
          }}
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="First name" />
          <RHFTextField name="lastName" label="Last name" />
        </Stack>
        <RHFTextField name="businessName" label="Business name" />
        <Button variant="outlined" component="label">
          <h3>Upload Profile Image</h3>
          <input type="file" name="image" required accept=".png, .jpg, .jpeg" onChange={validatePhoto} />
        </Button>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Typography variant="h6" gutterBottom>
          Agent Location
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="region" label="Region" />
          <RHFTextField name="zone" label="Zone" />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="woreda" label="Woreda" />
          <RHFTextField name="street" label="Street" />
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <RHFTextField name="description" label="Write brief description about your business..." multiline rows="4" />
        <Divider sx={{ borderStyle: 'dashed' }} />
        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Update Profile
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
