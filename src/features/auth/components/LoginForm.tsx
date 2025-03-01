import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useLoginMutation } from '@/features/auth/api/authApi';
import { toastManager } from '@/shared/utils/toastManager';
import InlineLoading from '@/shared/components/common/loading/InlineLoading';


interface LoginValues {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [login] = useLoginMutation();

  // Yup validasyon şeması
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Geçerli bir email girin')
      .required('Email zorunludur'),
    password: Yup.string().required('Şifre zorunludur'),
  });

  const initialValues: LoginValues = {
    email: 'homework@eva.guru',
    password: 'Homeworkeva1**',
  };

  const handleSubmit = async (
    values: LoginValues,
    { setSubmitting }: FormikHelpers<LoginValues>
  ) => {
    try {
      const result = await login(values).unwrap();
      if (result.ApiStatus && result.ApiStatusCode === 200) {
        toastManager.showToast('Giriş Başarılı!', 'success', 3000);
      } else {
        toastManager.showToast('Giriş Başarısız!', 'error', 3000);
      }
    } catch (err) {
      toastManager.showToast('Giriş Başarısız!', 'error', 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">

      {/* left Column */}
      <div className="hidden lg:flex w-full h-full  lg:w-[58%] flex-col p-10 gap-10 bg-background">

        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-800">Birdoo Logo</h2>
        </div>

        <div className="flex items-center flex-col gap-16">

          <img
            src="/images/Frame.png"
            alt="Frame"
            className="w-[300px] h-[300px] object-contain"
          />

          <div className="flex flex-col gap-6">
            <p className="font-bold text-[2rem] leading-primary text-slate-800">
              Let Free Your Creativity with Our Intuitive Content Creator
            </p>
            <p className="font-base text-base leading-secondary text-secondary">
              No design degree is required! Effortlessly craft and design
              stunning and captivating content using our user-friendly
              creative editor. With our drag-and-drop technology, anyone can
              create amazing marketing materials in.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex w-full h-full min-h-screen lg:w-[42%] p-10 justify-center bg-white">
        <div className="w-full gap-8 flex flex-col max-w-lg relative items-center justify-center">
          <div className="flex flex-col items-center px-4 gap-4">
            <p className="font-bold text-[2rem] leading-9 text-black text-center">
              Welcome Eva!
            </p>
            <p className="font-base text-sm leading-5 text-slate-400 text-center">
              Manage your e-commerce with ai, watch your company grow.
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-4 mt-4 w-full">
                {/* Email */}
                <div className="flex flex-col gap-2 mb-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-slate-800 leading-5"
                  >
                    E-mail Address*
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter your e-mail address"
                    className="w-full px-4 py-3 border rounded-lg bg-slate-100 focus:outline-none focus:border-green"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2 mb-3">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-800 leading-5"
                  >
                    Password*
                  </label>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border rounded-lg bg-slate-100 focus:outline-none focus:border-green"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full p-3 bg-green-600 text-sm text-white rounded-lg font-medium text-center flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting && (
                    <InlineLoading
                      size={20}
                      color="text-white"
                      className="mr-2"
                    />
                  )}
                  {isSubmitting ? 'Loading...' : 'Login'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
