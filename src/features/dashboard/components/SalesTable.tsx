import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/store';
import { setCurrentPage } from '../slice/dashboardSlice';
import {
  useLazyGetDailySalesSkuListQuery,
  useLazyGetSkuRefundRateQuery,
  SkuDataItem,
  SkuRefundRateItem
} from '../api/dashboardApi';
import InlineLoading from '@/shared/components/common/loading/InlineLoading';

interface UserData {
  sellerId: string;
  marketplace: string;
}

const SalesTable: React.FC<UserData> = (props) => {
  const { sellerId, marketplace } = props;
  const dispatch = useDispatch<AppDispatch>();
  const { selectedDates, currentPage } = useSelector((state: RootState) => state.dashboard);
  const [skuData, setSkuData] = useState<SkuDataItem[]>([]);
  const [lastPageFetched, setLastPageFetched] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [triggerSkuList, skuListResult] = useLazyGetDailySalesSkuListQuery();
  const [triggerRefund, refundResult] = useLazyGetSkuRefundRateQuery();

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

    const params = {
      isDaysCompare: selectedDates.length === 2 ? 1 : 0,
      marketplace,
      pageNumber: 1,
      pageSize: 30,
      salesDate: selectedDates[0],
      salesDate2: selectedDates.length === 2 ? selectedDates[1] : "",
      sellerId
    };

    triggerSkuList(params)
      .unwrap()
      .then((res) => {
        // API yanıtındaki skuList "res.Data.item.skuList" içinde yer alıyor.
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
            // Refund servisi yanıtı "refundRes.Data" dizisi şeklinde geliyor.
            const refundItems = refundRes.Data as SkuRefundRateItem[];
            const refundMap: Record<string, number> = {};
            refundItems.forEach(r => {
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

  useEffect(() => {
    if (selectedDates.length === 0) return;
    const totalLoadedPages = Math.ceil(skuData.length / 10);
    if (lastPageFetched > 0 && currentPage > totalLoadedPages && hasMore) {
      const nextPageNumber = lastPageFetched + 1;
      const params = {
        isDaysCompare: selectedDates.length === 2 ? 1 : 0,
        marketplace,
        pageNumber: nextPageNumber,
        pageSize: 30,
        salesDate: selectedDates[0],
        salesDate2: selectedDates.length === 2 ? selectedDates[1] : "",
        sellerId
      };
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
              const refundItems = refundRes.Data as SkuRefundRateItem[];
              const refundMap: Record<string, number> = {};
              refundItems.forEach(r => {
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

  const loading = skuListResult.isFetching || refundResult.isFetching;
  const isError = skuListResult.isError || refundResult.isError;

  const formatRefundRate = (rate?: number) => {
    if (rate === undefined || rate === null) return '-';
    return `${(rate * 100).toFixed(2)}%`;
  };

  const startIndex = (currentPage - 1) * 10;
  const pageItems = skuData.slice(startIndex, startIndex + 10);

  const compareMode = selectedDates.length === 2;
  const headers = compareMode
    ? ['SKU', `${selectedDates[0]} Sales`, `${selectedDates[1]} Sales`, 'Diff', 'Refund Rate']
    : ['SKU', 'Sales', 'Refund Rate'];

  const handlePageChange = useCallback((newPage: number) => {
    dispatch(setCurrentPage(newPage));
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, [dispatch]);

  return (
    <div className="bg-white p-4 rounded shadow">
      {loading ? (
        <div className="flex justify-center py-4 relative">
          <InlineLoading size={32} />
        </div>
      ) : isError ? (
        <div className="text-red-500 text-center">Error loading table data. Please try again.</div>
      ) : skuData.length === 0 ? (
        <p className="text-gray-500">No data available.</p>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              {headers.map(col => (
                <th key={col} className="px-2 py-1 text-left">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageItems.map((item: SkuDataItem, idx: number) => (
              <tr key={idx} className="border-b">
                <td className="px-2 py-1">{item.sku}</td>
                {compareMode ? (
                  <>
                    <td className="px-2 py-1 text-right">${item.fbaAmount + item.fbmAmount}</td>
                    <td className="px-2 py-1 text-right">
                      {item.fbaAmount2 && item.fbmAmount2 ? (item.fbaAmount2 + item.fbmAmount2) : '-'}
                    </td>
                    <td className="px-2 py-1 text-right">
                      {item.fbaAmount2 && item.fbmAmount2
                        ? `$${(item.fbaAmount2 + item.fbmAmount2) - (item.fbaAmount + item.fbmAmount)}`
                        : '-'}
                    </td>
                  </>
                ) : (
                  <td className="px-2 py-1 text-right">${item.fbaAmount + item.fbmAmount}</td>
                )}
                <td className="px-2 py-1 text-right">
                  {formatRefundRate(item.refundRate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {skuData.length > 0 && (
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
      )}
    </div>
  );
};

export default SalesTable;
