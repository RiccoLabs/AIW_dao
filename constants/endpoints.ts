export const MAINNET_RPC =
  process.env.NEXT_PUBLIC_MAINNET_RPC ||
  process.env.MAINNET_RPC 

export const DEVNET_RPC =
  process.env.NEXT_PUBLIC_DEVNET_RPC ||
  process.env.DEVNET_RPC ||
  'https://mango.devnet.rpcpool.com'
