import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/app/store';
import { setSelectedDay, toggleSelectedDate, resetDashboardState } from '../slice/dashboardSlice';
import { useGetDailySalesOverviewQuery } from '../api/dashboardApi';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface MyTooltipContext {
  x: string | number;
  point: {
    fbaAmount: number;
    fbmAmount: number;
    fbaShippingAmount: number;
    profit: number;
  };
}
interface userData {
  sellerId: string;
  marketplace: string;
}

const getTooltipContent = (x: string | number, point: any) => {
  return `<b>${x}</b><br/>
          Total Sales: ${point.fbaAmount + point.fbmAmount}<br/>
          Shipping: ${point.fbaShippingAmount}<br/>
          Profit: ${point.profit}<br/>
          FBA Sales: ${point.fbaAmount}<br/>
          FBM Sales: ${point.fbmAmount}`;
};


const SalesChart: React.FC<userData> = (props) => {
  const { sellerId, marketplace } = props || null;
  const dispatch = useDispatch();
  const selectedDay = useSelector((state: RootState) => state.dashboard.selectedDay);



  // Fetch daily sales overview data using RTK Query (auto-fetch on selectedDay or other params change)
  const { data: overviewData, error, isLoading } = useGetDailySalesOverviewQuery({
    customDateData: null,
    day: selectedDay,
    excludeYoYData: true,
    marketplace,
    requestStatus: 0,
    sellerId
  });

  // Prepare Highcharts configuration
  const chartOptions = useMemo(() => {
    if (!overviewData || !overviewData.dateList?.length) {
      return <p className="text-gray-500">No chart data available.</p>;
    }
    const categories = overviewData.dateList;
    const seriesData = overviewData.profit.map((_, index) => ({
      y: overviewData.fbaAmount[index] + overviewData.fbmAmount[index],
      profit: overviewData.profit[index],
      fbaAmount: overviewData.fbaAmount[index],
      fbmAmount: overviewData.fbmAmount[index],
      fbaShippingAmount: overviewData.fbaShippingAmount[index],
      category: categories[index],
    }));
    return {
      chart: { type: 'column', backgroundColor: 'transparent' },
      title: { text: '' },
      xAxis: { categories },
      yAxis: { title: { text: 'Sales' } },
      tooltip: {
        formatter: function (this: MyTooltipContext) {
          return getTooltipContent(this.x, this.point);
        }
      },

      plotOptions: {
        series: {
          point: {
            events: {
              click: function (this: Highcharts.Point & { category: any }) {
                dispatch(toggleSelectedDate(this.category));
              }
            }
          }
        }
      }
      ,
      series: [{
        name: 'Sales',
        type: 'column',
        data: seriesData,
      }]
    };
  }, [overviewData, dispatch]);


  // Handler for changing the day range selection
  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDay = Number(e.target.value);
    // Reset any selected dates (clear table selection) when changing range
    dispatch(resetDashboardState());
    dispatch(setSelectedDay(newDay));
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Sales Overview</h2>
        <select
          value={selectedDay}
          onChange={handleDayChange}
          className="border border-gray-300 text-sm rounded px-2 py-1"
          disabled={isLoading}
        >
          <option value={60}>Last 60 days</option>
          <option value={30}>Last 30 days</option>
          <option value={14}>Last 14 days</option>
          <option value={7}>Last 7 days</option>
        </select>
      </div>
      {isLoading ? (
        <p className="text-gray-500">Loading chart...</p>
      ) : error ? (
        <p className="text-red-500">Error loading chart data.</p>
      ) : (
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      )}
    </div>
  );
};

export default SalesChart;
