// src/features/dashboard/components/SalesChart.tsx
import React, { useEffect, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/app/store';
import { setSelectedDay, toggleSelectedDate, resetDashboardState } from '@/features/dashboard/slice/dashboardSlice';
import { useGetDailySalesOverviewQuery } from '@/features/dashboard/api/dashboardApi';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { UserData, MyTooltipContext } from '@/features/dashboard/types/dashboardTypes';
import { buildStackedData } from '@/shared/utils/helpers';



const SalesChart: React.FC<UserData> = (props) => {
  const { sellerId, marketplace } = props;
  const dispatch = useDispatch();
  const selectedDay = useSelector((state: RootState) => state.dashboard.selectedDay);
  const selectedDates = useSelector((state: RootState) => state.dashboard.selectedDates);
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  const { data: overviewData, error, isLoading } = useGetDailySalesOverviewQuery({
    customDateData: null,
    day: selectedDay,
    excludeYoYData: true,
    marketplace,
    requestStatus: 0,
    sellerId
  });

  useEffect(() => {
    if (chartComponentRef.current) {
      const chart = chartComponentRef.current.chart;
      if (isLoading) {
        chart.showLoading('Loading...');
      } else {
        chart.hideLoading();
      }
    }
  }, [isLoading]);

  const chartOptions = useMemo(() => {
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

    const shippingMap = items.reduce((acc: Record<string, number>, item: any) => {
      acc[item.date] = (item.fbaShippingAmount || 0) + (item.fbmShippingAmount || 0);
      return acc;
    }, {});

    const profitData = buildStackedData(
      items,
      'profit',
      '#5edcbf',
      ['#5dd17e', '#4bbb5d'],
      selectedDates
    );

    const fbaData = buildStackedData(
      items,
      'fbaAmount',
      '#B8A1FB',
      ['#f77b07', '#f70a1e'],
      selectedDates
    );

    const fbmData = buildStackedData(
      items,
      'fbmAmount',
      '#7A6AFB',
      ['#5707f7', '#0733f7'],
      selectedDates
    );

    return {
      chart: { type: 'column', backgroundColor: 'transparent' },
      title: { text: '' },
      xAxis: { categories, crosshair: true },
      yAxis: {
        min: 0,
        title: { text: 'Sales' }
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom'
      },
      tooltip: {
        useHTML: true,
        shared: true,
        formatter: function (this: MyTooltipContext) {
          let fba = 0, fbm = 0, profit = 0;
          this.points.forEach(point => {
            if (point.series.name === 'FBA Sales') {
              fba = point.point.y;
            } else if (point.series.name === 'FBM Sales') {
              fbm = point.point.y;
            } else if (point.series.name === 'Profit') {
              profit = point.point.y;
            }
          });
          const totalSales = fba + fbm;
          const shipping = shippingMap[this.x] || 0;

          return `
            <div class="p-2 text-sm text-gray-800">
              <div class="font-bold mb-1">${this.x}</div>
              <div class="flex justify-between">
                <span>Total Sales:</span>
                <span class="font-semibold">$${totalSales}</span>
              </div>
              <div class="flex justify-between">
                <span>Shipping:</span>
                <span class="font-semibold">$${shipping}</span>
              </div>
              <div class="flex justify-between">
                <span>Profit:</span>
                <span class="font-semibold">$${profit}</span>
              </div>
              <div class="flex justify-between">
                <span>FBA Sales:</span>
                <span class="font-semibold">$${fba}</span>
              </div>
              <div class="flex justify-between">
                <span>FBM Sales:</span>
                <span class="font-semibold">$${fbm}</span>
              </div>
            </div>
          `;
        }
      },
      plotOptions: {
        column: { stacking: 'normal' },
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
      series: [
        {
          name: 'Profit',
          data: profitData,
          stack: 'sales',
          color: '#5edcbf'
        },
        {
          name: 'FBA Sales',
          data: fbaData,
          stack: 'sales',
          color: '#B8A1FB'
        },
        {
          name: 'FBM Sales',
          data: fbmData,
          stack: 'sales',
          color: '#7A6AFB'
        }
      ]
    };
  }, [overviewData, selectedDates, dispatch, selectedDay, marketplace, sellerId]);

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDay = Number(e.target.value);
    dispatch(resetDashboardState());
    dispatch(setSelectedDay(newDay));
  };

  return (
    <div className="bg-white p-4 rounded shadow min-h-60 w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Daily Sales</h2>
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
      {error ? (
        <p className="text-red-500">Error loading chart data.</p>
      ) : (
        <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chartComponentRef} />
      )}
    </div>
  );
};

export default SalesChart;
