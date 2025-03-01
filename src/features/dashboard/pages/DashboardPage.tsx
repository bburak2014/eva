import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import SalesChart from '../components/SalesChart';
import SalesTable from '../components/SalesTable';

const DashboardPage: React.FC = () => {
  // Access selected dates from Redux to determine if table should be shown
  const selectedDates = useSelector((state: RootState) => state.dashboard.selectedDates);

  return (
    <div className="container mx-auto p-4">
      {/* Sales chart section */}
      <SalesChart />
      
      {/* Sales table section (visible only when a date is selected by clicking a chart column) */}
      {selectedDates.length > 0 && (
        <div className="mt-8">
          <SalesTable />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
