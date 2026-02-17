import { useState, useEffect, useCallback } from 'react';
import { PriceMap } from './usePrices';

const SWAP_FEE_PERCENT = 0.3;

export interface SwapCalculation {
  fromAmount: string;
  toAmount: string;
  fromUSD: number;
  toUSD: number;
  exchangeRate: string;
  fee: number;
  feeUSD: number;
}

export function useSwapCalculation(
  fromCurrency: string,
  toCurrency: string,
  prices: PriceMap
) {
  const [fromAmount, setFromAmount] = useState('0');
  const [calculation, setCalculation] = useState<SwapCalculation>({
    fromAmount: '0',
    toAmount: '0',
    fromUSD: 0,
    toUSD: 0,
    exchangeRate: '0',
    fee: 0,
    feeUSD: 0,
  });

  const calculate = useCallback(
    (amount: string) => {
      const numAmount = parseFloat(amount) || 0;
      
      if (numAmount <= 0 || !prices[fromCurrency] || !prices[toCurrency]) {
        setCalculation({
          fromAmount: amount,
          toAmount: '0',
          fromUSD: 0,
          toUSD: 0,
          exchangeRate: '0',
          fee: 0,
          feeUSD: 0,
        });
        return;
      }

      const fromPrice = prices[fromCurrency];
      const toPrice = prices[toCurrency];

      // Calculate USD value of input
      const usdValue = numAmount * fromPrice;

      // Calculate fee
      const feeAmount = (usdValue * SWAP_FEE_PERCENT) / 100;
      const usdAfterFee = usdValue - feeAmount;

      // Calculate output amount
      const toAmount = usdAfterFee / toPrice;

      // Calculate exchange rate (1 FROM = X TO)
      const rate = (fromPrice * (1 - SWAP_FEE_PERCENT / 100)) / toPrice;

      setCalculation({
        fromAmount: amount,
        toAmount: toAmount.toFixed(6),
        fromUSD: usdValue,
        toUSD: usdAfterFee,
        exchangeRate: rate.toFixed(6),
        fee: (numAmount * SWAP_FEE_PERCENT) / 100,
        feeUSD: feeAmount,
      });
    },
    [fromCurrency, toCurrency, prices]
  );

  useEffect(() => {
    calculate(fromAmount);
  }, [fromAmount, fromCurrency, toCurrency, prices, calculate]);

  const updateFromAmount = (amount: string) => {
    // Validate input
    if (amount === '' || amount === '.') {
      setFromAmount(amount);
      return;
    }

    // Allow only numbers and one decimal point
    if (!/^\d*\.?\d*$/.test(amount)) {
      return;
    }

    // Limit decimal places to 6
    const parts = amount.split('.');
    if (parts[1] && parts[1].length > 6) {
      return;
    }

    setFromAmount(amount);
  };

  return {
    fromAmount,
    calculation,
    updateFromAmount,
    setFromAmount,
  };
}
