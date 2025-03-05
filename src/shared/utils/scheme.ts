import * as Yup from 'yup';

export  const loginFormSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email')
      .required('Email required'),
    password: Yup.string().required('Password required'),
  });