import { Router, Request, Response } from 'express';
import { SwapService } from '../services/SwapService';
import { OrderBookService } from '../services/OrderBookService';

const router = Router();
const swapService = new SwapService();
const orderBookService = new OrderBookService();

/**
 * @swagger
 * /api/swap/quote:
 *   get:
 *     summary: Get a quote for a token swap
 *     tags: [Swap]
 *     parameters:
 *       - in: query
 *         name: fromToken
 *         required: true
 *         schema:
 *           type: string
 *         description: Source token symbol
 *       - in: query
 *         name: toToken
 *         required: true
 *         schema:
 *           type: string
 *         description: Destination token symbol
 *       - in: query
 *         name: amount
 *         required: true
 *         schema:
 *           type: string
 *         description: Amount to swap
 *     responses:
 *       200:
 *         description: Swap quote
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/SwapQuote'
 *       400:
 *         description: Missing parameters
 *       500:
 *         description: Server error
 */
router.get('/quote', (req: Request, res: Response) => {
  try {
    const { fromToken, toToken, amount } = req.query;

    if (!fromToken || !toToken || !amount) {
      return res.status(400).json({
        error: 'Missing required parameters: fromToken, toToken, amount'
      });
    }

    const quote = swapService.getQuote(
      fromToken as string,
      toToken as string,
      amount as string
    );

    return res.json({
      success: true,
      data: quote
    });
  } catch (error) {
    console.error('Quote error:', error);
    return res.status(500).json({
      error: 'Failed to get quote',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @swagger
 * /api/swap/simulate:
 *   post:
 *     summary: Simulate a token swap
 *     tags: [Swap]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromToken:
 *                 type: string
 *               toToken:
 *                 type: string
 *               amount:
 *                 type: string
 *               slippage:
 *                 type: number
 *                 default: 0.5
 *     responses:
 *       200:
 *         description: Swap simulation result
 *       400:
 *         description: Missing parameters
 */
router.post('/simulate', async (req: Request, res: Response) => {
  try {
    const { fromToken, toToken, amount, slippage = 0.5 } = req.body;

    if (!fromToken || !toToken || !amount) {
      return res.status(400).json({
        error: 'Missing required parameters: fromToken, toToken, amount'
      });
    }

    const result = await swapService.simulateSwap({
      fromToken,
      toToken,
      amount,
      slippage
    });

    return res.json({
      success: result.success,
      data: result
    });
  } catch (error) {
    console.error('Swap simulation error:', error);
    return res.status(500).json({
      error: 'Failed to simulate swap',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/swap/orderbook/:pair
 * Get order book for a trading pair
 */
router.get('/orderbook/:pair', (req: Request, res: Response) => {
  try {
    const { pair } = req.params;
    const orderBook = orderBookService.getOrderBook(pair);

    if (!orderBook) {
      return res.status(404).json({
        error: 'Order book not found for pair'
      });
    }

    return res.json({
      success: true,
      data: orderBook
    });
  } catch (error) {
    console.error('Order book error:', error);
    return res.status(500).json({
      error: 'Failed to get order book',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/swap/orderbooks
 * Get all order books
 */
router.get('/orderbooks', (_req: Request, res: Response) => {
  try {
    const orderBooks = orderBookService.getAllOrderBooks();
    const orderbooksObject = Object.fromEntries(orderBooks);

    return res.json({
      success: true,
      data: orderbooksObject
    });
  } catch (error) {
    console.error('Order books error:', error);
    return res.status(500).json({
      error: 'Failed to get order books',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
