import { Token } from '@/types/swap';

export const POPULAR_TOKENS: Token[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
    balance: '2.5431'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    balance: '10250.00'
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    balance: '5000.00'
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    balance: '0.0856'
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    balance: '8420.50'
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    decimals: 18,
    address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    balance: '125.00'
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    decimals: 18,
    address: '0x514910771af9ca656af840dff83e8264ecf986ca',
    balance: '450.00'
  },
  {
    symbol: 'AAVE',
    name: 'Aave',
    decimals: 18,
    address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    balance: '15.50'
  }
];

export const SLIPPAGE_OPTIONS = [
  { label: 'Auto', value: 0.5 },
  { label: '0.1%', value: 0.1 },
  { label: '0.5%', value: 0.5 },
  { label: '1.0%', value: 1.0 },
  { label: 'Custom', value: -1 }
];

export const TIMEFRAMES = [
  { label: '1H', value: '1h', minutes: 60 },
  { label: '4H', value: '4h', minutes: 240 },
  { label: '1D', value: '1d', minutes: 1440 },
  { label: '1W', value: '1w', minutes: 10080 },
  { label: '1M', value: '1m', minutes: 43200 }
];
