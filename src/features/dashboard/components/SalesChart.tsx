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

interface UserData {
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

const SalesChart: React.FC<UserData> = (props) => {
  const { sellerId, marketplace } = props;
  const dispatch = useDispatch();
  const selectedDay = useSelector((state: RootState) => state.dashboard.selectedDay);

  // API'den veriyi çekiyoruz
  const { data: overviewData, error, isLoading } = useGetDailySalesOverviewQuery({
    customDateData: null,
    day: selectedDay,
    excludeYoYData: true,
    marketplace,
    requestStatus: 0,
    sellerId
  });

  // Yeni response yapısına göre verileri dönüştürüyoruz
  const chartOptions = useMemo(() => {
    // overviewData.Data.item dizisini alıyoruz
    const items = overviewData?.Data?.item || [];

    if (!items.length) {
      return {
        title: { text: '' },
        series: [],
        xAxis: { categories: [] },
        yAxis: { title: { text: 'Sales' } },
        tooltip: { formatter: function () { return 'No data available.'; } }
      };
    }
    
    const categories = items.map((item: any) => item.date);
    const seriesData = items.map((item: any) => ({
      y: item.fbaAmount + item.fbmAmount,
      profit: item.profit,
      fbaAmount: item.fbaAmount,
      fbmAmount: item.fbmAmount,
      fbaShippingAmount: item.fbaShippingAmount,
      category: item.date,
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
      },
      series: [{
        name: 'Sales',
        type: 'column',
        data: seriesData,
      }]
    };
  }, [overviewData, dispatch, selectedDay, marketplace, sellerId]);

  // Gün aralığı seçimi için handler
  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDay = Number(e.target.value);
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
