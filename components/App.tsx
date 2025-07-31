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
import Navbar from '@components/Navbar'
import PageBodyContainer from '@components/PageBodyContainer'
import tokenPriceService from '@utils/services/tokenPrice'
import TransactionLoader from '@components/TransactionLoader'
import useDepositStore from 'VoteStakeRegistry/stores/useDepositStore'
import useRealm from '@hooks/useRealm'
import { DefiProvider } from '@hub/providers/Defi'
import NftVotingCountingModal from '@components/NftVotingCountingModal'
import { getResourcePathPart } from '@tools/core/resources'
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
import { tryParsePublicKey } from '@tools/core/pubkey'
import { useAsync } from 'react-async-hook'
import { useVsrClient } from '../VoterWeightPlugins/useVsrClient'
import { useRealmVoterWeightPlugins } from '@hooks/useRealmVoterWeightPlugins'
import TermsPopupModal from './TermsPopup'
import PlausibleProvider from 'next-plausible'
import AIWGovernanceHeader from './AIWGovernanceHeader'
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

  const realmName = realmInfo?.displayName ?? realm?.account?.name
  const title = realmName ? `${realmName}` : 'AIW DAO'

  // Note: ?v==${Date.now()} is added to the url to force favicon refresh.
  // Without it browsers would cache the last used and won't change it for different realms
  // https://stackoverflow.com/questions/2208933/how-do-i-force-a-favicon-refresh

  const faviconUrl = useMemo(() => {
    const symbol = router.query.symbol

    if (!symbol || tryParsePublicKey(symbol as string) !== undefined) {
      return null
    }
    if (!isValidSymbol(symbol)) {
      console.error('Invalid symbol')
      return null
    }

    const resourcePath = getResourcePathPart(symbol as string)
    const fullUrl = `${
      window.location.origin
    }/realms/${resourcePath}/favicon.ico?v=${Date.now()}`

    // Check if the domain is in the allow list
    try {
      const urlObject = new URL(fullUrl)
      if (!allowedDomains.includes(urlObject.origin)) {
        console.error('Domain not in allowed list')
        return null
      }
      // Check if the path is in the allow list
      if (
        !allowedFaviconPaths.some((path) => urlObject.pathname.startsWith(path))
      ) {
        console.error('Path not in allowed list')
        return null
      }

      return urlObject.href
    } catch (error) {
      console.error('Invalid URL:', error)
      return null
    }
  }, [router.query.symbol])

  // Validate it's an ico file
  function isValidSymbol(symbol) {
    return (
      typeof symbol === 'string' &&
      symbol.trim() !== '' &&
      /^[a-zA-Z0-9-_]+$/.test(symbol)
    )
  }
  const { result: faviconExists } = useAsync(async () => {
    if (!faviconUrl) {
      return false
    }

    try {
      const response = await fetch(faviconUrl)
      return response.status === 200
    } catch (error) {
      console.error('Error fetching favicon:', error)
      return false
    }
  }, [faviconUrl])

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
    <div className="relative bg-bkg-1 text-fgd-1 min-h-screen">
      <Head>
        <meta property="og:title" content={title} key="title" />
        <title>{title}</title>
        <style>{`
          body {
            background-color: var(--bg-primary);
            min-height: 100vh;
          }
        `}</style>
        {faviconUrl && faviconExists ? (
          <>
            <link rel="icon" href={faviconUrl} />
          </>
        ) : (
          <>
            <link
              rel="apple-touch-icon"
              sizes="57x57"
              href="/favicons/apple-icon-57x57.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="60x60"
              href="/favicons/apple-icon-60x60.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="72x72"
              href="/favicons/apple-icon-72x72.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="76x76"
              href="/favicons/apple-icon-76x76.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="114x114"
              href="/favicons/apple-icon-114x114.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="120x120"
              href="/favicons/apple-icon-120x120.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="144x144"
              href="/favicons/apple-icon-144x144.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="152x152"
              href="/favicons/apple-icon-152x152.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/favicons/apple-icon-180x180.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="192x192"
              href="/favicons/android-icon-192x192.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicons/favicon-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="96x96"
              href="/favicons/favicon-96x96.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/favicons/favicon-16x16.png"
            />
          </>
        )}
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
            <TermsPopupModal />
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
