import { ThemeProvider } from 'next-themes'
import dynamic from 'next/dynamic'
import React, { useEffect, useMemo } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import { useRouter } from 'next/router'
import { GatewayProvider } from '@components/Gateway/GatewayProvider'
import { VSR_PLUGIN_PKS } from '@constants/plugins'
import ErrorBoundary from '@components/ErrorBoundary'
import useHandleGovernanceAssetsStore from '@hooks/handleGovernanceAssetsStore'
import handleRouterHistory from '@hooks/handleRouterHistory'
import Navbar from '@components/NavBar'
import PageBodyContainer from '@components/PageBodyContainer'
import tokenPriceService from '@utils/services/tokenPrice'
import TransactionLoader from '@components/TransactionLoader'
import useDepositStore from 'VoteStakeRegistry/stores/useDepositStore'
import useRealm from '@hooks/useRealm'
import { DefiProvider } from '@hub/providers/Defi'
import NftVotingCountingModal from '@components/NftVotingCountingModal'
import useSerumGovStore from 'stores/useSerumGovStore'
import useWalletOnePointOh from '@hooks/useWalletOnePointOh'
import { useUserCommunityTokenOwnerRecord } from '@hooks/queries/tokenOwnerRecord'
import { useRealmQuery } from '@hooks/queries/realm'
import { useRealmConfigQuery } from '@hooks/queries/realmConfig'
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import useLegacyConnectionContext from '@hooks/useLegacyConnectionContext'
import { DEVNET_RPC, MAINNET_RPC } from 'constants/endpoints'
import {
  SquadsEmbeddedWalletAdapter,
  detectEmbeddedInSquadsIframe,
} from '@sqds/iframe-adapter'
import { WALLET_PROVIDERS } from '@utils/wallet-adapters'
import { useVsrClient } from '../VoterWeightPlugins/useVsrClient'
import { useRealmVoterWeightPlugins } from '@hooks/useRealmVoterWeightPlugins'
import PlausibleProvider from 'next-plausible'
import AIWGovernanceHeader from './AIWGovernanceHeader'
import FloatingThemeSwitch from './FloatingThemeSwitch'
import { useLegacyVoterWeight } from '@hooks/queries/governancePower'
import { useMintInfoByPubkeyQuery } from '@hooks/queries/mintInfo'
import {
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token-new'
import { useTokenAccountByKeyQuery } from 'TokenVoterPlugin/hooks/useTokenAccount'
import { PublicKey } from '@solana/web3.js'
import { BigNumber } from 'bignumber.js'

const Notifications = dynamic(() => import('../components/Notification'), {
  ssr: false,
})

const GoogleTag = React.memo(
  function GoogleTag() {
    return (
      <React.Fragment>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-TG90SK6TGB"
        />
        <Script id="gta-main">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-TG90SK6TGB');
        `}</Script>
      </React.Fragment>
    )
  },
  () => true,
)

interface Props {
  children: React.ReactNode
}

/** AppContents depends on providers itself, sadly, so this is where providers go.  */
export function App(props: Props) {
  const router = useRouter()
  const { cluster } = router.query

  const endpoint = useMemo(
    () => (cluster === 'devnet' ? DEVNET_RPC : MAINNET_RPC),
    [cluster],
  )

  const supportedWallets = useMemo(
    () =>
      detectEmbeddedInSquadsIframe()
        ? [new SquadsEmbeddedWalletAdapter()]
        : WALLET_PROVIDERS.map((provider) => provider.adapter),
    [],
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={supportedWallets}>
        <AppContents {...props} />{' '}
      </WalletProvider>
    </ConnectionProvider>
  )
}

const allowedFaviconPaths = ['/realms/']
const allowedDomains = [
  'https://app.realms.today',
  'http://localhost',
  'http://localhost:3000',
]

export function AppContents(props: Props) {
  handleRouterHistory()
  useHandleGovernanceAssetsStore()
  useEffect(() => {
    tokenPriceService.fetchSolanaTokenListV2()
  }, [])

  const { getOwnedDeposits, resetDepositState } = useDepositStore()

  const { plugins } = useRealmVoterWeightPlugins('community')
  const usesVsr = plugins?.voterWeight.find((plugin) =>
    VSR_PLUGIN_PKS.includes(plugin.programId.toString()),
  )
  const ownTokenRecord = useUserCommunityTokenOwnerRecord().data?.result

  const realm = useRealmQuery().data?.result
  const config = useRealmConfigQuery().data?.result

  const { realmInfo } = useRealm()
  const wallet = useWalletOnePointOh()
  const connection = useLegacyConnectionContext()

  // Calculate governance power for AIW DAO using the same method as "My governance power" section
  const { result: voterWeight, ready } = useLegacyVoterWeight()

  // Get plugin mint key (same as TokenVoterPlugin)
  const { plugins: communityPlugins } = useRealmVoterWeightPlugins('community')
  const pluginParams = communityPlugins?.voterWeight[0]?.params as any
  const pluginMintKey = pluginParams?.votingMintConfigs?.[0]?.mint ?? undefined

  const mintInfo = useMintInfoByPubkeyQuery(pluginMintKey).data?.result

  const ataKey = getAssociatedTokenAddressSync(
    pluginMintKey ?? PublicKey.default,
    wallet?.publicKey ?? PublicKey.default,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  )
  const userPluginAta = useTokenAccountByKeyQuery(ataKey).data

  const governancePower = useMemo(() => {
    if (ready && voterWeight && mintInfo) {
      // Get the community governance power from the voter weight
      const communityPower = (voterWeight as any).voterWeights?.community

      if (communityPower) {
        // Format the value using mint decimals (same as VanillaVotingPower)
        const formattedValue = new BigNumber(communityPower.toString())
          .shiftedBy(-mintInfo.decimals)
          .toNumber()
        return formattedValue
      }
    }
    return 0
  }, [voterWeight, ready, mintInfo])

  const availableTokens = useMemo(() => {
    // Only calculate if wallet is connected and data is available
    if (wallet?.connected && mintInfo && userPluginAta?.amount) {
      const tokens = new BigNumber(userPluginAta.amount.toString())
        .shiftedBy(-mintInfo.decimals)
        .toNumber()
      return tokens
    }

    // Return 0 if wallet not connected or data not ready
    return 0
  }, [mintInfo, userPluginAta, wallet?.connected])

  const router = useRouter()
  const { cluster } = router.query
  const updateSerumGovAccounts = useSerumGovStore(
    (s) => s.actions.updateSerumGovAccounts,
  )
  const { vsrClient } = useVsrClient()

  const title = 'AIW - Decentralized Finance Platform'

  useEffect(() => {
    if (
      realm &&
      usesVsr &&
      realm.pubkey &&
      wallet?.connected &&
      ownTokenRecord &&
      vsrClient
    ) {
      getOwnedDeposits({
        realmPk: realm.pubkey,
        communityMintPk: realm.account.communityMint,
        walletPk: ownTokenRecord!.account!.governingTokenOwner,
        client: vsrClient,
        connection: connection.current,
      })
    } else if (!wallet?.connected || !ownTokenRecord) {
      resetDepositState()
    }
  }, [
    config?.account.communityTokenConfig.voterWeightAddin,
    connection,
    getOwnedDeposits,
    ownTokenRecord,
    realm,
    resetDepositState,
    vsrClient,
    wallet?.connected,
  ])

  useEffect(() => {
    updateSerumGovAccounts(cluster as string | undefined)
  }, [cluster, updateSerumGovAccounts])

  return (
    <div
      className="relative text-fgd-1 min-h-screen"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <Head>
        <meta property="og:title" content={title} key="title" />
        <title>{title}</title>
        <style>{`
          body {
            background-color: var(--bg-primary);
            min-height: 100vh;
          }
        `}</style>
      </Head>
      <GoogleTag />
      <ErrorBoundary>
        <ThemeProvider defaultTheme="Dark">
          <GatewayProvider>
            <Telemetry></Telemetry>
            <Navbar />
            {/* Spacer to prevent content from being hidden behind fixed navbar */}
            <div className="h-20"></div>
            {realm && (
              <AIWGovernanceHeader
                governancePower={governancePower}
                availableTokens={availableTokens}
              />
            )}
            <Notifications />
            <TransactionLoader></TransactionLoader>
            <NftVotingCountingModal />
            <PageBodyContainer>
              <DefiProvider>{props.children}</DefiProvider>
            </PageBodyContainer>
            <FloatingThemeSwitch />
          </GatewayProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </div>
  )
}

const Telemetry = () => {
  const { wallet } = useWallet()

  const telemetryProps = useMemo(() => {
    if (typeof document !== 'undefined') {
      const props = {
        walletProvider: wallet?.adapter.name ?? 'unknown',
        walletConnected: (wallet?.adapter.connected ?? 'false').toString(),
      }

      // Hack to update script tag
      const el = document.getElementById('plausible')
      if (el) {
        Object.entries(props).forEach(([key, value]) => {
          el.setAttribute(`event-${key}`, value)
        })
      }

      return props
    } else {
      return {}
    }
  }, [wallet?.adapter.name, wallet?.adapter.connected])

  return (
    <PlausibleProvider
      domain="realms.today"
      customDomain="https://pl.cabana-exchange.cloud"
      trackLocalhost={true}
      selfHosted={true}
      enabled={true}
      scriptProps={{ id: 'plausible' }}
      pageviewProps={telemetryProps}
    />
  )
}
