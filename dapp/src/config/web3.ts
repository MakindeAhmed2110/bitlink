import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { defineChain } from 'viem'

// Mezo Testnet (Matsnet) configuration
export const mezoTestnet = defineChain({
  id: 31611,
  name: 'Mezo Testnet',
  nativeCurrency: {
    name: 'Bitcoin',
    symbol: 'BTC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.test.mezo.org'],
    },
    public: {
      http: ['https://rpc.test.mezo.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Mezo Explorer',
      url: 'https://explorer.test.mezo.org',
    },
  },
  testnet: true,
})

// Mezo Mainnet configuration
export const mezoMainnet = defineChain({
  id: 31612,
  name: 'Mezo',
  nativeCurrency: {
    name: 'Bitcoin',
    symbol: 'BTC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.mezo.org'],
    },
    public: {
      http: ['https://rpc.mezo.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Mezo Explorer',
      url: 'https://explorer.mezo.org',
    },
  },
})

// RainbowKit + Wagmi configuration
export const config = getDefaultConfig({
  appName: 'Bitlink - Banking Without a Bank',
  projectId: 'YOUR_PROJECT_ID', // Get from WalletConnect Cloud
  chains: [mezoTestnet],
  ssr: false,
})

// MUSD Contract Addresses on Matsnet (Testnet)
export const CONTRACTS = {
  MUSD: '0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503',
  BorrowerOperations: '0xCdF7028ceAB81fA0C6971208e83fa7872994beE5',
  TroveManager: '0xE47c80e8c23f6B4A1aE41c34837a0599D5D16bb0',
  StabilityPool: '0x1CCA7E410eE41739792eA0A24e00349Dd247680e',
  PriceFeed: '0x86bCF0841622a5dAC14A313a15f96A95421b9366',
  HintHelpers: '0x4e4cBA3779d56386ED43631b4dCD6d8EacEcBCF6',
  SortedTroves: '0x722E4D24FD6Ff8b0AC679450F3D91294607268fA',
  ActivePool: '0x143A063F62340DA3A8bEA1C5642d18C6D0F7FF51',
  DefaultPool: '0x59851D252090283f9367c159f0C9036e75483300',
  CollSurplusPool: '0xB4C35747c26E4aB5F1a7CdC7E875B5946eFa6fa9',
  GasPool: '0x8fa3EF45137C3AFF337e42f98023C1D7dd3666C0',
  InterestRateManager: '0xD4D6c36A592A2c5e86035A6bca1d57747a567f37',
  PCV: '0x4dDD70f4C603b6089c07875Be02fEdFD626b80Af',
  GovernableVariables: '0x6552059B6eFc6aA4AE3ea45f28ED4D92acE020cD',
  BorrowerOperationsSignatures: '0xD757e3646AF370b15f32EB557F0F8380Df7D639e',
} as const

