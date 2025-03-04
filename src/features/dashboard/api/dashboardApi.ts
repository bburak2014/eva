import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQueryWithReauth';
import { DailySalesOverviewParams, DailySalesOverviewResponse, DailySalesSkuListParams, DailySalesSkuListResponse, SkuRefundRateParams, SkuRefundRateResponse } from '@/features/dashboard/types/dashboardTypes';


// Create RTK Query API slice for dashboard-related endpoints
export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Endpoint: get daily sales overview data for chart
    getDailySalesOverview: builder.query<DailySalesOverviewResponse, DailySalesOverviewParams>({
      query: (params) => ({
        url: 'data/daily-sales-overview',
        method: 'POST',
        body: params
      })
    }),
    // Endpoint: get daily sales SKU list for table (single day or comparison)
    getDailySalesSkuList: builder.query<DailySalesSkuListResponse, DailySalesSkuListParams>({
      query: (params) => ({
        url: 'data/daily-sales-sku-list',
        method: 'POST',
        body: params
      })
    }),
    // Endpoint: get refund rates for a list of SKUs
    getSkuRefundRate: builder.query<SkuRefundRateResponse, SkuRefundRateParams>({
      query: (params) => ({
        url: 'data/get-sku-refund-rate',
        method: 'POST',
        body: params
      })
    })
  })
});

// Export hooks for usage in components
export const {
  useGetDailySalesOverviewQuery,
  useLazyGetDailySalesSkuListQuery,
  useLazyGetSkuRefundRateQuery
} = dashboardApi;
