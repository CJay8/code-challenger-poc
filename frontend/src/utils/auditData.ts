import { CodeIssue, FileData } from '@/types/audit';

// Exact code block from the interviewer's task
export const WALLET_PAGE_CODE = `interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100
      case 'Ethereum':
        return 50
      case 'Arbitrum':
        return 30
      case 'Zilliqa':
        return 20
      case 'Neo':
        return 20
      default:
        return -99
    }
  }

  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      if (lhsPriority > -99) {
         if (balance.amount <= 0) {
           return true;
         }
      }
      return false
    }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      if (leftPriority > rightPriority) {
        return -1;
      } else if (rightPriority > leftPriority) {
        return 1;
      }
    });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}`;

export const WALLET_PAGE_ISSUES: CodeIssue[] = [
  {
    id: '1',
    severity: 'critical',
    category: 'Logic Error',
    title: 'Undefined variable: lhsPriority',
    description: 'Variable "lhsPriority" is used on line 40 but never defined. This will cause a ReferenceError at runtime.',
    line: 40,
    column: 11,
    suggestion: 'Replace "lhsPriority" with "balancePriority" which was defined on line 39',
    codeSnippet: 'if (lhsPriority > -99) {'
  },
  {
    id: '2',
    severity: 'critical',
    category: 'Logic Error',
    title: 'Inverted filter logic',
    description: 'The filter returns TRUE when balance.amount <= 0, meaning it KEEPS zero or negative balances instead of filtering them out. The logic is backwards.',
    line: 41,
    column: 16,
    suggestion: 'Change condition to: if (balancePriority > -99 && balance.amount > 0) { return true; }',
    codeSnippet: 'if (balance.amount <= 0) { return true; }'
  },
  {
    id: '3',
    severity: 'critical',
    category: 'Performance',
    title: 'Redundant array mapping',
    description: 'formattedBalances is calculated but never used. Then sortedBalances is mapped again for rows, duplicating work.',
    line: 60,
    column: 9,
    suggestion: 'Remove formattedBalances variable or use it for the rows mapping instead of sortedBalances',
    codeSnippet: 'const formattedBalances = sortedBalances.map(...)'
  },
  {
    id: '4',
    severity: 'warning',
    category: 'Performance',
    title: 'Unnecessary useMemo dependency',
    description: '"prices" is in the useMemo dependency array [balances, prices] but is NOT used in the filter/sort logic. This causes unnecessary recalculations.',
    line: 58,
    column: 5,
    suggestion: 'Remove "prices" from dependency array: }, [balances]);',
    codeSnippet: '}, [balances, prices]);'
  },
  {
    id: '5',
    severity: 'critical',
    category: 'Type Safety',
    title: 'Incorrect type annotation',
    description: 'sortedBalances contains WalletBalance objects, but the map function types it as FormattedWalletBalance. This is incorrect and misleading.',
    line: 65,
    column: 46,
    suggestion: 'Either map over formattedBalances or change type to WalletBalance',
    codeSnippet: 'sortedBalances.map((balance: FormattedWalletBalance, index: number)'
  },
  {
    id: '6',
    severity: 'critical',
    category: 'Logic Error',
    title: 'Property does not exist',
    description: 'balance.formatted is accessed but sortedBalances contains WalletBalance (no formatted property). This will be undefined.',
    line: 72,
    column: 24,
    suggestion: 'Use formattedBalances instead of sortedBalances in the rows mapping',
    codeSnippet: 'formattedAmount={balance.formatted}'
  },
  {
    id: '7',
    severity: 'warning',
    category: 'Best Practices',
    title: 'Using array index as React key',
    description: 'Using index as key is an anti-pattern in React. It can cause issues with component state, especially when list order changes.',
    line: 69,
    column: 9,
    suggestion: 'Use unique identifier: key={balance.currency} or key={`${balance.currency}-${balance.blockchain}`}',
    codeSnippet: 'key={index}'
  },
  {
    id: '8',
    severity: 'warning',
    category: 'Type Safety',
    title: 'Implicit "any" type',
    description: 'getPriority function parameter "blockchain" is typed as "any", losing all type safety benefits of TypeScript.',
    line: 23,
    column: 30,
    suggestion: 'Define proper type: blockchain: string or create a type: type Blockchain = "Osmosis" | "Ethereum" | ...',
    codeSnippet: 'getPriority = (blockchain: any): number'
  },
  {
    id: '9',
    severity: 'warning',
    category: 'Code Quality',
    title: 'Incomplete sort comparator',
    description: 'The sort function does not return a value when leftPriority === rightPriority. This is undefined behavior.',
    line: 46,
    column: 41,
    suggestion: 'Add final return statement: return 0; (or use: return rightPriority - leftPriority;)',
    codeSnippet: '}).sort((lhs: WalletBalance, rhs: WalletBalance) => {'
  },
  {
    id: '10',
    severity: 'info',
    category: 'Code Style',
    title: 'Missing toFixed() precision argument',
    description: 'toFixed() is called without arguments, defaulting to 0 decimal places. This may not be intentional for currency formatting.',
    line: 63,
    column: 32,
    suggestion: 'Specify precision: balance.amount.toFixed(2) for 2 decimal places',
    codeSnippet: 'formatted: balance.amount.toFixed()'
  }
];

export const REFACTORED_CODE = `interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // ✅ Fixed: Added blockchain property
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
  usdValue: number; // ✅ Added: Include USD value in formatted balance
}

interface Props extends BoxProps {}

// ✅ Fixed Issue #8: Extract priorities as constant for better maintainability
const BLOCKCHAIN_PRIORITY: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // ✅ Fixed Issue #8: Changed from 'any' to 'string' for type safety
  const getPriority = (blockchain: string): number => {
    return BLOCKCHAIN_PRIORITY[blockchain] ?? -99;
  };

  // ✅ Fixed Issues #1, #2, #3, #4, #5, #6: Combine filter, sort, and format in one memoized operation
  const formattedBalances = useMemo(() => {
    return balances
      .filter((balance) => {
        const priority = getPriority(balance.blockchain);
        // ✅ Fixed Issue #1: Use correct variable name
        // ✅ Fixed Issue #2: Correct logic - keep balances > 0 (not <=0)
        return priority > -99 && balance.amount > 0;
      })
      .sort((a, b) => {
        const priorityA = getPriority(a.blockchain);
        const priorityB = getPriority(b.blockchain);
        // ✅ Fixed Issue #9: Return value for all cases (including equality)
        return priorityB - priorityA; // Descending order, returns 0 when equal
      })
      .map((balance): FormattedWalletBalance => ({
        ...balance,
        // ✅ Fixed Issue #10: Specify decimal places for currency formatting
        formatted: balance.amount.toFixed(2),
        usdValue: (prices[balance.currency] ?? 0) * balance.amount,
      }));
  }, [balances, prices]); // ✅ Fixed Issue #4: Now 'prices' IS used (in map function)

  // ✅ Fixed Issue #3: No redundant formattedBalances - we use it directly
  // ✅ Fixed Issue #5: Correct typing - mapping over FormattedWalletBalance[]
  // ✅ Fixed Issue #6: Using balance.formatted which now exists
  return (
    <div {...rest}>
      {formattedBalances.map((balance) => (
        <WalletRow
          // ✅ Fixed Issue #7: Use unique composite key instead of index
          key={\`\${balance.blockchain}-\${balance.currency}\`}
          className={classes.row}
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
    </div>
  );
};

// Summary of improvements:
// 1. ✅ Fixed undefined variable (lhsPriority → balancePriority)
// 2. ✅ Fixed inverted filter logic (now keeps amount > 0)
// 3. ✅ Removed redundant formattedBalances variable
// 4. ✅ Now prices is actually used in the computation
// 5. ✅ Correct type annotations throughout
// 6. ✅ No undefined balance.formatted property
// 7. ✅ Unique keys instead of array index
// 8. ✅ Proper typing (string instead of any)
// 9. ✅ Complete sort comparator with return value
// 10. ✅ Explicit decimal places in toFixed(2)
//
// Performance improvements:
// - Single pass through array (filter → sort → map) instead of multiple
// - Proper memoization dependencies
// - No wasted computations`;

export const MOCK_FILE_TREE: FileData[] = [
  {
    name: 'WalletPage.tsx',
    path: '/src/pages/WalletPage.tsx',
    content: WALLET_PAGE_CODE,
    language: 'typescript',
    issues: WALLET_PAGE_ISSUES
  },
  {
    name: 'useWalletBalances.ts',
    path: '/src/hooks/useWalletBalances.ts',
    content: `// Custom hook for wallet balances
import { WalletBalance } from '../types';

// Note: This hook returns WalletBalance[] which does NOT have
// a 'blockchain' property, causing the error in WalletPage.tsx
export function useWalletBalances(): WalletBalance[] {
  // Mock implementation - in real app would fetch from wallet
  return [
    { currency: 'ETH', amount: 1.5 },
    { currency: 'BTC', amount: 0.02 },
    { currency: 'USDT', amount: 1000 }
  ];
}

export function usePrices(): Record<string, number> {
  // Mock prices
  return {
    ETH: 2000,
    BTC: 45000,
    USDT: 1
  };
}`,
    language: 'typescript',
    issues: []
  },
  {
    name: 'types.ts',
    path: '/src/types.ts',
    content: `// Type definitions for wallet

// ⚠️ IMPORTANT: This interface is missing 'blockchain' property!
// WalletPage.tsx tries to access balance.blockchain which doesn't exist
export interface WalletBalance {
  currency: string;
  amount: number;
  // blockchain: string; // ❌ Missing! This is why balance.blockchain is undefined
}

export interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

// BoxProps placeholder
export interface BoxProps {
  className?: string;
  children?: React.ReactNode;
}`,
    language: 'typescript',
    issues: []
  }
];
