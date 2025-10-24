import { usePublicClient, useAccount } from 'wagmi'
import { useState, useEffect } from 'react'
import { CONTRACTS } from '../config/web3'
import { formatUnits } from 'viem'

// MUSD Transfer event signature
const TRANSFER_EVENT = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

// BorrowerOperations TroveUpdated event
const TROVE_UPDATED_EVENT = '0x3f4d9e8b7f4f7f45a8b7b3c5e9a6f7d8c9b8a7e6f5d4c3b2a1908172635'

export interface Transaction {
  id: string
  type: 'send' | 'receive' | 'borrow' | 'repay' | 'deposit' | 'withdraw'
  amount: string
  currency: string
  address?: string
  timestamp: string
  status: 'confirmed' | 'pending' | 'failed'
  hash: string
  blockNumber: string
}

export function useTransactionHistory() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!address || !publicClient) {
      setIsLoading(false)
      return
    }

    const fetchTransactions = async () => {
      setIsLoading(true)
      const txs: Transaction[] = []

      try {
        // Get current block
        const currentBlock = await publicClient.getBlockNumber()
        const fromBlock = currentBlock - 10000n // Last ~10k blocks

        // Fetch MUSD Transfer events (sent by user)
        const sentLogs = await publicClient.getLogs({
          address: CONTRACTS.MUSD as `0x${string}`,
          event: {
            type: 'event',
            name: 'Transfer',
            inputs: [
              { type: 'address', indexed: true, name: 'from' },
              { type: 'address', indexed: true, name: 'to' },
              { type: 'uint256', indexed: false, name: 'value' },
            ],
          },
          args: {
            from: address,
          },
          fromBlock,
          toBlock: 'latest',
        })

        // Fetch MUSD Transfer events (received by user)
        const receivedLogs = await publicClient.getLogs({
          address: CONTRACTS.MUSD as `0x${string}`,
          event: {
            type: 'event',
            name: 'Transfer',
            inputs: [
              { type: 'address', indexed: true, name: 'from' },
              { type: 'address', indexed: true, name: 'to' },
              { type: 'uint256', indexed: false, name: 'value' },
            ],
          },
          args: {
            to: address,
          },
          fromBlock,
          toBlock: 'latest',
        })

        // Process sent transactions
        for (const log of sentLogs) {
          const block = await publicClient.getBlock({ blockNumber: log.blockNumber })
          const amount = log.args.value ? formatUnits(log.args.value, 18) : '0'
          
          txs.push({
            id: log.transactionHash || '',
            type: 'send',
            amount: `-${parseFloat(amount).toFixed(2)}`,
            currency: 'MUSD',
            address: log.args.to as string,
            timestamp: new Date(Number(block.timestamp) * 1000).toLocaleString(),
            status: 'confirmed',
            hash: log.transactionHash || '',
            blockNumber: log.blockNumber.toString(),
          })
        }

        // Process received transactions
        for (const log of receivedLogs) {
          // Skip minting from zero address
          if (log.args.from === '0x0000000000000000000000000000000000000000') {
            const block = await publicClient.getBlock({ blockNumber: log.blockNumber })
            const amount = log.args.value ? formatUnits(log.args.value, 18) : '0'
            
            txs.push({
              id: log.transactionHash || '',
              type: 'borrow',
              amount: `+${parseFloat(amount).toFixed(2)}`,
              currency: 'MUSD',
              address: 'Borrowed from BorrowerOperations',
              timestamp: new Date(Number(block.timestamp) * 1000).toLocaleString(),
              status: 'confirmed',
              hash: log.transactionHash || '',
              blockNumber: log.blockNumber.toString(),
            })
          } else if (log.args.from !== address) {
            const block = await publicClient.getBlock({ blockNumber: log.blockNumber })
            const amount = log.args.value ? formatUnits(log.args.value, 18) : '0'
            
            txs.push({
              id: log.transactionHash || '',
              type: 'receive',
              amount: `+${parseFloat(amount).toFixed(2)}`,
              currency: 'MUSD',
              address: log.args.from as string,
              timestamp: new Date(Number(block.timestamp) * 1000).toLocaleString(),
              status: 'confirmed',
              hash: log.transactionHash || '',
              blockNumber: log.blockNumber.toString(),
            })
          }
        }

        // Sort by block number (most recent first)
        txs.sort((a, b) => {
          return Number(b.blockNumber) - Number(a.blockNumber)
        })

        setTransactions(txs)
      } catch (error) {
        console.error('Error fetching transactions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [address, publicClient])

  return {
    transactions,
    isLoading,
  }
}

