interface OrderBookLevel {
  price: number;
  amount: number;
  total: number;
}

interface OrderBook {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  spread: number;
}

export class OrderBookService {
  private orderBooks: Map<string, OrderBook> = new Map();

  constructor() {
this.initializeOrderBooks();
  }

  private initializeOrderBooks() {
    const pairs = ['ETH/USDC', 'ETH/USDT', 'WBTC/USDC', 'UNI/USDC', 'LINK/USDC'];
    
    pairs.forEach(pair => {
      this.updateOrderBook(pair, this.getBasePrice(pair));
    });

    // Update order books periodically
    setInterval(() => {
      pairs.forEach(pair => {
        this.updateOrderBook(pair, this.getBasePrice(pair));
      });
    }, 2000);
  }

  private getBasePrice(pair: string): number {
    const basePrices: { [key: string]: number } = {
      'ETH/USDC': 2450,
      'ETH/USDT': 2448,
      'WBTC/USDC': 48500,
      'UNI/USDC': 12.5,
      'LINK/USDC': 18.3
    };
    return basePrices[pair] || 100;
  }

  private updateOrderBook(pair: string, basePrice: number) {
    const bids: OrderBookLevel[] = [];
    const asks: OrderBookLevel[] = [];

    // Generate bids (buy orders below current price)
    for (let i = 0; i < 20; i++) {
      const priceOffset = (i + 1) * (basePrice * 0.0002); // 0.02% steps
      const price = basePrice - priceOffset;
      const amount = Math.random() * 10 + 5;
      bids.push({
        price,
        amount,
        total: price * amount
      });
    }

    // Generate asks (sell orders above current price)
    for (let i = 0; i < 20; i++) {
      const priceOffset = (i + 1) * (basePrice * 0.0002); // 0.02% steps
      const price = basePrice + priceOffset;
      const amount = Math.random() * 10 + 5;
      asks.push({
        price,
        amount,
        total: price * amount
      });
    }

    const spread = asks[0].price - bids[0].price;

    this.orderBooks.set(pair, { bids, asks, spread });
  }

  public getOrderBook(pair: string): OrderBook | undefined {
    return this.orderBooks.get(pair);
  }

  public getAllOrderBooks(): Map<string, OrderBook> {
    return this.orderBooks;
  }
}
