import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/store';
import { setCurrentPage } from '@/features/dashboard/slice/dashboardSlice';
import {
  useLazyGetDailySalesSkuListQuery,
  useLazyGetSkuRefundRateQuery,
} from '../api/dashboardApi';
import InlineLoading from '@/shared/components/common/loading/InlineLoading';
import { getDayName, formatDate, calcAvgPrice } from '@/shared/utils/helpers';
import { UserData, SkuDataItem, SkuRefundRateItem } from '../types/dashboardTypes';


const SalesTable: React.FC<UserData> = (props) => {
  const { sellerId, marketplace } = props;
  const dispatch = useDispatch<AppDispatch>();
  const { selectedDates, currentPage } = useSelector((state: RootState) => state.dashboard);
  const [skuData, setSkuData] = useState<SkuDataItem[]>([]);
  const [lastPageFetched, setLastPageFetched] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [triggerSkuList, skuListResult] = useLazyGetDailySalesSkuListQuery();
  const [triggerRefund, refundResult] = useLazyGetSkuRefundRateQuery();

  // İstek parametrelerini oluşturma
  const createParams = (pageNumber: number) => ({
    isDaysCompare: selectedDates.length === 2 ? 1 : 0,
    marketplace,
    pageNumber,
    pageSize: 30,
    salesDate: selectedDates[0],
    salesDate2: selectedDates.length === 2 ? selectedDates[1] : '',
    sellerId
  });

  /** Tabloyu ilk yükleme ve tarih değişimi durumunda yenileme */
  useEffect(() => {
    if (selectedDates.length === 0) {
      setSkuData([]);
      setLastPageFetched(0);
      setHasMore(true);
      dispatch(setCurrentPage(1));
      return;
    }
    setSkuData([]);
    setLastPageFetched(0);
    setHasMore(true);
    dispatch(setCurrentPage(1));

    const params = createParams(1);
    triggerSkuList(params)
      .unwrap()
      .then((res) => {
        const items = res.Data.item.skuList;
        const fetchedCount = items.length;
        const skuCodes = items.map((item: SkuDataItem) => item.sku);
        return triggerRefund({
          marketplace,
          sellerId,
          skuList: skuCodes,
          requestedDay: 0
        })
          .unwrap()
          .then((refundRes) => {
            const refundMap: Record<string, number> = {};
            (refundRes.Data as SkuRefundRateItem[]).forEach(r => {
              refundMap[r.sku] = r.refundRate;
            });
            const combinedItems = items.map(item => ({
              ...item,
              refundRate: refundMap[item.sku] ?? 0
            }));
            setSkuData(combinedItems);
            setLastPageFetched(1);
            if (fetchedCount < 30) {
              setHasMore(false);
            }
          });
      })
      .catch(err => {
        console.error('Error fetching SKU list/refund data', err);
      });
  }, [dispatch, selectedDates, triggerSkuList, triggerRefund, marketplace, sellerId]);

  /** Sayfa değişiminde ek veri yükleme */
  useEffect(() => {
    if (selectedDates.length === 0) return;
    const totalLoadedPages = Math.ceil(skuData.length / 10);
    if (lastPageFetched > 0 && currentPage > totalLoadedPages && hasMore) {
      const nextPageNumber = lastPageFetched + 1;
      const params = createParams(nextPageNumber);
      triggerSkuList(params)
        .unwrap()
        .then(res => {
          const newItems = res.Data.item.skuList;
          const fetchedCount = newItems.length;
          const skuCodes = newItems.map((item: SkuDataItem) => item.sku);
          return triggerRefund({
            marketplace,
            sellerId,
            skuList: skuCodes,
            requestedDay: 0
          })
            .unwrap()
            .then(refundRes => {
              const refundMap: Record<string, number> = {};
              (refundRes.Data as SkuRefundRateItem[]).forEach(r => {
                refundMap[r.sku] = r.refundRate;
              });
              const combinedNewItems = newItems.map(item => ({
                ...item,
                refundRate: refundMap[item.sku] ?? 0
              }));
              setSkuData(prev => [...prev, ...combinedNewItems]);
              setLastPageFetched(nextPageNumber);
              if (fetchedCount < 30) {
                setHasMore(false);
              }
            });
        })
        .catch(err => {
          console.error('Error fetching additional SKU data', err);
        });
    }
  }, [currentPage, selectedDates, skuData.length, lastPageFetched, hasMore, triggerSkuList, triggerRefund, marketplace, sellerId]);

  // Yüklenme ve hata durumları
  const loading = skuListResult.isFetching || refundResult.isFetching;
  const isError = skuListResult.isError || refundResult.isError;

  /** Refund formatlama */
  const formatRefundRate = (rate?: number) => {
    if (rate === undefined || rate === null) return '-';
    return `${(rate * 100).toFixed(2)}%`;
  };

  /** Compare Mode (iki tarih seçili) mi? */
  const compareMode = selectedDates.length === 2;


  // Çok satırlı header oluşturma
  const thead = (
    <thead className="bg-gray-100">
      <tr>
        <th className="px-2 py-2 text-left">SKU</th>
        <th className="px-2 py-2 text-left">Product Name</th>

        {compareMode ? (
          <>
            <th className="px-2 py-2 text-center">
              {/* Tek hücrede çok satır */}
              <div className="font-semibold">{getDayName(selectedDates[0])}</div>
              <div className="text-xs text-gray-600 mb-1">{formatDate(selectedDates[0])}</div>
              <div className="text-sm font-medium">Sales / Unit</div>
              <div className="text-sm font-medium">Avg. Selling Price</div>
            </th>
            <th className="px-2 py-2 text-center">
              <div className="font-semibold">{getDayName(selectedDates[1])}</div>
              <div className="text-xs text-gray-600 mb-1">{formatDate(selectedDates[1])}</div>
              <div className="text-sm font-medium">Sales / Unit</div>
              <div className="text-sm font-medium">Avg. Selling Price</div>
            </th>
            <th className="px-2 py-2 text-right">Diff</th>
          </>
        ) : (
          <th className="px-2 py-2 text-center">
            <div className="font-semibold">{selectedDates[0]}</div>
            <div className="text-xs text-gray-600 mb-1">{formatDate(selectedDates[0])}</div>
            <div className="text-sm font-medium">Sales / Unit</div>
            <div className="text-sm font-medium">Avg. Selling Price</div>
          </th>
        )}

        <th className="px-2 py-2 text-right">Refund Rate</th>
      </tr>
    </thead>
  );

  /** Body Render: her satır ve hücre */
  const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;
  const pageItems = skuData.slice(startIndex, endIndex);

  const tbody = (
    <tbody>
      {pageItems.map((item, idx) => {
        const sales1 = (item.fbaAmount || 0) + (item.fbmAmount || 0);
        const qty1 = (item.qty || 0);
        const avgPrice1 = calcAvgPrice(sales1, qty1);

        const sales2 = (item.fbaAmount2 || 0) + (item.fbmAmount2 || 0);
        const qty2 = (item?.qty2 || 0);
        const avgPrice2 = calcAvgPrice(sales2, qty2);

        const diff = sales2 - sales1;

        return (
          <tr key={idx} className="border-b">
            <td className="px-2 py-1">{item.sku}</td>
            <td className="px-2 py-1">{item.productName}</td>

            {compareMode ? (
              <>
                {/* İlk tarih için sales / unit ve alt satırda avg price */}
                <td className="px-2 py-1 text-right">
                  <div>{sales1.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">{avgPrice1}</div>
                </td>
                {/* İkinci tarih */}
                <td className="px-2 py-1 text-right">
                  <div>{sales2.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">{avgPrice2}</div>
                </td>
                {/* Diff */}
                <td className="px-2 py-1 text-right">
                  {diff ? diff.toFixed(2) : '-'}
                </td>
              </>
            ) : (
              <td className="px-2 py-1 text-right">
                <div>{sales1.toFixed(2)}</div>
                <div className="text-xs text-gray-500">{avgPrice1}</div>
              </td>
            )}

            {/* Refund Rate */}
            <td className="px-2 py-1 text-right">
              {formatRefundRate(item.refundRate)}
            </td>
          </tr>
        );
      })}
    </tbody>
  );

  const handlePageChange = useCallback((newPage: number) => {
    dispatch(setCurrentPage(newPage));
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, [dispatch]);

  return (
    <div className="bg-white p-4 rounded shadow">
      {skuData.length === 0 && !loading ? (
        <p className="text-gray-500">No data available.</p>
      ) : (
        <>
          <table className="w-full text-sm border-collapse">
            {thead}
            {tbody}
          </table>
          <div className="flex justify-end items-center mt-2 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= Math.ceil(skuData.length / 10) && !hasMore}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {loading && (
        <div className="flex justify-center py-4 relative">
          <InlineLoading size={32} />
        </div>
      )}
      {isError && (
        <div className="text-red-500 text-center">Error loading table data. Please try again.</div>
      )}
    </div>
  );
};

export default SalesTable;
