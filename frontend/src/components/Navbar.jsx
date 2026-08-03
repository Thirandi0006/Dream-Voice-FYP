
import {
  Dialog,
  DialogPanel,
  PopoverGroup
} from '@headlessui/react'
import { PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Mic2 } from 'lucide-react'
import { useState } from 'react'

const products = [
  { name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: ChartPieIcon },
  { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: CursorArrowRaysIcon },
  { name: 'Security', description: 'Your customers’ data will be safe and secure', href: '#', icon: FingerPrintIcon },
  { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: SquaresPlusIcon },
  { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: ArrowPathIcon },
]
const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 w-full z-50" style={{ background: 'rgba(10,10,26,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(124,58,237,0.15)' }}>
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1 items-center">
          <a
            href="#"
            className="flex items-center -m-1.5 p-1.5 group">
   <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-xl">
                <Mic2 className="text-black" size={28} />
              </div>
            <span
            
              className="ml-3 text-2xl font-extrabold text-white drop-shadow-lg transition-all duration-300 group-hover:scale-105">
              Dream Voice
            </span>
          </a>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-300 hover:text-white"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-4">
          <a
            href="#home"
            className="text-sm font-semibold text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/20"
          >
            Home
          </a>
          <a
            href="#about"
            className="text-sm font-semibold text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/20"
          >
            Contact
          </a>
          <a
            href="#pricing"
            className="text-sm font-semibold text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/20"
          >
            Pricing
          </a>
          <a
            href="#services"
            className="text-sm font-semibold text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/20"
          >
            Services
          </a>
        </PopoverGroup>



        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="/auth" className="text-sm font-semibold text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/20">
            Log in <span aria-hidden="true">&rarr;</span>
          </a>
        </div>

        {/* <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="#" className="text-sm font-semibold text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/20">
            Sign up <span aria-hidden="true">&rarr;</span>
          </a>
        </div> */}
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto p-6 sm:max-w-sm" style={{ background: '#0f0f24', borderLeft: '1px solid rgba(124,58,237,0.2)' }}>
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Voice</span>
              <img
               
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-slate-300 hover:text-white"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-violet-500/10">
              <div className="space-y-2 py-6">

                <a
                  href="#home"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-slate-200 hover:bg-violet-500/10 hover:text-violet-300"
                >
                  Home
                </a>
                <a
                  href="#about"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-slate-200 hover:bg-violet-500/10 hover:text-violet-300"
                >
                  Contact
                </a>
                <a
                  href="#pricing"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-slate-200 hover:bg-violet-500/10 hover:text-violet-300"
                >
                  Pricing
                </a>
                <a
                  href="#services"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-slate-200 hover:bg-violet-500/10 hover:text-violet-300"
                >
                  Services
                </a>
              </div>
              <div className="py-3">
                <a
                  href="/auth"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-slate-200 hover:bg-violet-500/10 hover:text-violet-300"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
