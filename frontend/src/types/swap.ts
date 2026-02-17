export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  logoURI?: string;
  balance?: string;
}

export interface PriceData {
  pair: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  timestamp: number;
}

export interface OrderBookLevel {
  price: number;
  amount: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  spread: number;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  price: number;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  txHash?: string;
}

export interface SwapParams {
  fromToken: string;
  toToken: string;
  amount: string;
  slippage: number;
}

export interface SwapQuote {
  fromAmount: string;
  toAmount: string;
  price: number;
  priceImpact: number;
  gasEstimate: string;
  route: string[];
}

export interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
