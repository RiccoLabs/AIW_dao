import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useAddTokens } from 'TokenVoterPlugin/hooks/useAddTokens'
import { BN } from '@coral-xyz/anchor'

// Semi-circular Gauge Component
const SemiCircularGauge: React.FC<{
  value: number
  maxValue: number
}> = ({ value, maxValue }) => {
  // Cap the percentage at 100% to prevent overflow
  const percentage = Math.min((value / maxValue) * 100, 100)

  // Calculate the angle for the arc based on percentage
  const angle = (percentage / 100) * 180

  // Calculate the end point of the arc using trigonometry
  const endAngle = (angle - 180) * (Math.PI / 180)
  const radius = 80
  const centerX = 100
  const centerY = 100

  // Calculate the end point coordinates
  const endX = centerX + radius * Math.cos(endAngle)
  const endY = centerY + radius * Math.sin(endAngle)

  // Create the arc path
  const arcPath = `M20,100 A80,80 0 ${angle > 90 ? 1 : 0},1 ${endX},${endY}`

  return (
    <div className="relative w-full h-40">
      <svg viewBox="0 0 200 100" className="w-full h-full">
        {/* Background arc */}
        <path
          d="M20,100 A80,80 0 0,1 180,100"
          fill="none"
          stroke="var(--bkg-4)"
          strokeWidth="12"
        />

        {/* Foreground arc - dynamic based on percentage */}
        <path
          d={arcPath}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00C6FF" />
            <stop offset="100%" stopColor="#FF00FF" />
          </linearGradient>
        </defs>

        {/* Center text */}
        <text
          x="100"
          y="85"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill="var(--fgd-1)"
        >
          {value > maxValue
            ? `${maxValue.toLocaleString()}+`
            : value.toLocaleString()}{' '}
          / {maxValue.toLocaleString()}
        </text>

        {/* Label */}
        <text
          x="100"
          y="65"
          textAnchor="middle"
          fontSize="12"
          fill="var(--fgd-3)"
        >
          Ricco Votes
        </text>
      </svg>
    </div>
  )
}

interface AIWGovernanceHeaderProps {
  governancePower?: number
  availableTokens?: number
}

const AIWGovernanceHeader: React.FC<AIWGovernanceHeaderProps> = ({
  governancePower = 0,
  availableTokens = 0,
}) => {
  const { publicKey, connected } = useWallet()
  const { mutateAsync: addTokensFn } = useAddTokens()

  // Use the governance power passed as prop (from "My governance power" section)
  const currentGovernancePower = connected ? governancePower : 0
  const maxVotingPower = 100000 // Set maximum to 100,000 as requested

  // Handle stake more AIW button click
  const handleStakeMoreClick = async () => {
    if (!connected) {
      // If wallet not connected, this will trigger wallet connection
      return
    }

    try {
      const power = await addTokensFn()
      if (power) {
        // The governance power will be updated automatically through the query invalidation
        console.log(
          'Tokens deposited successfully, new power:',
          power.toString(),
        )
      }
    } catch (error) {
      console.error('Error depositing tokens:', error)
    }
  }

  return (
    <div className="w-full bg-bkg-1 py-6">
      <div className="px-4 xl:px-4 md:px-8">
        <div className="flex flex-col sm:grid sm:grid-cols-12 relative">
          <div className="col-span-12 xl:col-start-2 xl:col-span-10">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <svg
                  className="w-8 h-8 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <div>
                  <h1 className="text-2xl font-bold text-fgd-1">
                    AIW DAO Governance
                  </h1>
                  <p className="text-fgd-3 text-sm">
                    Stake AIW tokens to participate in governance and earn
                    rewards
                  </p>
                </div>
              </div>
              <button className="px-6 py-2 border border-blue-400 text-blue-400 rounded-lg hover:bg-blue-400 hover:text-white transition-colors flex items-center space-x-2">
                <span>Apply for Project Listing</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </button>
            </div>

            {/* Three Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-transparent">
              {/* Card 1: AIW Staking */}
              <div className="bg-bkg-2 rounded-xl p-6 border border-bkg-4 shadow-sm transition-colors">
                <div className="flex items-center space-x-3 mb-6">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  <h3
                    className="text-lg font-bold text-fgd-1"
                    style={{ fontSize: '18px' }}
                  >
                    AIW Staking
                  </h3>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-fgd-3 text-sm">Staked Amount:</span>
                    <span className="text-fgd-1 font-semibold">
                      {connected
                        ? `${currentGovernancePower.toLocaleString()} AIW`
                        : '0 AIW'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-fgd-3 text-sm">
                      Tokens to deposit:
                    </span>
                    <span className="text-fgd-1 font-semibold">
                      {connected
                        ? `${availableTokens.toLocaleString()} AIW`
                        : '0 AIW'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleStakeMoreClick}
                  disabled={!connected || availableTokens <= 0}
                  className="w-full bg-gradient-to-r from-blue-400 to-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Stake More AIW
                </button>
              </div>

              {/* Card 2: Voting Power with Proper Gauge */}
              <div className="bg-bkg-2 rounded-xl p-6 border border-bkg-4 shadow-sm transition-colors">
                <div className="flex items-center space-x-3 mb-6">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <h3
                    className="text-lg font-bold text-fgd-1"
                    style={{ fontSize: '18px' }}
                  >
                    Voting Power
                  </h3>
                </div>

                <div className="flex justify-center mb-4">
                  <SemiCircularGauge
                    value={currentGovernancePower}
                    maxValue={maxVotingPower}
                  />
                </div>
              </div>

              {/* Card 3: Rewards */}
              <div className="bg-bkg-2 rounded-xl p-6 border border-bkg-4 shadow-sm transition-colors">
                <div className="flex items-center space-x-3 mb-6">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 3v18h18" />
                    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                  </svg>
                  <h3
                    className="text-lg font-semibold text-fgd-1"
                    style={{ fontSize: '18px' }}
                  >
                    Rewards
                  </h3>
                </div>

                {/* Rewards Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-bkg-4 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <svg
                        className="w-4 h-4 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="m22 21-2-2" />
                        <path d="M16 16.28A6 6 0 0 0 18 12h-4a4 4 0 0 0-3 3" />
                      </svg>
                      <span className="text-fgd-3 text-sm">
                        Used Voting Power
                      </span>
                    </div>
                    <div className="text-fgd-1 font-semibold text-lg">
                      0 votes
                    </div>
                  </div>

                  <div className="bg-bkg-4 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <svg
                        className="w-4 h-4 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 3v18h18" />
                        <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                      </svg>
                      <span className="text-fgd-3 text-sm">APY</span>
                    </div>
                    <div className="text-fgd-1 font-semibold text-xl">4.3%</div>
                  </div>
                </div>

                {/* Rewards Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-fgd-3 text-sm">Earned Rewards:</span>
                    <span className="text-fgd-1 font-semibold text-lg">
                      {connected
                        ? `${currentGovernancePower.toLocaleString()} AIW`
                        : '0 AIW'}
                    </span>
                  </div>

                  <button className="px-4 py-2 bg-bkg-4 text-fgd-1 rounded-lg font-medium hover:bg-bkg-5 transition-colors">
                    Claim
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIWGovernanceHeader
