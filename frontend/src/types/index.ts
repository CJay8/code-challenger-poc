export interface Window {
  id: string;
  title: string;
  icon: string;
  component: string;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

export interface AppInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  component: string;
}

export interface NetworkInfo {
  chain: string;
  isConnected: boolean;
  blockNumber?: number;
}

export interface WalletInfo {
  address?: string;
  balance?: string;
  isConnected: boolean;
}

export type WindowAction = 
  | { type: 'OPEN'; payload: AppInfo }
  | { type: 'CLOSE'; payload: string }
  | { type: 'MINIMIZE'; payload: string }
  | { type: 'MAXIMIZE'; payload: string }
  | { type: 'FOCUS'; payload: string }
  | { type: 'UPDATE_POSITION'; payload: { id: string; position: { x: number; y: number } } }
  | { type: 'UPDATE_SIZE'; payload: { id: string; size: { width: number; height: number } } };
