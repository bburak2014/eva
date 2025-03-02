import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import SalesChart from '../components/SalesChart';
import SalesTable from '../components/SalesTable';
import { useGetUserInformationQuery } from '@/features/auth/api/authApi';
import LoadingSpinner from '@/shared/components/common/loading/Loading';

const DashboardPage: React.FC = () => {
  // Access selected dates from Redux to determine if table should be shown
  const selectedDates = useSelector((state: RootState) => state.dashboard.selectedDates);
  const { data, isLoading, error } = useGetUserInformationQuery();
  const sellerId = data?.storeId || '';
  const marketplace = data?.marketplaceName || '';

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
    <div className="container mx-auto p-4">
      <SalesChart {...userData} />

      {selectedDates.length > 0 && (
        <div className="mt-8">
          <SalesTable {...userData} />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
