// Returns the day name (e.g., "tuesday") from the given date string; returns an empty string if the input is missing or invalid.
export const getDayName = (dateStr?: string | null): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return dayName.charAt(0).toUpperCase() + dayName.slice(1);
  };
  
  
  // Formats a given date string as "dd-mm-yyyy"; returns the original string if the date is invalid, or an empty string if no input is provided.
  export const formatDate = (dateStr?: string | null): string => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  // Calculates the average price by dividing sales by quantity; returns sales as a fixed two-decimal string if quantity is zero or if sales/quantity are missing.
  export const calcAvgPrice = (sales?: number, qty?: number): string => {
    if (sales == null || qty == null) return '0.00';
    if (qty > 0) return (sales / qty).toFixed(2);
    return sales.toFixed(2);
  };
  