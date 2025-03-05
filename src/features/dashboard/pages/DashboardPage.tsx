// src/features/dashboard/pages/DashboardPage.tsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import SalesChart from '@/features/dashboard/components/SalesChart';
import SalesTable from '@/features/dashboard/components/SalesTable';
import { useGetUserInformationMutation } from '@/features/auth/api/authApi';
import LoadingSpinner from '@/shared/components/common/loading/Loading';
import localStorageManager from '@/shared/utils/localStorageManager';

const DashboardPage: React.FC = () => {
  // Access selected dates from Redux to determine if table should be shown
  const selectedDates = useSelector((state: RootState) => state.dashboard.selectedDates);
  const [getUserInformation, { data, error, isLoading }] = useGetUserInformationMutation();
  const email = localStorageManager.get('email') as string | null;

  useEffect(() => {
    if (email) {
      getUserInformation({ email });
    }
  }, [email, getUserInformation]);

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
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 text-2xl">Error: An error occurred.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 border border-solid border-purple-500 text-purple-500 rounded cursor-pointer hover:bg-purple-500 hover:text-white"
        >
          Retry
        </button>
      </div>
    );
  }


  return (
    <>
      {(sellerId && marketplace) &&
        <div className="container mx-auto p-4 flex flex-col gap-10 h-full">
          <SalesChart {...userData} />
          {selectedDates.length > 0 && (
            <div className="">
              <SalesTable {...userData} />
            </div>
          )}
        </div>}
    </>
  );
};

export default DashboardPage;
