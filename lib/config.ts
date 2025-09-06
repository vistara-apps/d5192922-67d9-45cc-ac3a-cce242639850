// Configuration constants for PeerLink
export const config = {
  // Base Network Configuration
  base: {
    chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '8453'),
    rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
    name: 'Base',
    currency: 'ETH',
    blockExplorer: 'https://basescan.org',
  },

  // App Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'PeerLink',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    description: 'Connect, Learn, and Earn with Your Peers',
    version: '1.0.0',
  },

  // API Configuration
  api: {
    neynar: {
      baseUrl: 'https://api.neynar.com/v2',
      apiKey: process.env.NEYNAR_API_KEY,
    },
    pinata: {
      baseUrl: 'https://api.pinata.cloud',
      apiKey: process.env.PINATA_API_KEY,
      secretApiKey: process.env.PINATA_SECRET_API_KEY,
      jwt: process.env.PINATA_JWT,
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
    },
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    upstash: {
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    },
  },

  // Privy Configuration
  privy: {
    appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    appSecret: process.env.PRIVY_APP_SECRET,
  },

  // Business Logic Configuration
  business: {
    // Pricing limits
    tutoring: {
      minPrice: 5,
      maxPrice: 200,
      defaultPrice: 25,
    },
    resources: {
      minPrice: 1,
      maxPrice: 100,
      defaultPrice: 10,
    },
    skills: {
      minPrice: 10,
      maxPrice: 500,
      defaultPrice: 30,
    },
    // Platform fees (in basis points, 100 = 1%)
    platformFee: 250, // 2.5%
    // Session limits
    maxSessionDuration: 4 * 60 * 60 * 1000, // 4 hours in milliseconds
    minSessionDuration: 30 * 60 * 1000, // 30 minutes in milliseconds
    // Group limits
    maxGroupMembers: 20,
    minGroupMembers: 2,
  },

  // Feature flags
  features: {
    aiAssistance: !!process.env.OPENAI_API_KEY,
    notifications: true,
    analytics: true,
    payments: true,
    ipfsStorage: !!process.env.PINATA_JWT,
  },
} as const;

// Validation function to check if all required environment variables are set
export function validateConfig(): { isValid: boolean; missingVars: string[] } {
  const requiredVars = [
    'NEXT_PUBLIC_PRIVY_APP_ID',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];

  const missingVars = requiredVars.filter(
    (varName) => !process.env[varName]
  );

  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
}

// Type exports
export type Config = typeof config;
export type ChainConfig = typeof config.base;
export type ApiConfig = typeof config.api;
