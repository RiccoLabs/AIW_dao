import useQueryContext from '@hooks/useQueryContext'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import {
  GlobeAltIcon,
  ChartBarIcon,
  ViewBoardsIcon,
  BeakerIcon,
  DocumentTextIcon,
  BellIcon,
  RssIcon,
  BookmarkIcon,
  DocumentReportIcon,
  StarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CogIcon,
  ShareIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  FireIcon,
  LockClosedIcon,
  GiftIcon,
} from '@heroicons/react/outline'
import { MenuIcon, XIcon } from '@heroicons/react/solid'

const ConnectWalletButtonDynamic = dynamic(
  async () => await import('./ConnectWalletButton'),
  { ssr: false },
)

interface NavItem {
  name: string
  path: string
  icon: React.ReactNode
  subItems?: NavItem[]
}

interface NavSection {
  title: string
  items: NavItem[]
}

const NavBar = () => {
  const { fmtUrlWithCluster } = useQueryContext()
  const router = useRouter()
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null)
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  // Navigation structure
  const navSections: NavSection[] = [
    {
      title: 'Explorer',
      items: [
        {
          name: 'Official Portfolio',
          path: '/official-portfolio',
          icon: <GlobeAltIcon className="h-3 w-3" />,
        },
        {
          name: 'Public Equities',
          path: '/public-equities',
          icon: <ChartBarIcon className="h-3 w-3" />,
        },
        {
          name: 'Start-up',
          path: '/startup',
          icon: <GlobeAltIcon className="h-3 w-3" />,
        },
      ],
    },
    {
      title: 'Collection',
      items: [
        {
          name: 'AIW Collection',
          path: '/aiw-collection',
          icon: <ViewBoardsIcon className="h-3 w-3" />,
        },
        {
          name: 'Relate Collection',
          path: '/relate-collection',
          icon: <ViewBoardsIcon className="h-3 w-3" />,
        },
      ],
    },
    {
      title: 'Program',
      items: [
        {
          name: 'Pool',
          path: '/pool',
          icon: <BeakerIcon className="h-3 w-3" />,
        },
        {
          name: 'DAO',
          path: '/dao',
          icon: <GlobeAltIcon className="h-3 w-3" />,
        },
        {
          name: 'GrowthLab',
          path: '/growth-lab',
          icon: <DocumentTextIcon className="h-3 w-3" />,
        },
      ],
    },
    {
      title: 'Pulse',
      items: [
        {
          name: 'Notice',
          path: '/notice',
          icon: <BellIcon className="h-3 w-3" />,
        },
        {
          name: 'SNS',
          path: '/sns',
          icon: <GlobeAltIcon className="h-3 w-3" />,
        },
        { name: 'Feed', path: '/feed', icon: <RssIcon className="h-3 w-3" /> },
        {
          name: 'Bookmark',
          path: '/bookmark',
          icon: <BookmarkIcon className="h-3 w-3" />,
        },
      ],
    },
    {
      title: 'InSight',
      items: [
        {
          name: 'Company InSight',
          path: '/company-insight',
          icon: <GlobeAltIcon className="h-3 w-3" />,
        },
        {
          name: 'Investment Report',
          path: '/investment-report',
          icon: <DocumentReportIcon className="h-3 w-3" />,
        },
        {
          name: 'Premium InSight',
          path: '/premium-insight',
          icon: <StarIcon className="h-3 w-3" />,
          subItems: [
            {
              name: 'Market Trends',
              path: '/premium/market-trends',
              icon: <TrendingUpIcon className="h-3 w-3" />,
            },
            {
              name: 'Top Performing Portfolios',
              path: '/premium/top-portfolios',
              icon: <StarIcon className="h-3 w-3" />,
            },
            {
              name: 'DAO Voting Analytics',
              path: '/premium/dao-analytics',
              icon: <ChartBarIcon className="h-3 w-3" />,
            },
            {
              name: 'Market Trends',
              path: '/premium/market-trends-2',
              icon: <TrendingDownIcon className="h-3 w-3" />,
            },
          ],
        },
      ],
    },
    {
      title: 'More',
      items: [
        {
          name: 'Setting',
          path: '/setting',
          icon: <CogIcon className="h-3 w-3" />,
        },
        {
          name: 'Bridge',
          path: '/bridge',
          icon: <ShareIcon className="h-3 w-3" />,
        },
        {
          name: 'Loan',
          path: '/loan',
          icon: <CurrencyDollarIcon className="h-3 w-3" />,
        },
        {
          name: 'Event',
          path: '/event',
          icon: <CalendarIcon className="h-3 w-3" />,
        },
        {
          name: 'Tools',
          path: '/tools',
          icon: <CogIcon className="h-3 w-3" />,
          subItems: [
            {
              name: 'Wallet Check',
              path: '/tools/wallet-check',
              icon: <GlobeAltIcon className="h-3 w-3" />,
            },
            {
              name: 'Token Burn',
              path: '/tools/token-burn',
              icon: <FireIcon className="h-3 w-3" />,
            },
            {
              name: 'Token Lock',
              path: '/tools/token-lock',
              icon: <LockClosedIcon className="h-3 w-3" />,
            },
            {
              name: 'Token Airdrop',
              path: '/tools/token-airdrop',
              icon: <GiftIcon className="h-3 w-3" />,
            },
          ],
        },
      ],
    },
  ]

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle clicks outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenuIndex(null)
        setOpenSubMenuIndex(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setOpenMenuIndex(null)
    setOpenSubMenuIndex(null)
  }, [router.pathname])

  const handleMenuToggle = (index: number) => {
    if (openMenuIndex === index) {
      setOpenMenuIndex(null)
      setOpenSubMenuIndex(null)
    } else {
      setOpenMenuIndex(index)
      setOpenSubMenuIndex(null)
    }
  }

  const handleSubMenuToggle = (e: React.MouseEvent, itemPath: string) => {
    e.stopPropagation()
    if (openSubMenuIndex === itemPath) {
      setOpenSubMenuIndex(null)
    } else {
      setOpenSubMenuIndex(itemPath)
    }
  }

  const handleNavigate = (path: string) => {
    router.push(path)
    setOpenMenuIndex(null)
    setOpenSubMenuIndex(null)
  }

  // Check if a path is active
  const isPathActive = (path: string) => {
    return router.pathname === path
  }

  // Check if a section is active
  const isSectionActive = (section: NavSection) => {
    return section.items.some(
      (item) =>
        isPathActive(item.path) ||
        item.subItems?.some((subItem) => isPathActive(subItem.path)),
    )
  }

  return (
    <>
      <nav
        ref={navRef}
        className={`w-full fixed top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-gray-900/95 backdrop-blur-sm shadow-md'
            : 'bg-gray-900 border-b border-gray-700'
        }`}
      >
        <div className="flex flex-col sm:grid sm:grid-cols-12 relative z-20">
          <div className="flex items-center justify-between h-20 col-span-12 px-4 xl:col-start-2 xl:col-span-10 md:px-8 xl:px-4">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <Link
                href="/realms"
                className="font-bold text-xl flex items-center hover:opacity-80 transition-opacity"
              >
                <img
                  src="https://i.ibb.co/8yybjn9/AIW.png"
                  alt="AIW Logo"
                  className="transition-all duration-300 h-7 w-auto filter-none"
                />
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-7">
                {navSections.map((section, index) => (
                  <div key={index} className="relative group">
                    <button
                      className={`flex items-center text-sm cursor-pointer transition-colors ${
                        isSectionActive(section)
                          ? 'text-blue-400'
                          : 'text-white hover:text-blue-400'
                      }`}
                      onClick={() => handleMenuToggle(index)}
                    >
                      {section.title}
                      <ChevronDownIcon className="w-4 h-4 ml-1" />
                    </button>
                    {/* Dropdown Menu */}
                    {openMenuIndex === index && (
                      <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 border border-gray-700 z-50">
                        <div className="py-2">
                          {section.items.map((item, itemIndex) => (
                            <div key={itemIndex}>
                              {item.subItems ? (
                                <div>
                                  <button
                                    onClick={(e) =>
                                      handleSubMenuToggle(e, item.path)
                                    }
                                    className={`block w-full text-left px-4 py-2.5 text-sm font-semibold flex items-center justify-between ${
                                      isPathActive(item.path) ||
                                      item.subItems.some((subItem) =>
                                        isPathActive(subItem.path),
                                      )
                                        ? 'bg-blue-500/10 text-blue-500'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-blue-500'
                                    }`}
                                  >
                                    <div className="flex items-center">
                                      <span className="mr-2 text-blue-500">
                                        {item.icon}
                                      </span>
                                      {item.name}
                                    </div>
                                    <ChevronDownIcon
                                      className={`h-3 w-3 transition-transform ${
                                        openSubMenuIndex === item.path
                                          ? 'rotate-180'
                                          : ''
                                      }`}
                                    />
                                  </button>
                                  {/* Submenu */}
                                  <div
                                    className={`overflow-hidden transition-all duration-200 ${
                                      openSubMenuIndex === item.path
                                        ? 'max-h-60'
                                        : 'max-h-0'
                                    }`}
                                  >
                                    <div className="py-1 bg-gray-700 mx-2 my-1 rounded-md">
                                      {item.subItems.map(
                                        (subItem, subIndex) => (
                                          <button
                                            key={subIndex}
                                            onClick={() =>
                                              handleNavigate(subItem.path)
                                            }
                                            className={`block w-full text-left px-4 py-2 text-sm flex items-center ${
                                              isPathActive(subItem.path)
                                                ? 'text-blue-500 font-medium'
                                                : 'text-gray-300 hover:text-blue-500'
                                            }`}
                                          >
                                            <span className="mr-2 text-blue-500">
                                              {subItem.icon}
                                            </span>
                                            {subItem.name}
                                          </button>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleNavigate(item.path)}
                                  className={`block w-full text-left px-4 py-2.5 text-sm font-semibold flex items-center ${
                                    isPathActive(item.path)
                                      ? 'bg-blue-500/10 text-blue-500'
                                      : 'text-gray-300 hover:bg-gray-700 hover:text-blue-500'
                                  }`}
                                >
                                  <span className="mr-2 text-blue-500">
                                    {item.icon}
                                  </span>
                                  {item.name}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Wallet Connect Button and Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Wallet Connect Button */}
              <ConnectWalletButtonDynamic />
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-blue-500 focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <XIcon className="block h-5 w-5" />
                ) : (
                  <MenuIcon className="block h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900 border-b border-gray-700">
            {navSections.map((section, index) => (
              <div key={index}>
                <button
                  onClick={() => handleMenuToggle(index)}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium ${
                    isSectionActive(section)
                      ? 'text-blue-500'
                      : 'text-gray-200 hover:text-blue-500'
                  }`}
                >
                  <span>{section.title}</span>
                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform ${
                      openMenuIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {/* Mobile Dropdown */}
                <div
                  className={`pl-4 space-y-2 overflow-hidden transition-all duration-200 ${
                    openMenuIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      {item.subItems ? (
                        <div className="space-y-2">
                          <button
                            className={`flex items-center justify-between w-full px-3 py-1 rounded-md text-sm font-semibold ${
                              isPathActive(item.path) ||
                              item.subItems.some((s) => isPathActive(s.path))
                                ? 'bg-blue-500/10 text-blue-500'
                                : 'text-gray-300 hover:text-blue-500'
                            }`}
                            onClick={(e) => handleSubMenuToggle(e, item.path)}
                          >
                            <div className="flex items-center">
                              <span className="mr-2 text-blue-500">
                                {item.icon}
                              </span>
                              {item.name}
                            </div>
                            <ChevronDownIcon
                              className={`h-3 w-3 transition-transform ${
                                openSubMenuIndex === item.path
                                  ? 'rotate-180'
                                  : ''
                              }`}
                            />
                          </button>
                          {/* Nested submenu */}
                          <div
                            className={`pl-4 space-y-2 overflow-hidden transition-all duration-200 ${
                              openSubMenuIndex === item.path
                                ? 'max-h-60'
                                : 'max-h-0'
                            }`}
                          >
                            {item.subItems.map((subItem, subIndex) => (
                              <button
                                key={subIndex}
                                onClick={() => handleNavigate(subItem.path)}
                                className={`flex items-center w-full px-3 py-1 rounded-md text-sm ${
                                  isPathActive(subItem.path)
                                    ? 'text-blue-500 font-medium'
                                    : 'text-gray-300 hover:text-blue-500'
                                }`}
                              >
                                <span className="mr-2 text-blue-500">
                                  {subItem.icon}
                                </span>
                                {subItem.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleNavigate(item.path)}
                          className={`flex items-center w-full px-3 py-1 rounded-md text-sm font-semibold ${
                            isPathActive(item.path)
                              ? 'bg-blue-500/10 text-blue-500'
                              : 'text-gray-300 hover:text-blue-500'
                          }`}
                        >
                          <span className="mr-2 text-blue-500">
                            {item.icon}
                          </span>
                          {item.name}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-20"></div>

      {/* Separator line after navbar - full width */}
      <div className="border-b border-gray-700 w-full"></div>
    </>
  )
}

export default NavBar
