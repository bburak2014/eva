// src/features/auth/components/LoginForm.tsx
import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { useLoginMutation } from '@/features/auth/api/authApi';
import { toastManager } from '@/shared/utils/toastManager';
import InlineLoading from '@/shared/components/common/loading/InlineLoading';
import { useNavigate } from 'react-router-dom';
import localStorageManager from '@/shared/utils/localStorageManager';
import { LoginValues } from '@/features/auth/types/authTypes';
import { loginFormSchema } from '@/shared/utils/scheme';

const LoginForm: React.FC = () => {
  const [login] = useLoginMutation();
  const navigate = useNavigate();

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

        toastManager.showToast('Login successful!', 'success', 3000);
        localStorageManager.set('email', values.email);
        navigate('/dashboard');

      } else {
        toastManager.showToast('Login failed!', 'error', 3000);
      }
    } catch (err) {
      toastManager.showToast('Login failed!', 'error', 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column */}
      <div className="bg-[#f5f3fb8f] hidden lg:flex justify-center w-full lg:w-[58%] flex-col p-10 gap-10 bg-background">
        <div>
          <img
            src="images/logo.png"
            alt="eva-logo"
            height={60}
            width={60}
            className='absolute top-10 left-10'
          />
        </div>
        <div className="flex flex-col items-center gap-16">
          <img
            src="images/frame.png"
            alt="eva-frame"
            className="hidden xl:block w-1/2 h-1/2 2xl:w-2/3 2xl:h-2/3 object-contain"
          />
          <div className="flex flex-col gap-6">
            <p className="font-bold text-[2rem] leading-primary text-slate-800">
              Elevate Your Online Business with Intelligent Innovation
            </p>
            <p className="font-base text-base leading-secondary text-secondary">
              Harness the power of advanced AI and Amazon-powered insights to transform your online store into a dynamic hub of growth and efficiency. Experience seamless integration, real-time analytics, and personalized strategies that drive remarkable results. Step into a world where cutting-edge technology meets commerce, optimizing every decision for success.

            </p>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex w-full lg:w-[42%] p-10 justify-center bg-white">
        <div className="w-full max-w-lg flex flex-col items-center justify-center gap-8">
          <img
            src="images/logo.png"
            alt="Logo"
            height={60}
            width={60}
            className='block lg:hidden'
          />
          <div className="flex flex-col items-center px-4 gap-4">
            <p className="font-bold text-[2rem] leading-9 text-black text-center">
              Welcome Eva!
            </p>
            <p className="font-base text-sm leading-5 text-slate-400 text-center">
              Manage your e-commerce with AI, watch your company grow.
            </p>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={loginFormSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="w-full flex flex-col gap-4 mt-4">
                {/* Email Field */}
                <div className="flex flex-col gap-2">
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
                    className="w-full px-4 py-3 border rounded-lg bg-slate-100 focus:outline-none focus:border-purple-500 transition"
                    autoComplete="email"
                    aria-label="E-mail Address"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-2">
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
                    className="w-full px-4 py-3 border rounded-lg bg-slate-100 focus:outline-none focus:border-purple-500 transition"
                    autoComplete="current-password"
                    aria-label="Password"

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
                  className="w-full p-3 bg-purple-500 text-sm text-white rounded-lg font-medium text-center flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
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
