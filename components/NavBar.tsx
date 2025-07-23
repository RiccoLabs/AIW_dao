import useQueryContext from '@hooks/useQueryContext'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ChevronDownIcon } from '@heroicons/react/solid'

const ConnectWalletButtonDynamic = dynamic(
  async () => await import('./ConnectWalletButton'),
  { ssr: false },
)

const NavBar = () => {
  const { fmtUrlWithCluster } = useQueryContext()

  return (
    <>
      <nav className="w-full">
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

              {/* Custom Navigation Links - Directly next to logo */}
              <div className="hidden md:flex items-center space-x-7">
                <div className="flex items-center text-white text-sm cursor-pointer hover:text-blue-400 transition-colors">
                  Explorer
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </div>
                <div className="flex items-center text-white text-sm cursor-pointer hover:text-blue-400 transition-colors">
                  Collection
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </div>
                <div className="flex items-center text-blue-400 text-sm cursor-pointer hover:text-blue-300 transition-colors">
                  Program
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </div>
                <div className="flex items-center text-white text-sm cursor-pointer hover:text-blue-400 transition-colors">
                  Pulse
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </div>
                <div className="flex items-center text-white text-sm cursor-pointer hover:text-blue-400 transition-colors">
                  InSight
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </div>
                <div className="flex items-center text-white text-sm cursor-pointer hover:text-blue-400 transition-colors">
                  More
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>

            {/* Wallet Connect Button */}
            <div className="flex items-center">
              <ConnectWalletButtonDynamic />
            </div>
          </div>
        </div>
      </nav>

      {/* Separator line after navbar - full width */}
      <div className="border-b border-gray-700 w-full"></div>
    </>
  )
}

export default NavBar
