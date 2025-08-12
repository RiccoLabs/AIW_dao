import { useRouter } from 'next/router'
import styled from '@emotion/styled'
import { Menu } from '@headlessui/react'
import {
  BackspaceIcon,
  CheckCircleIcon,
  ChevronDownIcon,
} from '@heroicons/react/solid'
import { abbreviateAddress } from '@utils/formatting'
import { useCallback, useEffect, useState } from 'react'
import Switch from './Switch'
import { notify } from '@utils/notifications'
import { Profile, ProfileImage } from '@components/Profile'
import Loading from './Loading'
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base'
import { useWallet } from '@solana/wallet-adapter-react'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import { DEFAULT_PROVIDER } from '../utils/wallet-adapters'
import useViewAsWallet from '@hooks/useViewAsWallet'
import { ProfileName } from '@components/Profile/ProfileName'
import { usePlausible } from 'next-plausible'

const StyledWalletProviderLabel = styled.p`
  font-size: 0.65rem;
  line-height: 1.5;
`

const ConnectWalletButton = (props) => {
  const { pathname, query, replace } = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const debugAdapter = useViewAsWallet()
  const plausible = usePlausible()
  const {
    wallets,
    select,
    disconnect,
    connect,
    wallet,
    publicKey: realPublicKey,
    connected,
  } = useWallet()

  const publicKey = debugAdapter?.publicKey ?? realPublicKey

  useEffect(() => {
    if (wallet === null) select(DEFAULT_PROVIDER.name as WalletName)
  }, [select, wallet])

  const handleConnectDisconnect = useCallback(async () => {
    setIsLoading(true)
    try {
      if (connected) {
        await disconnect()
      } else {
        await connect()
        try {
          plausible('ConnectWallet', {
            props: {
              walletConnected: wallet?.adapter?.publicKey?.toString(),
              walletProvider: wallet?.adapter?.name,
            },
          })
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }
    } catch (e: any) {
      if (e.name === 'WalletNotReadyError') {
        notify({
          type: 'error',
          message: 'You must have a wallet installed to connect',
        })
      }
      console.warn('handleConnectDisconnect', e)
    }
    setIsLoading(false)
  }, [connect, connected, disconnect])

  const currentCluster = query.cluster

  function updateClusterParam(cluster) {
    const newQuery = {
      ...query,
      cluster,
    }
    if (!cluster) {
      delete newQuery.cluster
    }
    replace({ pathname, query: newQuery }, undefined, {
      shallow: true,
    })
  }

  function handleToggleDevnet() {
    updateClusterParam(currentCluster !== 'devnet' ? 'devnet' : null)
  }

  const walletAddressFormatted = publicKey ? abbreviateAddress(publicKey) : ''

  return (
    <div className="flex">
      <div
        disabled={connected}
        className={`flex items-center bg-neon-gradient text-white px-3 py-1 text-sm font-medium rounded-md transition-all duration-300 ${
          connected
            ? 'cursor-default'
            : 'cursor-pointer hover:shadow-lg focus:outline-none'
        }`}
        onClick={handleConnectDisconnect}
        {...props}
      >
        <div className="relative flex items-center text-white font-medium">
          {debugAdapter ? (
            <div className="absolute -left-4 h-full text-red-400 opacity-90 pointer-events-none text-2xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] -rotate-45">
              DEBUG
            </div>
          ) : null}
          {connected && publicKey ? (
            <div className="flex items-center">
              <div className="w-5 h-5 flex items-center justify-center mr-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 108 108"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M46.5267 69.9229C42.0054 76.8509 34.4292 85.6182 24.348 85.6182C19.5824 85.6182 15 83.6563 15 75.1342C15 53.4305 44.6326 19.8327 72.1268 19.8327C87.768 19.8327 94 30.6846 94 43.0079C94 58.8258 83.7355 76.9122 73.5321 76.9122C70.2939 76.9122 68.7053 75.1342 68.7053 72.314C68.7053 71.5783 68.8275 70.7812 69.0719 69.9229C65.5893 75.8699 58.8685 81.3878 52.5754 81.3878C47.993 81.3878 45.6713 78.5063 45.6713 74.4598C45.6713 72.9884 45.9768 71.4556 46.5267 69.9229ZM83.6761 42.5794C83.6761 46.1704 81.5575 47.9658 79.1875 47.9658C76.7816 47.9658 74.6989 46.1704 74.6989 42.5794C74.6989 38.9885 76.7816 37.1931 79.1875 37.1931C81.5575 37.1931 83.6761 38.9885 83.6761 42.5794ZM70.2103 42.5795C70.2103 46.1704 68.0916 47.9658 65.7216 47.9658C63.3157 47.9658 61.233 46.1704 61.233 42.5795C61.233 38.9885 63.3157 37.1931 65.7216 37.1931C68.0916 37.1931 70.2103 38.9885 70.2103 42.5795Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div className="text-xs">
                <div className="font-medium">{walletAddressFormatted}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <div>{isLoading ? <Loading></Loading> : 'Select Wallet'}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConnectWalletButton
