// dashboard api
export interface DailySalesOverviewParams {
    customDateData: null | string;
    day: number;
    excludeYoYData: boolean;
    marketplace: string;
    requestStatus: number;
    sellerId: string;
}
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
    productName?: string;
    qty2?: number;
    qty?: number;

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

//sales components

export interface UserData {
    sellerId: string;
    marketplace: string;
  }
  
  export interface MyTooltipContext {
    x: string | number;
    points: Array<{
      series: { name: string; color: string };
      point: { y: number };
    }>;
  }

  //slice
  export interface DashboardState {
    selectedDay: number;
    selectedDates: string[];
    currentPage: number;
}
 