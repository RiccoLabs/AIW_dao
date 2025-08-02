import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import {
  Menu,
  X,
  ChevronDown,
  Compass,
  BarChart3,
  Rocket,
  Layers,
  Palette,
  Droplets,
  Landmark,
  Receipt,
  Bell,
  MessageSquare,
  Rss,
  Bookmark,
  Building2,
  Star,
  FileText,
  TrendingUp,
  PieChart,
  BarChart,
  LineChart,
  Settings,
  Share2,
  Banknote,
  Calendar,
  Wrench,
  Wallet,
  Flame,
  Lock,
  Gift,
  BadgeCheck,
} from 'lucide-react'
import { routes } from '../env'
import ConnectWalletButton from './ConnectWalletButton'
import ThemeSwitch from './ThemeSwitch'

interface NavItem {
  name: string
  path: string
  icon: React.ReactNode
  emoji?: string
  subItems?: NavItem[]
}

interface NavItemProps {
  title: string
  items?: NavItem[]
  onNavigate: (path: string) => void
  isOpen: boolean
  onToggle: () => void
  currentTheme: string
  activePage: string
  index: number
  isDark: boolean
}

interface NavbarProps {
  currentTheme?: string
}

const NavItem: React.FC<NavItemProps> = ({
  title,
  items,
  onNavigate,
  isOpen,
  onToggle,
  currentTheme,
  activePage,
  index,
  isDark,
}) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null)
  const router = useRouter()

  // 페이지 이동 시 서브 메뉴 초기화
  useEffect(() => {
    setOpenSubMenu(null)
  }, [router.pathname])

  // Check if any of the subitems match the active page
  const isActiveParent = items?.some(
    (item) =>
      item.path === activePage ||
      item.subItems?.some((subItem) => subItem.path === activePage),
  )

  const handleSubMenuToggle = (e: React.MouseEvent, path: string) => {
    e.stopPropagation()
    setOpenSubMenu(openSubMenu === path ? null : path)
  }

  return (
    <div className="relative group" ref={menuRef}>
      <button
        className={`flex items-center px-3 py-1.5 text-sm text-fgd-2 hover:text-neonBlue transition-colors ${
          isActiveParent ? 'text-neonBlue' : ''
        }`}
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
      >
        {title}
        {items && items.length > 0 && <ChevronDown className="ml-1 h-3 w-3" />}
      </button>

      {items && items.length > 0 && (
        <div
          className={`absolute left-0 mt-1 w-48 rounded-md z-50 transform transition-all duration-200 ${
            isOpen
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
          style={{
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            borderColor: isDark ? '#374151' : '#d1d5db',
            borderWidth: '1px',
            borderStyle: 'solid',
            boxShadow:
              '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div className="py-2">
            {items.map((item, index) => (
              <div key={index}>
                {item.subItems ? (
                  <div>
                    <button
                      onClick={(e) => handleSubMenuToggle(e, item.path)}
                      className={`block w-full text-left px-4 py-2.5 text-sm font-semibold ${
                        activePage === item.path ||
                        item.subItems.some(
                          (subItem) => subItem.path === activePage,
                        )
                          ? 'bg-neonBlue/10 text-neonBlue'
                          : isDark
                          ? 'text-gray-300 hover:bg-gray-600 hover:text-neonBlue'
                          : 'text-grayBlue hover:bg-gray-200 hover:text-neonBlue'
                      } flex items-center justify-between`}
                    >
                      <div className="flex items-center">
                        <span
                          className={`mr-2 ${
                            activePage === item.path
                              ? 'text-neonBlue'
                              : 'text-neonBlue'
                          }`}
                        >
                          {item.emoji ? (
                            <span className="text-lg" aria-hidden="false">
                              {item.emoji}
                            </span>
                          ) : (
                            item.icon
                          )}
                        </span>
                        {item.name}
                      </div>
                      <ChevronDown
                        className={`h-3 w-3 transition-transform ${
                          openSubMenu === item.path ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Submenu */}
                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        openSubMenu === item.path ? 'max-h-60' : 'max-h-0'
                      }`}
                    >
                      <div
                        className="py-1 mx-2 my-1 rounded-md"
                        style={{
                          backgroundColor: isDark ? '#374151' : '#f3f4f6',
                        }}
                      >
                        {item.subItems.map((subItem, subIndex) => (
                          <button
                            key={subIndex}
                            onClick={() => onNavigate(subItem.path)}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              activePage === subItem.path
                                ? 'text-neonBlue font-medium'
                                : isDark
                                ? 'text-gray-300 hover:text-neonBlue'
                                : 'text-grayBlue hover:text-neonBlue'
                            } flex items-center`}
                          >
                            <span
                              className="mr-2 text-lg"
                              aria-hidden={subItem.emoji ? 'false' : 'true'}
                            >
                              {subItem.emoji || (
                                <span className="text-neonBlue">
                                  {subItem.icon}
                                </span>
                              )}
                            </span>
                            {subItem.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => onNavigate(item.path)}
                    className={`block w-full text-left px-4 py-2.5 text-sm font-semibold ${
                      activePage === item.path
                        ? 'bg-neonBlue/10 text-neonBlue'
                        : isDark
                        ? 'text-gray-300 hover:bg-gray-600 hover:text-neonBlue'
                        : 'text-grayBlue hover:bg-gray-200 hover:text-neonBlue'
                    } flex items-center`}
                  >
                    <span
                      className={`mr-2 ${
                        activePage === item.path
                          ? 'text-neonBlue'
                          : 'text-neonBlue'
                      }`}
                    >
                      {item.emoji ? (
                        <span className="text-lg" aria-hidden="false">
                          {item.emoji}
                        </span>
                      ) : (
                        item.icon
                      )}
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
  )
}

const Navbar: React.FC<NavbarProps> = ({ currentTheme }) => {
  const { theme, resolvedTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activePage, setActivePage] = useState('officialPortfolio')
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const router = useRouter()

  // Use theme from context if not provided as prop, with proper fallback
  const actualTheme =
    currentTheme || (resolvedTheme === 'Dark' ? 'dark' : 'light')
  const isDark = mounted ? actualTheme === 'dark' : false

  // Ensure component is mounted before rendering theme-dependent content
  useEffect(() => {
    setMounted(true)
  }, [])

  // For mobile menu - track which sections are expanded
  const [expandedSections, setExpandedSections] = useState<number[]>([])

  // 페이지 이동 시 모바일 메뉴 초기화
  useEffect(() => {
    setIsMenuOpen(false)
    setOpenMenuIndex(null)
    setExpandedSections([])
  }, [router.pathname])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Close any open menus when scrolling
      if (openMenuIndex !== null) {
        setOpenMenuIndex(null)
      }

      // Determine if we're scrolling up or down
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        if (currentScrollY > 100 && !hidden) {
          setHidden(true)
        }
      } else {
        // Scrolling up
        setHidden(false)
      }

      // Set scrolled state for styling
      if (currentScrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, hidden, openMenuIndex])

  // Handle clicks outside of the menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenuIndex(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Update active page based on location
  useEffect(() => {
    const path = router.pathname
    setActivePage(path)
  }, [router.pathname])

  // Define your navigation items here
  const navItems = [
    {
      title: 'Explorer',
      items: [
        {
          name: 'Official Portfolio',
          path: routes[0],
          icon: <Compass className="h-3 w-3" />,
        },
        {
          name: 'Public Equities',
          path: routes[1],
          icon: <BarChart3 className="h-3 w-3" />,
        },
        {
          name: 'Start-up',
          path: routes[2],
          icon: <Rocket className="h-3 w-3" />,
        },
      ],
    },
    {
      title: 'Collection',
      items: [
        {
          name: 'AIW Collection',
          path: routes[3],
          icon: <Layers className="h-3 w-3" />,
        },
        {
          name: 'Relate Collection',
          path: routes[4],
          icon: <Palette className="h-3 w-3" />,
        },
      ],
    },
    {
      title: 'Program',
      items: [
        {
          name: 'Pool',
          path: routes[5],
          icon: <Droplets className="h-3 w-3" />,
        },
        {
          name: 'DAO',
          path: routes[6],
          icon: <Landmark className="h-3 w-3" />,
        },
        {
          name: 'GrowthLab',
          path: routes[7],
          icon: <Receipt className="h-3 w-3" />,
        },
        {
          name: 'Whitelist',
          path: routes[8],
        icon: <BadgeCheck className="h-3 w-3" />,
        },
      ],
    },
    {
      title: 'Pulse',
      items: [
        { name: 'Notice', path: routes[8], icon: <Bell className="h-3 w-3" /> },
        {
          name: 'SNS',
          path: routes[9],
          icon: <MessageSquare className="h-3 w-3" />,
        },
        { name: 'Feed', path: routes[10], icon: <Rss className="h-3 w-3" /> },
        {
          name: 'Book Mark',
          path: routes[11],
          icon: <Bookmark className="h-3 w-3" />,
        },
      ],
    },
    {
      title: 'InSight',
      items: [
        {
          name: 'Company InSight',
          path: routes[12],
          icon: <Building2 className="h-3 w-3" />,
        },
        {
          name: 'Investment Report',
          path: routes[13],
          icon: <FileText className="h-3 w-3" />,
        },
        {
          name: 'Premium InSight',
          path: routes[14],
          icon: <Star className="h-3 w-3" />,
          emoji: '✨',
          subItems: [
            {
              name: 'Market Trends',
              path: routes[15],
              icon: <TrendingUp className="h-3 w-3" />,
              emoji: '📈',
            },
            {
              name: 'Top Performing Portfolios',
              path: routes[16],
              icon: <PieChart className="h-3 w-3" />,
              emoji: '🏆',
            },
            {
              name: 'DAO Voting Analytics',
              path: routes[17],
              icon: <BarChart className="h-3 w-3" />,
              emoji: '📊',
            },
            {
              name: 'Market Trends',
              path: routes[18],
              icon: <LineChart className="h-3 w-3" />,
              emoji: '📉',
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
          path: routes[19],
          icon: <Settings className="h-3 w-3" />,
        },
        {
          name: 'Bridge',
          path: routes[20],
          icon: <Share2 className="h-3 w-3" />,
        },
        {
          name: 'Loan',
          path: routes[21],
          icon: <Banknote className="h-3 w-3" />,
        },
        {
          name: 'Event',
          path: routes[22],
          icon: <Calendar className="h-3 w-3" />,
        },
        {
          name: 'Tools',
          path: routes[23],
          icon: <Wrench className="h-3 w-3" />,
          subItems: [
            {
              name: 'Wallet Check',
              path: routes[24],
              icon: <Wallet className="h-3 w-3" />,
            },
            {
              name: 'Token Burn',
              path: routes[25],
              icon: <Flame className="h-3 w-3" />,
            },
            {
              name: 'Token Lock',
              path: routes[26],
              icon: <Lock className="h-3 w-3" />,
            },
            {
              name: 'Token Airdrop',
              path: routes[27],
              icon: <Gift className="h-3 w-3" />,
            },
          ],
        },
      ],
    },
  ]

  const handleNavigate = (path: string) => {
    router.push(path)
    setActivePage(path)
  }

  const handleToggleMenu = (index: number) => {
    if (openMenuIndex === index) {
      setOpenMenuIndex(null)
    } else {
      setOpenMenuIndex(index)
    }
  }

  // Helper function to check if a path is active
  const isPathActive = (path: string) => {
    if (path === '/') {
      return router.pathname === '/'
    }
    return router.pathname.startsWith(path)
  }

  // Helper function to check if a path belongs to a specific menu section
  const getMenuSectionForPath = (path: string): number | null => {
    for (let i = 0; i < navItems.length; i++) {
      if (
        navItems[i].items?.some(
          (item) =>
            isPathActive(item.path) ||
            item.subItems?.some((subItem) => isPathActive(subItem.path)),
        )
      ) {
        return i
      }
    }
    return null
  }

  // Get the active menu section based on the current active page
  const activeMenuSection = getMenuSectionForPath(activePage)

  // Toggle expanded section in mobile menu
  const toggleExpandedSection = (index: number) => {
    if (expandedSections.includes(index)) {
      setExpandedSections(expandedSections.filter((i) => i !== index))
    } else {
      setExpandedSections([...expandedSections, index])
    }
  }

  // Toggle expanded submenu in mobile menu
  const toggleExpandedSubmenu = (index: number, subIndex: number) => {
    const key = `${index}-${subIndex}`
    if (expandedSections.includes(Number(key))) {
      setExpandedSections(expandedSections.filter((i) => i !== Number(key)))
    } else {
      setExpandedSections([...expandedSections, Number(key)])
    }
  }

  // Check if a submenu is expanded
  const isSubmenuExpanded = (index: number, subIndex: number) => {
    const key = `${index}-${subIndex}`
    return expandedSections.includes(Number(key))
  }

  // Don't render until mounted to prevent theme mismatch
  if (!mounted) {
    return (
      <nav
        ref={navRef}
        className="fixed w-full z-50 transition-all duration-300 bg-bkg-1 border-b border-bkg-4"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link
                  href="/realms"
                  className="font-bold text-xl flex items-center hover:opacity-80 transition-opacity"
                >
                  <img
                    src="https://i.ibb.co/8yybjn9/AIW.png"
                    alt="AIW Logo"
                    className="transition-all duration-300 h-7 w-auto"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav
      ref={navRef}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-bkg-1 shadow-md' : 'bg-bkg-1 border-b border-bkg-4'
      } ${
        hidden
          ? 'transform -translate-y-full'
          : scrolled
          ? 'transform translate-y-0 py-1'
          : 'transform translate-y-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex justify-between ${
            scrolled ? 'h-12' : 'h-14'
          } transition-all duration-300`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/realms"
                className="font-bold text-xl flex items-center hover:opacity-80 transition-opacity"
              >
                <img
                  src="https://i.ibb.co/8yybjn9/AIW.png"
                  alt="AIW Logo"
                  className={`transition-all duration-300 ${
                    scrolled ? 'h-6' : 'h-7'
                  } w-auto ${mounted && isDark ? 'filter invert' : ''}`}
                />
              </Link>
            </div>

            <div className="hidden md:ml-6 md:flex md:space-x-1">
              {navItems.map((item, index) => (
                <NavItem
                  key={index}
                  title={item.title}
                  items={item.items}
                  onNavigate={handleNavigate}
                  isOpen={openMenuIndex === index}
                  onToggle={() => handleToggleMenu(index)}
                  currentTheme={actualTheme}
                  activePage={activePage}
                  index={index}
                  isDark={mounted ? isDark : false}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Switch Button - Hidden */}
            {/* <ThemeSwitch /> */}
            {/* Wallet Connect Button */}
            <ConnectWalletButton />
            {/* Mobile Menu Button */}
            <div className="ml-3 flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-1.5 rounded-md text-fgd-2 hover:text-neonBlue focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="block h-5 w-5" />
                ) : (
                  <Menu className="block h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu - with collapsible sections */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-bkg-1 border-b border-bkg-4">
          {navItems.map((item, index) => (
            <div key={index}>
              <button
                onClick={() => toggleExpandedSection(index)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium ${
                  activeMenuSection === index
                    ? 'text-neonBlue'
                    : 'text-fgd-2 hover:text-neonBlue'
                }`}
              >
                <span>{item.title}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    expandedSections.includes(index) ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Collapsible submenu */}
              <div
                className={`pl-4 space-y-2 overflow-hidden transition-all duration-200 ${
                  expandedSections.includes(index) ? 'max-h-96' : 'max-h-0'
                }`}
              >
                {item.items?.map((subItem, subIndex) => (
                  <div key={subIndex}>
                    {subItem.subItems ? (
                      <div className="space-y-2">
                        <button
                          className={`flex items-center justify-between w-full px-3 py-1 rounded-md text-sm font-semibold ${
                            isPathActive(subItem.path) ||
                            subItem.subItems.some((s) => isPathActive(s.path))
                              ? 'bg-neonBlue/10 text-neonBlue'
                              : 'text-fgd-3 hover:text-neonBlue'
                          }`}
                          onClick={() => toggleExpandedSubmenu(index, subIndex)}
                        >
                          <div className="flex items-center">
                            <span className="mr-2 text-lg">
                              {(subItem as NavItem).emoji ? (
                                <span aria-hidden="false">
                                  {(subItem as NavItem).emoji}
                                </span>
                              ) : (
                                <span aria-hidden="true">
                                  {(subItem as NavItem).icon}
                                </span>
                              )}
                            </span>
                            <span>{(subItem as NavItem).name}</span>
                          </div>
                          <ChevronDown
                            className={`h-3 w-3 transition-transform ${
                              isSubmenuExpanded(index, subIndex)
                                ? 'rotate-180'
                                : ''
                            }`}
                          />
                        </button>

                        {/* Sub-submenu */}
                        <div
                          className={`pl-4 space-y-1 overflow-hidden transition-all duration-200 ${
                            isSubmenuExpanded(index, subIndex)
                              ? 'max-h-96'
                              : 'max-h-0'
                          }`}
                        >
                          {(subItem as NavItem).subItems?.map(
                            (subSubItem, subSubIndex) => (
                              <Link
                                key={subSubIndex}
                                href={subSubItem.path}
                                className={`flex items-center px-3 py-1 rounded-md text-sm ${
                                  isPathActive(subSubItem.path)
                                    ? 'bg-neonBlue/10 text-neonBlue'
                                    : 'text-fgd-3 hover:text-neonBlue'
                                }`}
                              >
                                <div className="flex items-center">
                                  <span className="mr-2 text-lg">
                                    {subSubItem.emoji ? (
                                      <span aria-hidden="false">
                                        {subSubItem.emoji}
                                      </span>
                                    ) : (
                                      <span aria-hidden="true">
                                        {subSubItem.icon}
                                      </span>
                                    )}
                                  </span>
                                  <span>{subSubItem.name}</span>
                                </div>
                              </Link>
                            ),
                          )}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={subItem.path}
                        className={`flex items-center px-3 py-1 rounded-md text-sm ${
                          isPathActive(subItem.path)
                            ? 'bg-neonBlue/10 text-neonBlue'
                            : 'text-fgd-3 hover:text-neonBlue'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="mr-2 text-lg">
                            {subItem.emoji ? (
                              <span aria-hidden="false">{subItem.emoji}</span>
                            ) : (
                              <span aria-hidden="true">{subItem.icon}</span>
                            )}
                          </span>
                          <span>{subItem.name}</span>
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
