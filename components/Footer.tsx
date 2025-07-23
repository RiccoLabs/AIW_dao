import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import cx from 'classnames'
import { useTheme } from 'next-themes'
import { FiTwitter, FiYoutube, FiMessageCircle } from 'react-icons/fi'

const Footer: React.FC = () => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => setMounted(true), [])
  
  // Handle hydration and theme detection
  const isDark = mounted && (theme === 'Dark' || theme === 'dark')
  
  // Debug: Log the current theme

  const footerLinks = [
    {
      title: 'Explorer',
      links: ['Official Portfolio', 'Public Equities', 'Start-up'],
    },
    {
      title: 'Collection',
      links: ['AIW Collection', 'Relate Collection'],
    },
    {
      title: 'Program',
      links: ['Pool', 'DAO', 'GrowthLab'],
    },
    {
      title: 'Pulse',
      links: ['Notice', 'SNS', 'Feed', 'Book Mark'],
    },
    {
      title: 'InSight',
      links: ['Company InSight', 'Investment Report'],
    },
  ]

  return (
    <footer
      className={cx(
        'pt-12 pb-8',
        isDark
          ? 'bg-[rgb(17,24,39)] border-t border-dark-theme-bkg-3'
          : 'bg-white border-t border-light-theme-bkg-3',
      )}
      style={isDark ? { backgroundColor: 'rgb(17, 24, 39)' } : { backgroundColor: 'white' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          <div className="col-span-2">
            <div className="flex items-center mb-4">
              <img
                src="https://i.ibb.co/Z6yCq9Hx/W1-1.png"
                alt="AIW Logo"
                className={cx('h-8 w-auto', isDark ? 'filter invert' : '')}
              />
            </div>
            <p
              className={cx(
                'mb-6 max-w-xs',
                isDark ? 'text-dark-theme-fgd-3' : 'text-light-theme-fgd-2',
              )}
            >
              A cutting-edge DeFi platform revolutionizing decentralized finance
              with innovative blockchain solutions.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/AIWDAO"
                target="_blank"
                rel="noreferrer"
                className={cx(
                  'transition-colors',
                  isDark
                    ? 'text-dark-theme-fgd-3 hover:text-dark-theme-blue'
                    : 'text-light-theme-fgd-2 hover:text-light-theme-blue',
                )}
              >
                <FiTwitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className={cx(
                  'transition-colors',
                  isDark
                    ? 'text-dark-theme-fgd-3 hover:text-dark-theme-blue'
                    : 'text-light-theme-fgd-2 hover:text-light-theme-blue',
                )}
              >
                <FiYoutube className="h-5 w-5" />
              </a>
              <a
                href="#"
                className={cx(
                  'transition-colors',
                  isDark
                    ? 'text-dark-theme-fgd-3 hover:text-dark-theme-blue'
                    : 'text-light-theme-fgd-2 hover:text-light-theme-blue',
                )}
              >
                <FiMessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3
                className={cx(
                  'font-medium mb-4',
                  isDark ? 'text-dark-theme-fgd-1' : 'text-light-theme-fgd-1',
                )}
              >
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className={cx(
                        'text-sm transition-colors',
                        isDark
                          ? 'text-dark-theme-fgd-3 hover:text-dark-theme-blue'
                          : 'text-light-theme-fgd-2 hover:text-light-theme-blue',
                      )}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className={cx(
            'mt-12 pt-8',
            isDark
              ? 'border-t border-dark-theme-bkg-3'
              : 'border-t border-light-theme-bkg-3',
          )}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p
              className={cx(
                'text-sm',
                isDark ? 'text-dark-theme-fgd-3' : 'text-light-theme-fgd-2',
              )}
            >
              © 2025 RiccoLabs. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy-policy" passHref>
                <a
                  className={cx(
                    'text-sm transition-colors',
                    isDark
                      ? 'text-dark-theme-fgd-3 hover:text-dark-theme-blue'
                      : 'text-light-theme-fgd-2 hover:text-light-theme-blue',
                  )}
                >
                  Privacy Policy
                </a>
              </Link>
              <Link href="/terms" passHref>
                <a
                  className={cx(
                    'text-sm transition-colors',
                    isDark
                      ? 'text-dark-theme-fgd-3 hover:text-dark-theme-blue'
                      : 'text-light-theme-fgd-2 hover:text-light-theme-blue',
                  )}
                >
                  Terms of Service
                </a>
              </Link>
              <a
                href="#"
                className={cx(
                  'text-sm transition-colors',
                  isDark
                    ? 'text-dark-theme-fgd-3 hover:text-dark-theme-blue'
                    : 'text-light-theme-fgd-2 hover:text-light-theme-blue',
                )}
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
