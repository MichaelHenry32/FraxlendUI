const REQUIRED_ENV_VARS = {
  YIELD_TOKEN_HELPERS_ADDRESS: process.env.NEXT_PUBLIC_YIELD_TOKEN_HELPERS_ADDRESS,
  SFRXUSD_ADDRESS: process.env.NEXT_PUBLIC_SFRXUSD_ADDRESS,
  FRXUSD_ADDRESS: process.env.NEXT_PUBLIC_FRXUSD_ADDRESS,
  FRAXLEND_FACTORY_ADDRESS: process.env.NEXT_PUBLIC_FRAXLEND_FACTORY_ADDRESS,
} as const;

// Validate environment variables
Object.entries(REQUIRED_ENV_VARS).forEach(([key, value]) => {
  if (!value) {
    throw new Error(
      `Missing required environment variable: NEXT_PUBLIC_${key}. ` +
      'Make sure you have created a .env.local file with the required variables.'
    );
  }
  
  // Validate Ethereum address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
    throw new Error(
      `Invalid Ethereum address format for NEXT_PUBLIC_${key}: ${value}`
    );
  }
});

export const config = {
  contracts: {
    YIELD_TOKEN_HELPERS_ADDRESS: REQUIRED_ENV_VARS.YIELD_TOKEN_HELPERS_ADDRESS as `0x${string}`,
    SFRXUSD_ADDRESS: REQUIRED_ENV_VARS.SFRXUSD_ADDRESS as `0x${string}`,
    FRXUSD_ADDRESS: REQUIRED_ENV_VARS.FRXUSD_ADDRESS as `0x${string}`,
    FRAXLEND_FACTORY_ADDRESS: REQUIRED_ENV_VARS.FRAXLEND_FACTORY_ADDRESS as `0x${string}`,
  }
} as const; 