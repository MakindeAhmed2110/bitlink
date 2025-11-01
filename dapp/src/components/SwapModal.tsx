import { useState, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi'
import { parseEther, formatEther, formatUnits } from 'viem'
import { CONTRACTS, SWAP_TOKENS } from '../config/web3'
import './SwapModal.css'

interface SwapModalProps {
  isOpen: boolean
  onClose: () => void
}

const ROUTER_ABI = [
  {
    inputs: [
      { name: 'amountIn', type: 'uint256' },
      { name: 'amountOutMin', type: 'uint256' },
      { name: 'path', type: 'address[]' },
      { name: 'to', type: 'address' },
      { name: 'deadline', type: 'uint256' },
    ],
    name: 'swapExactTokensForTokens',
    outputs: [{ name: 'amounts', type: 'uint256[]' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'amountIn', type: 'uint256' },
      { name: 'path', type: 'address[]' },
    ],
    name: 'getAmountsOut',
    outputs: [{ name: 'amounts', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export default function SwapModal({ isOpen, onClose }: SwapModalProps) {
  const { address } = useAccount()
  const [amountIn, setAmountIn] = useState('')
  const [amountOut, setAmountOut] = useState('')
  const [tokenFrom, setTokenFrom] = useState<'MUSD' | 'tBTC' | 'WBTC' | 'mUSDC' | 'mUSDT'>('MUSD')
  const [tokenTo, setTokenTo] = useState<'MUSD' | 'tBTC' | 'WBTC' | 'mUSDC' | 'mUSDT'>('tBTC')
  const [slippage, setSlippage] = useState('1') // 1% default
  const [error, setError] = useState('')
  const [isApproved, setIsApproved] = useState(false)

  const { writeContract, data: hash, isPending: isLoading } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  // Get swap quote
  const { data: swapQuote } = useReadContract({
    address: CONTRACTS.Router as `0x${string}`,
    abi: ROUTER_ABI,
    functionName: 'getAmountsOut',
    args: amountIn && parseFloat(amountIn) > 0
      ? [
          parseEther(amountIn),
          [
            SWAP_TOKENS[tokenFrom].address,
            SWAP_TOKENS[tokenTo].address,
          ] as `0x${string}`[],
        ]
      : undefined,
    query: { enabled: !!amountIn && parseFloat(amountIn) > 0 },
  })

  // Update amountOut when quote changes
  useEffect(() => {
    if (swapQuote && Array.isArray(swapQuote) && swapQuote.length > 1) {
      const estimatedOut = formatEther(swapQuote[swapQuote.length - 1])
      setAmountOut(parseFloat(estimatedOut).toFixed(4))
    } else {
      setAmountOut('')
    }
  }, [swapQuote, formatEther])

  // Get balances
  const { data: balanceFrom } = useReadContract({
    address: SWAP_TOKENS[tokenFrom].address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const { data: balanceTo } = useReadContract({
    address: SWAP_TOKENS[tokenTo].address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  // Check allowance
  const { data: allowance } = useReadContract({
    address: SWAP_TOKENS[tokenFrom].address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.Router as `0x${string}`] : undefined,
    query: { enabled: !!address },
  })

  useEffect(() => {
    if (allowance && amountIn) {
      const required = parseEther(amountIn)
      setIsApproved(allowance >= required)
    } else {
      setIsApproved(false)
    }
  }, [allowance, amountIn])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAmountIn('')
      setAmountOut('')
      setError('')
    }
  }, [isOpen])

  const handleSwap = async () => {
    if (!amountIn || parseFloat(amountIn) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (!isApproved) {
      setError('Please approve token first')
      return
    }

    try {
      setError('')

      const amountInWei = parseEther(amountIn)
      const slippageDecimal = parseFloat(slippage) / 100
      const estimatedOut = parseFloat(amountOut) * (1 - slippageDecimal)
      const amountOutMin = parseEther(estimatedOut.toFixed(18))

      const path = [
        SWAP_TOKENS[tokenFrom].address,
        SWAP_TOKENS[tokenTo].address,
      ] as `0x${string}`[]

      const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes

      writeContract({
        address: CONTRACTS.Router as `0x${string}`,
        abi: ROUTER_ABI,
        functionName: 'swapExactTokensForTokens',
        args: [amountInWei, amountOutMin, path, address!, BigInt(deadline)],
      })
    } catch (err: any) {
      setError(err?.message || 'Transaction failed')
      console.error('Swap error:', err)
    }
  }

  const handleApprove = async () => {
    if (!amountIn || parseFloat(amountIn) <= 0) {
      setError('Please enter a valid amount first')
      return
    }

    try {
      setError('')

      const amountInWei = parseEther(amountIn)

      writeContract({
        address: SWAP_TOKENS[tokenFrom].address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACTS.Router as `0x${string}`, amountInWei],
      })
    } catch (err: any) {
      setError(err?.message || 'Approval failed')
      console.error('Approve error:', err)
    }
  }

  const fromBalance = balanceFrom ? formatEther(balanceFrom) : '0'
  const toBalance = balanceTo ? formatEther(balanceTo) : '0'

  const handleMax = () => {
    setAmountIn(fromBalance)
  }

  // Reset form after successful swap/approval
  useEffect(() => {
    if (isConfirmed) {
      setAmountIn('')
      setAmountOut('')
      setIsApproved(false)
    }
  }, [isConfirmed])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content swap-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Swap</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* From Token */}
          <div className="swap-input-group">
            <label>From</label>
            <div className="swap-input-wrapper">
              <select
                className="token-select"
                value={tokenFrom}
                onChange={(e) => setTokenFrom(e.target.value as any)}
              >
                <option value="MUSD">MUSD</option>
                <option value="tBTC">tBTC</option>
                <option value="WBTC">WBTC</option>
                <option value="mUSDC">mUSDC</option>
                <option value="mUSDT">mUSDT</option>
              </select>
              <div className="swap-amount-wrapper">
                <input
                  type="number"
                  placeholder="0.00"
                  value={amountIn}
                  onChange={(e) => setAmountIn(e.target.value)}
                  step="0.001"
                  className={error && !amountIn ? 'error' : ''}
                />
                <button className="max-btn" onClick={handleMax}>
                  MAX
                </button>
              </div>
            </div>
            <div className="balance-hint">
              Balance: {parseFloat(fromBalance).toFixed(4)} {tokenFrom}
            </div>
          </div>

          {/* Swap Arrow */}
          <div className="swap-arrow-container">
            <button
              className="swap-arrow-btn"
              onClick={() => {
                const temp = tokenFrom
                setTokenFrom(tokenTo)
                setTokenTo(temp)
                setAmountIn('')
                setAmountOut('')
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>
          </div>

          {/* To Token */}
          <div className="swap-input-group">
            <label>To</label>
            <div className="swap-input-wrapper">
              <select
                className="token-select"
                value={tokenTo}
                onChange={(e) => setTokenTo(e.target.value as any)}
                disabled={tokenFrom === tokenTo}
              >
                <option value="MUSD">MUSD</option>
                <option value="tBTC">tBTC</option>
                <option value="WBTC">WBTC</option>
                <option value="mUSDC">mUSDC</option>
                <option value="mUSDT">mUSDT</option>
              </select>
              <div className="swap-amount-wrapper">
                <input
                  type="number"
                  placeholder="0.00"
                  value={amountOut}
                  onChange={(e) => setAmountOut(e.target.value)}
                  step="0.001"
                  className={error && !amountOut ? 'error' : ''}
                />
              </div>
            </div>
            <div className="balance-hint">
              Balance: {parseFloat(toBalance).toFixed(4)} {tokenTo}
            </div>
          </div>

          {/* Slippage Settings */}
          <div className="slippage-settings">
            <label>Slippage Tolerance</label>
            <div className="slippage-input-group">
              <input
                type="number"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                step="0.1"
                min="0"
                max="50"
              />
              <span>%</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth={2} />
                <line x1="15" y1="9" x2="9" y2="15" strokeWidth={2} />
                <line x1="9" y1="9" x2="15" y2="15" strokeWidth={2} />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {isConfirmed && (
            <div className="success-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth={2} />
                <path d="M9 12l2 2 4-4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <span>Swap successful! 🎉</span>
                {hash && (
                  <a
                    href={`https://explorer.test.mezo.org/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tx-link"
                  >
                    View on Explorer →
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!isApproved ? (
            <button
              className="btn-modal-primary"
              onClick={handleApprove}
              disabled={!amountIn || isLoading || isConfirming || isConfirmed}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Approving...
                </>
              ) : (
                `Approve ${tokenFrom}`
              )}
            </button>
          ) : (
            <button
              className="btn-modal-primary"
              onClick={handleSwap}
              disabled={!amountIn || !amountOut || isLoading || isConfirming || isConfirmed}
            >
              {isLoading || isConfirming ? (
                <>
                  <span className="spinner"></span>
                  Swapping...
                </>
              ) : isConfirmed ? (
                'Swapped! ✓'
              ) : (
                'Swap'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

