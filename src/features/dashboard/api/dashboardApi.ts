import { createApi } from '@reduxjs/toolkit/query/react';
import {baseQueryWithReauth} from '@/shared/api/baseQueryWithReauth';

// Define request/response data types for the API endpoints
export interface DailySalesOverviewParams {
  customDateData: null | string;
  day: number;
  excludeYoYData: boolean;
  marketplace: string;
  requestStatus: number;
  sellerId: string;
}
// src/features/dashboard/api/dashboardApi.ts
interface DailySalesOverviewResponse {
  dateList: string[];
  profit: number[];
  fbaAmount: number[];
  fbmAmount: number[];
  fbaShippingAmount: number[]; 
}

export interface SkuDataItem {
  sku: string;
  profit: number;
  fbaAmount: number;
  fbmAmount: number;
  profit2?: number;
  fbaAmount2?: number;
  fbmAmount2?: number;
  refundRate?: number; 

}

export interface DailySalesSkuListParams {
  isDaysCompare: number;   
  marketplace: string;
  pageNumber: number;
  pageSize: number;
  salesDate: string;
  salesDate2: string;
  sellerId: string;
}
export interface DailySalesSkuListResponse {
  skuList: SkuDataItem[];   
}

export interface SkuRefundRateParams {
  skuList: string[];      
}
export interface SkuRefundRateItem {
  sku: string;
  refundRate: number;
}
export type SkuRefundRateResponse = SkuRefundRateItem[];

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
        data: params
      })
    }),
    // Endpoint: get daily sales SKU list for table (single day or comparison)
    getDailySalesSkuList: builder.query<DailySalesSkuListResponse, DailySalesSkuListParams>({
      query: (params) => ({
        url: 'data/daily-sales-sku-list',
        method: 'POST',
        data: params
      })
    }),
    // Endpoint: get refund rates for a list of SKUs
    getSkuRefundRate: builder.query<SkuRefundRateResponse, SkuRefundRateParams>({
      query: (params) => ({
        url: 'data/get-sku-refund-rate',
        method: 'POST',
        data: params
      })
    })
  })
});

// Export hooks for usage in components
export const {
  useGetDailySalesOverviewQuery,
  useGetDailySalesSkuListQuery,
  useGetSkuRefundRateQuery,
  useLazyGetDailySalesSkuListQuery,
  useLazyGetSkuRefundRateQuery
} = dashboardApi;
