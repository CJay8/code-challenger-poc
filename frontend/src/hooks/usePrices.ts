import { useState, useEffect } from 'react';

export interface TokenPrice {
  currency: string;
  date: string;
  price: number;
}

export interface PriceMap {
  [currency: string]: number;
}

export function usePrices() {
  const [prices, setPrices] = useState<PriceMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://interview.switcheo.com/prices.json');
      
      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }

      const data: TokenPrice[] = await response.json();

      // Create a map to store the latest price for each currency
      const priceMap: PriceMap = {};
      const dateMap: { [currency: string]: Date } = {};

      data.forEach((item) => {
        if (item.price && item.price > 0) {
          const itemDate = new Date(item.date);
          
          // If we don't have this currency yet, or this entry is newer
          if (!dateMap[item.currency] || itemDate > dateMap[item.currency]) {
            priceMap[item.currency] = item.price;
            dateMap[item.currency] = itemDate;
          }
        }
      });

      setPrices(priceMap);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prices');
      console.error('Error fetching prices:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    prices,
    loading,
    error,
    lastUpdated,
    refetch: fetchPrices,
  };
}
