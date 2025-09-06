// Blockchain integration for Base network and smart contracts
import { createPublicClient, createWalletClient, http, parseEther, formatEther } from 'viem';
import { base } from 'viem/chains';

// USDC contract ABI (simplified)
const USDC_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

// PeerLink contract ABI (simplified escrow contract)
const PEERLINK_ABI = [
  {
    inputs: [
      { name: 'sessionId', type: 'string' },
      { name: 'tutor', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'createEscrow',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'sessionId', type: 'string' }],
    name: 'releasePayment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'sessionId', type: 'string' }],
    name: 'refundPayment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'sessionId', type: 'string' }],
    name: 'getEscrow',
    outputs: [
      { name: 'student', type: 'address' },
      { name: 'tutor', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'isReleased', type: 'bool' },
      { name: 'isRefunded', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

// Contract addresses
const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS as `0x${string}`;
const PEERLINK_ADDRESS = process.env.NEXT_PUBLIC_PEERLINK_CONTRACT_ADDRESS as `0x${string}`;

// Create clients
const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL)
});

export class BlockchainService {
  private publicClient = publicClient;

  // USDC operations
  async getUSDCBalance(address: `0x${string}`): Promise<string> {
    try {
      const balance = await this.publicClient.readContract({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: 'balanceOf',
        args: [address]
      });

      // USDC has 6 decimals
      return (Number(balance) / 1e6).toString();
    } catch (error) {
      console.error('Error fetching USDC balance:', error);
      throw error;
    }
  }

  async checkUSDCAllowance(owner: `0x${string}`, spender: `0x${string}`): Promise<string> {
    try {
      const allowance = await this.publicClient.readContract({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: 'allowance',
        args: [owner, spender]
      });

      return (Number(allowance) / 1e6).toString();
    } catch (error) {
      console.error('Error checking USDC allowance:', error);
      throw error;
    }
  }

  // Escrow operations
  async getEscrowDetails(sessionId: string) {
    try {
      const escrow = await this.publicClient.readContract({
        address: PEERLINK_ADDRESS,
        abi: PEERLINK_ABI,
        functionName: 'getEscrow',
        args: [sessionId]
      });

      return {
        student: escrow[0],
        tutor: escrow[1],
        amount: (Number(escrow[2]) / 1e6).toString(),
        isReleased: escrow[3],
        isRefunded: escrow[4]
      };
    } catch (error) {
      console.error('Error fetching escrow details:', error);
      throw error;
    }
  }

  // Transaction preparation helpers
  prepareUSDCApproval(spender: `0x${string}`, amount: string) {
    const amountInWei = BigInt(Math.floor(parseFloat(amount) * 1e6));
    
    return {
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: 'approve',
      args: [spender, amountInWei]
    };
  }

  prepareUSDCTransfer(to: `0x${string}`, amount: string) {
    const amountInWei = BigInt(Math.floor(parseFloat(amount) * 1e6));
    
    return {
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: 'transfer',
      args: [to, amountInWei]
    };
  }

  prepareEscrowCreation(sessionId: string, tutor: `0x${string}`, amount: string) {
    const amountInWei = BigInt(Math.floor(parseFloat(amount) * 1e6));
    
    return {
      address: PEERLINK_ADDRESS,
      abi: PEERLINK_ABI,
      functionName: 'createEscrow',
      args: [sessionId, tutor, amountInWei]
    };
  }

  preparePaymentRelease(sessionId: string) {
    return {
      address: PEERLINK_ADDRESS,
      abi: PEERLINK_ABI,
      functionName: 'releasePayment',
      args: [sessionId]
    };
  }

  preparePaymentRefund(sessionId: string) {
    return {
      address: PEERLINK_ADDRESS,
      abi: PEERLINK_ABI,
      functionName: 'refundPayment',
      args: [sessionId]
    };
  }

  // Transaction monitoring
  async waitForTransaction(hash: `0x${string}`) {
    try {
      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash,
        timeout: 60_000 // 60 seconds
      });

      return receipt;
    } catch (error) {
      console.error('Error waiting for transaction:', error);
      throw error;
    }
  }

  // Gas estimation
  async estimateGas(transaction: any, account: `0x${string}`) {
    try {
      const gas = await this.publicClient.estimateContractGas({
        ...transaction,
        account
      });

      return gas;
    } catch (error) {
      console.error('Error estimating gas:', error);
      throw error;
    }
  }

  // Get current gas price
  async getGasPrice() {
    try {
      const gasPrice = await this.publicClient.getGasPrice();
      return gasPrice;
    } catch (error) {
      console.error('Error fetching gas price:', error);
      throw error;
    }
  }

  // Utility functions
  formatUSDC(amount: bigint): string {
    return (Number(amount) / 1e6).toFixed(2);
  }

  parseUSDC(amount: string): bigint {
    return BigInt(Math.floor(parseFloat(amount) * 1e6));
  }

  // Platform fee calculation
  calculatePlatformFee(amount: string): string {
    const feePercentage = parseFloat(process.env.NEXT_PUBLIC_PLATFORM_FEE_PERCENTAGE || '5');
    const fee = (parseFloat(amount) * feePercentage) / 100;
    return fee.toFixed(2);
  }

  calculateNetAmount(amount: string): string {
    const fee = this.calculatePlatformFee(amount);
    const net = parseFloat(amount) - parseFloat(fee);
    return net.toFixed(2);
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();

// Export contract addresses and ABIs for use in components
export { USDC_ADDRESS, PEERLINK_ADDRESS, USDC_ABI, PEERLINK_ABI };
