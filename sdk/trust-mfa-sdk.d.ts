/**
 * TrustJS SDK - TypeScript Definitions
 * Trust is the only way.
 */

export interface TrustMFAOptions {
  /** Backend API URL */
  apiUrl?: string;
  /** Your merchant identifier */
  merchantId?: string;
  /** Amount threshold for MFA (default: 500) */
  threshold?: number;
  /** Global OTP handler callback */
  onOtpRequired?: (response: OtpResponse) => Promise<string>;
}

export interface MfaParams {
  /** Unique order identifier */
  orderId: string;
  /** Transaction amount */
  amount: number;
  /** Customer email (optional) */
  customerEmail?: string;
}

export interface MfaOptions {
  /** Called when OTP is sent */
  onOtpSent?: (response: OtpResponse) => void;
  /** Called to get OTP from user */
  onVerificationRequired?: (response: OtpResponse) => Promise<string>;
}

export interface OtpResponse {
  success: boolean;
  message: string;
  otp?: string;
}

export interface BlockchainTx {
  hash: string;
  explorerUrl: string;
}

export interface MfaReceipt {
  merchantId: string;
  orderId: string;
  method: string;
  timestamp: number;
  receiptId: string;
  approvalHash: string;
  blockchainTx?: BlockchainTx;
}

export interface MfaResult {
  success: boolean;
  mfaRequired: boolean;
  verified?: boolean;
  receipt?: MfaReceipt;
  blockchainTx?: BlockchainTx;
  approvalHash?: string;
  timestamp?: number;
  message?: string;
  error?: string;
}

export interface AnalyticsData {
  totalTransactions: number;
  successfulTransactions: number;
  fraudAttempts: number;
  mfaUsage: number;
  totalRevenue: number;
  recentTransactions: any[];
  dailyStats: any[];
  fraudPatterns: any[];
  blockchainTransactions: any[];
}

/**
 * TrustJS MFA SDK
 * 
 * A lightweight SDK for integrating blockchain-powered MFA verification
 * into your payment flows.
 * 
 * @example
 * ```typescript
 * const mfa = new TrustMFA({
 *   apiUrl: 'https://api.trustjs.com',
 *   merchantId: 'your_merchant_id'
 * });
 * 
 * const result = await mfa.requestMfa({
 *   orderId: 'order_123',
 *   amount: 599.99
 * });
 * ```
 */
export default class TrustMFA {
  constructor(options?: TrustMFAOptions);

  /**
   * Check if MFA is required for a transaction
   * @param amount - Transaction amount
   * @returns true if MFA is required
   */
  isMfaRequired(amount: number): boolean;

  /**
   * Request MFA verification for a transaction
   * @param params - Transaction parameters
   * @param options - Additional options
   * @returns MFA result with blockchain receipt
   */
  requestMfa(params: MfaParams, options?: MfaOptions): Promise<MfaResult>;

  /**
   * Get transaction analytics
   * @returns Analytics data
   */
  getAnalytics(): Promise<AnalyticsData>;
}
