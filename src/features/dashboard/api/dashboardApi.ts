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
export interface DailySalesOverviewResponse {
  ApiStatus: boolean;
  ApiStatusCode: number;
  ApiStatusMessage: string;
  Data: {
    item: DailySalesOverviewItem[];
    Currency: string;
    isYoyExist: boolean;
  };
}

export interface DailySalesOverviewItem {
  date: string;
  amount: number;
  fbaAmount: number;
  fbmAmount: number;
  orderCount: number;
  fbaOrderCount: number;
  fbmOrderCount: number;
  unitCount: number;
  fbaUnitCount: number;
  fbmUnitCount: number;
  avgSalesPrev30Days: number;
  prevYearDate: number;
  prevYearAmount: number;
  prevYearFbaAmount: number;
  prevYearFbmAmount: number;
  prevYearShippingAmount: number;
  prevYearFbaShippingAmount: number;
  prevYearFbmShippingAmount: number;
  prevYearOrderCount: number;
  prevYearUnitCount: number;
  yoy30DailySalesGrowth: number;
  prevYearAvgSalesPrev30Days: number;
  profit: number;
  cogs: number;
  amazonExpense: number;
  totalExpense: number;
  shippingAmount: number;
  fbaShippingAmount: number;
  fbmShippingAmount: number;
  avgProfitPrev30Days: number;
  avgAdvertisingCostPrev30Days: number;
  advertisingCost: number;
  acos: number;
  refundTotalAmount: number;
  totalVatAmount: number;
  otherFee: number;
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
  ApiStatus: boolean;
  ApiStatusCode: number;
  ApiStatusMessage: string;
  Data: {
    item: {
      selectedDate: string;
      selectedDate2: string;
      totalSale: number;
      totalShippingAmount: number;
      totalSale2: number;
      totalShippingAmount2: number;
      skuList: SkuDataItem[];
    };
    Currency: string;
  };
}


export interface SkuRefundRateParams {
  marketplace: string;
  sellerId: string;
  skuList: string[];
  requestedDay: number;
}

export interface SkuRefundRateItem {
  sku: string;
  refundRate: number;
}
export interface SkuRefundRateResponse {
  ApiStatus: boolean;
  ApiStatusCode: number;
  ApiStatusMessage: string;
  Data: SkuRefundRateItem[];
}

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
