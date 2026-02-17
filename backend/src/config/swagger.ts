import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Terminal OS API',
      version: '1.0.0',
      description: 'Backend API for Terminal OS - A cyberpunk-themed web operating system',
      contact: {
        name: 'API Support',
        email: 'support@terminal-os.dev',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
      {
        url: 'https://api.terminal-os.dev',
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        Token: {
          type: 'object',
          properties: {
            symbol: { type: 'string', example: 'ETH' },
            name: { type: 'string', example: 'Ethereum' },
            address: { type: 'string', example: '0x...' },
            decimals: { type: 'number', example: 18 },
            logoUrl: { type: 'string', example: 'https://...' },
          },
        },
        SwapQuote: {
          type: 'object',
          properties: {
            fromToken: { type: 'string', example: 'ETH' },
            toToken: { type: 'string', example: 'USDC' },
            fromAmount: { type: 'string', example: '1.0' },
            toAmount: { type: 'string', example: '2450.00' },
            rate: { type: 'number', example: 2450 },
            priceImpact: { type: 'number', example: 0.5 },
            gasEstimate: { type: 'string', example: '150000' },
            route: {
              type: 'array',
              items: { type: 'string' },
              example: ['ETH', 'USDC'],
            },
          },
        },
        OrderBook: {
          type: 'object',
          properties: {
            pair: { type: 'string', example: 'ETH/USDC' },
            bids: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  price: { type: 'number', example: 2449.50 },
                  amount: { type: 'number', example: 10.5 },
                  total: { type: 'number', example: 25719.75 },
                },
              },
            },
            asks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  price: { type: 'number', example: 2450.50 },
                  amount: { type: 'number', example: 8.2 },
                  total: { type: 'number', example: 20094.10 },
                },
              },
            },
            timestamp: { type: 'number', example: 1707926400000 },
          },
        },
        PriceUpdate: {
          type: 'object',
          properties: {
            pair: { type: 'string', example: 'ETH/USDC' },
            price: { type: 'number', example: 2450.00 },
            change24h: { type: 'number', example: 5.2 },
            volume24h: { type: 'number', example: 1500000000 },
            timestamp: { type: 'number', example: 1707926400000 },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Error message' },
            message: { type: 'string', example: 'Detailed error description' },
          },
        },
      },
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Health', description: 'Health check endpoints' },
      { name: 'Swap', description: 'Token swap operations' },
      { name: 'WebSocket', description: 'WebSocket connections for real-time data' },
    ],
  },
  apis: ['./src/routes/*.ts', './src/server.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
