// src/features/dashboard/pages/DashboardPage.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import SalesChart from '@/features/dashboard/components/SalesChart';
import SalesTable from '@/features/dashboard/components/SalesTable';
import { useGetUserInformationMutation } from '@/features/auth/api/authApi';
import LoadingSpinner from '@/shared/components/common/loading/Loading';
import localStorageManager from '@/shared/utils/localStorageManager';
import { setUser } from '@/features/dashboard/slice/dashboardSlice';
import ErrorFalBackComponent from '@/shared/components/common/error/ErrorFalBack';
import MainLayout from '@/shared/layouts/MainLayout';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
    const selectedDates = useSelector((state: RootState) => state.dashboard.selectedDates);
  const [getUserInformation, { data, error, isLoading }] = useGetUserInformationMutation();
  const email = localStorageManager.get('email') as string | null;

  useEffect(() => {
    if (email) {
      getUserInformation({ email });
    }
  }, [email, getUserInformation]);

  useEffect(() => {
    if (data?.Data?.user) {
      dispatch(setUser(data.Data.user));
    }
  }, [data, dispatch]);

  const sellerId = data?.Data?.user?.store?.[0]?.storeId || '';
  const marketplace = data?.Data?.user?.store?.[0]?.marketplaceName || '';

  const userData = {
    sellerId,
    marketplace
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <ErrorFalBackComponent />
    );
  }


  return (
    <MainLayout>
      {(sellerId && marketplace) &&
        <div className="container mx-auto p-4 flex flex-col gap-10 h-full">
          <SalesChart {...userData} />
          {selectedDates.length > 0 && (
            <div className="">
              <SalesTable {...userData} />
            </div>
          )}
        </div>}
    </MainLayout>
  );
};

export default DashboardPage;
