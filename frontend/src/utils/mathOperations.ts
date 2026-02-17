/**
 * Math Lab - Sum to N Operations
 * Three different approaches with performance tracking
 */

export interface CalculationResult {
  result: number;
  method: 'iterative' | 'formula' | 'recursive';
  executionTime: number;
  complexity: string;
}

/**
 * Method 1: Iterative approach
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
export function sumToNIterative(n: number): CalculationResult {
  const startTime = performance.now();
  
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  
  const executionTime = performance.now() - startTime;
  
  return {
    result: sum,
    method: 'iterative',
    executionTime,
    complexity: 'O(n)'
  };
}

/**
 * Method 2: Mathematical formula (Gauss)
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
export function sumToNFormula(n: number): CalculationResult {
  const startTime = performance.now();
  
  const sum = (n * (n + 1)) / 2;
  
  const executionTime = performance.now() - startTime;
  
  return {
    result: sum,
    method: 'formula',
    executionTime,
    complexity: 'O(1)'
  };
}

/**
 * Method 3: Recursive approach
 * Time Complexity: O(n)
 * Space Complexity: O(n) - call stack
 */
export function sumToNRecursive(n: number): CalculationResult {
  const startTime = performance.now();
  
  function recursiveSum(num: number): number {
    if (num <= 0) return 0;
    return num + recursiveSum(num - 1);
  }
  
  const sum = recursiveSum(n);
  
  const executionTime = performance.now() - startTime;
  
  return {
    result: sum,
    method: 'recursive',
    executionTime,
    complexity: 'O(n)'
  };
}

/**
 * Get method color based on type
 */
export function getMethodColor(method: string): string {
  switch (method) {
    case 'iterative':
      return '#00f0ff'; // Cyan
    case 'formula':
      return '#00ff9d'; // Green
    case 'recursive':
      return '#ff00aa'; // Magenta
    default:
      return '#ffffff';
  }
}

/**
 * Get method description
 */
export function getMethodDescription(method: string): string {
  switch (method) {
    case 'iterative':
      return 'Linear Loop - Classic iteration through all numbers';
    case 'formula':
      return 'Gaussian Formula - Instant calculation using n(n+1)/2';
    case 'recursive':
      return 'Recursive Stack - Function calling itself';
    default:
      return '';
  }
}
