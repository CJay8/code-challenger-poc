# 🚀 Code Challenge Solution

A modern full-stack web application featuring three interactive coding challenges with a stunning Terminal OS cyberpunk aesthetic.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)
![React](https://img.shields.io/badge/React-18.2-61DAFB.svg)

## 🌟 Live Demo

- **Frontend**: [Deployed on Vercel](https://your-app.vercel.app)
- **Backend API**: [Deployed on Render](https://your-api.onrender.com)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Problems Overview](#problems-overview)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Problem 1: Math Lab - Algorithm Complexity Analyzer
- **Interactive Algorithm Comparison**: Compare three different approaches (Iterative, Formula, Recursive)
- **Real-time Performance Metrics**: Live execution time tracking and complexity analysis
- **Dynamic Complexity Visualization**: Beautiful gradient badges showing Time & Space complexity
- **Method Execution**: Click to execute individual methods and see real-time results
- **Fully Reactive**: All calculations update dynamically based on input changes

### Problem 2: Currency Swap - Live Trading Terminal
- **Real-time Price Streaming**: WebSocket integration for live cryptocurrency prices
- **Interactive Order Book**: View buy/sell orders with live updates
- **Price Charts**: Visual representation of price movements
- **Swap Calculator**: Calculate swap amounts with slippage and fees
- **Transaction Feed**: Live transaction history
- **200+ Currencies**: Support for major cryptocurrencies and fiat currencies

### Problem 3: Code Auditor - Interactive Code Review Tool
- **10 Real Issues**: Identifies actual code problems (5 critical, 4 warning, 1 info)
- **Multi-file Support**: View and analyze multiple related files
- **Interactive Issue Explorer**: Click issues to jump to relevant code lines
- **Auto-scroll Navigation**: Automatically scrolls to selected issue line
- **Before/After Comparison**: See the impact of refactoring (-75% iterations, -100% errors)
- **Apply Changes**: One-click code refactoring with visual feedback
- **Performance Scoring**: Dynamic scoring based on code quality
- **Reset Functionality**: Revert changes to see original code

### UI/UX Features
- **Cyberpunk Terminal OS Theme**: Beautiful dark mode with neon accents
- **Glassmorphism Effects**: Modern frosted glass aesthetic
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Keyboard Shortcuts**: Quick navigation and actions
- **Toast Notifications**: User-friendly feedback system

## 🛠 Tech Stack

### Frontend
- **React 18.2** - Modern UI library with hooks
- **TypeScript 5.3** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Framer Motion 11** - Animation library
- **React Router 6** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express.js 4** - Web application framework
- **TypeScript 5.3** - Type-safe server code
- **WebSocket (ws)** - Real-time communication
- **Node-Cache** - In-memory caching
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

### DevOps & Tools
- **Git** - Version control
- **npm** - Package management
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vercel** - Frontend deployment
- **Render** - Backend deployment

## 📁 Project Structure

```
code-challenge-solution/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── problem1/    # Math Lab components
│   │   │   ├── problem2/    # Currency Swap components
│   │   │   ├── problem3/    # Code Auditor components
│   │   │   └── shared/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript type definitions
│   │   ├── api/             # API client setup
│   │   └── pages/           # Page components
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                  # Express TypeScript backend
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── services/        # Business logic services
│   │   ├── config/          # Configuration files
│   │   └── server.ts        # Entry point
│   ├── tsconfig.json
│   └── package.json
│
├── .env.example             # Environment variables template
├── package.json             # Root package configuration
└── README.md               # You are here!
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/code-challenge-solution.git
   cd code-challenge-solution
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   **Frontend** (`frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:3001
   VITE_WS_URL=ws://localhost:3001
   ```

   **Backend** (`backend/.env`):
   ```env
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   This starts both frontend (http://localhost:5173) and backend (http://localhost:3001)

### Individual Commands

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend

# Build for production
npm run build

# Run production build
npm run start

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🌐 Deployment

### Deploy to Vercel (Frontend)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin master
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Add Environment Variables** in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   VITE_WS_URL=wss://your-backend.onrender.com
   ```

4. **Deploy** - Vercel will auto-deploy on every push!

### Deploy to Render (Backend)

1. **Push code to GitHub** (same as above)

2. **Create New Web Service** on [render.com](https://render.com)
   - Connect your GitHub repository
   - Configure service:
     - **Name**: code-challenge-backend
     - **Root Directory**: `backend`
     - **Environment**: Node
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Instance Type**: Free (or your preference)

3. **Add Environment Variables** in Render dashboard:
   ```
   PORT=3001
   NODE_ENV=production
   CORS_ORIGIN=https://your-app.vercel.app
   ```

4. **Deploy** - Render will build and deploy automatically!

### Post-Deployment

After both deployments:
1. Update frontend env vars in Vercel with your Render backend URL
2. Update backend CORS_ORIGIN in Render with your Vercel frontend URL
3. Redeploy both services if necessary

## 🎯 Problems Overview

### Problem 1: Math Lab
**Objective**: Demonstrate understanding of algorithm complexity and optimization.

**Key Learnings**:
- Time complexity: O(n) vs O(1) vs O(2^n)
- Space complexity optimization
- Trade-offs between different approaches
- Real-time performance measurement

**Live Demo**: Click "Math Lab" in the application dock

### Problem 2: Currency Swap
**Objective**: Build a real-time trading interface with WebSocket integration.

**Key Features**:
- WebSocket connection for live price updates
- Order book visualization
- Slippage calculation
- Fee estimation
- Transaction history

**Supported Pairs**: ETH/USD, BTC/USD, ETH/BTC, and 200+ more

**Live Demo**: Click "Currency Swap" in the application dock

### Problem 3: Code Auditor
**Objective**: Identify and fix real code issues in a React component.

**Issues Detected**:
1. **Critical**: Inefficient sorting (5 times in render)
2. **Critical**: Priority calculation errors
3. **Critical**: Missing blockchain filter
4. **Critical**: Unnecessary useMemo dependency
5. **Critical**: Missing formatted balances memoization
6. **Warning**: Incorrect balance sorting
7. **Warning**: Redundant sorting in JSX
8. **Warning**: getPriority called in render
9. **Info**: Component could be simplified

**Refactoring Impact**:
- -75% iterations (from 20 to 5)
- -100% errors (from 2 to 0)
- +40% performance score

**Live Demo**: Click "Code Auditor" in the application dock

## 📡 API Documentation

### Health Check
```
GET /api/health
```

### Currency Swap
```
POST /api/swap/calculate
Body: { from, to, amount }
Response: { result, rate, fee, slippage }
```

### WebSocket Endpoints
```
ws://localhost:3001

Messages:
- subscribe: { type: 'subscribe', pairs: ['ETH/USD'] }
- unsubscribe: { type: 'unsubscribe', pairs: ['ETH/USD'] }

Received:
- price: { type: 'price', pair: 'ETH/USD', price: 2500.00 }
- orderbook: { type: 'orderbook', pair: 'ETH/USD', bids: [...], asks: [...] }
```

## 🔐 Environment Variables

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3001` |
| `VITE_WS_URL` | WebSocket URL | `ws://localhost:3001` |

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` |
| `CORS_ORIGIN` | Allowed origin | `http://localhost:5173` |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Terminal OS design inspiration from modern UI/UX trends
- Cryptocurrency data providers
- Open source community

## 📞 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ using React, TypeScript, and modern web technologies**
