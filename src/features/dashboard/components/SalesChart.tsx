import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/app/store';
import { setSelectedDay, toggleSelectedDate, resetDashboardState } from '../slice/dashboardSlice';
import { useGetDailySalesOverviewQuery } from '../api/dashboardApi';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface UserData {
  sellerId: string;
  marketplace: string;
}

interface MyTooltipContext {
  x: string | number;
  points: Array<{
    series: { name: string; color: string };
    y: number;
  }>;
}

/**
 * items: API'den gelen veri listesi (ör. overviewData.Data.item)
 * valueKey: item üzerinde alacağımız alan adı (ör. "fbaAmount", "fbmAmount", "profit")
 * defaultColor: normal durumda sütunun rengi
 * highlightColors: [ilkKolonRengi, ikinciKolonRengi]
 * selectedDates: Redux'ta tutulan en fazla 2 tarih (["2025-02-01", "2025-02-02"])
 */
function buildStackedData(
  items: any[],
  valueKey: string,
  defaultColor: string,
  highlightColors: [string, string],
  selectedDates: string[]
) {
  return items.map((item: any) => {
    // selectedDates içinde bu item's date'i arıyoruz
    const indexInSelected = selectedDates.indexOf(item.date);

    // Varsayılan renk
    let color = defaultColor;
    // Eğer bu tarih selectedDates'in ilk elemanıysa highlightColors[0] 
    if (indexInSelected === 0) {
      color = highlightColors[0];
    }
    // Eğer bu tarih selectedDates'in ikinci elemanıysa highlightColors[1]
    else if (indexInSelected === 1) {
      color = highlightColors[1];
    }

    return {
      y: item[valueKey] || 0,
      color,
      category: item.date
    };
  });
}

const SalesChart: React.FC<UserData> = (props) => {
  const { sellerId, marketplace } = props;
  const dispatch = useDispatch();
  const selectedDay = useSelector((state: RootState) => state.dashboard.selectedDay);
  const selectedDates = useSelector((state: RootState) => state.dashboard.selectedDates);

  const { data: overviewData, error, isLoading } = useGetDailySalesOverviewQuery({
    customDateData: null,
    day: selectedDay,
    excludeYoYData: true,
    marketplace,
    requestStatus: 0,
    sellerId
  });

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

    // 1. Profit için veriler
    const profitData = buildStackedData(
      items,
      'profit',
      '#5edcbf',               // Normal durum rengi
      ['#5dd17e', '#4bbb5d'], // [ilkKolonRengi, ikinciKolonRengi] (örnek)
      selectedDates
    );

    // 2. FBA Sales
    const fbaData = buildStackedData(
      items,
      'fbaAmount',
      '#B8A1FB',
      ['#f77b07', '#f70a1e'],
      selectedDates
    );

    // 3. FBM Sales
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
        shared: true,
        formatter: function (this: MyTooltipContext) {
          let s = ``;
          let totalSales = 0;
          let profit = 0;
          let fba = 0;
          let fbm = 0;
          let shipping = 0;

          totalSales = fba + fbm;
          s += `<br/><b>Total Sales:</b> ${totalSales}<br/>`;
          s += `<b>Shipping:</b> ${shipping}<br/>`;
          s += `<b>Profit:</b> ${profit}<br/>`;
          s += `<b>FBA Sales:</b> ${fba}<br/>`;
          s += `<b>FBM Sales:</b> ${fbm}<br/>`;
          return s;
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
          data: fbmData,       // buildStackedData'dan gelen { y, color } objeleri
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
    <div className="bg-white p-4 rounded shadow">
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
