import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { 
  Bars3Icon, 
  XMarkIcon,
  BookOpenIcon,
  HomeIcon,
  RectangleStackIcon,
  ChartBarIcon,
  QueueListIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';

const navigation = [
  { name: 'الرئيسية', href: '/dashboard', icon: HomeIcon },
  { name: 'المكتبة', href: '/library', icon: BookOpenIcon },
  { name: 'التصنيفات', href: '/categories', icon: RectangleStackIcon },
  { name: 'قوائم القراءة', href: '/playlists', icon: QueueListIcon },
  { name: 'تقدمي', href: '/progress', icon: ChartBarIcon },
];

export const Navbar: React.FC = () => {
  const { user, signOut } = useAuthStore();

  return (
    <Disclosure as="nav" className="bg-[#1A1A1A]/90 backdrop-blur-xl border-b border-[#2A2A2A] sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-2xl font-bold text-neon">
                    وجيز
                  </Link>
                </div>
                <div className="hidden sm:mr-6 sm:flex sm:space-x-1 rtl:space-x-reverse">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="inline-flex items-center px-4 py-2 my-2 text-sm font-medium text-gray-300 hover:text-neon rounded-xl hover:bg-[#2A2A2A] transition-all duration-200"
                    >
                      <item.icon className="h-5 w-5 ml-2" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="hidden sm:mr-6 sm:flex sm:items-center">
                <Menu as="div" className="relative">
                  <Menu.Button className="flex text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon focus:ring-offset-[#1A1A1A]">
                    <span className="sr-only">فتح قائمة المستخدم</span>
                    <div className="h-10 w-10 rounded-xl bg-neon/10 text-neon flex items-center justify-center border border-neon/20">
                      {user?.email?.[0].toUpperCase()}
                    </div>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-left absolute left-0 mt-2 w-48 rounded-xl shadow-lg py-1 bg-[#1A1A1A] ring-1 ring-[#2A2A2A] focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => signOut()}
                            className={`${
                              active ? 'bg-[#2A2A2A] text-neon' : 'text-gray-300'
                            } block w-full text-right px-4 py-2 text-sm`}
                          >
                            تسجيل الخروج
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>

              <div className="-ml-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-neon hover:bg-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-neon">
                  <span className="sr-only">فتح القائمة الرئيسية</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden bg-[#1A1A1A]">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center px-4 py-2 text-base font-medium text-gray-300 hover:text-neon hover:bg-[#2A2A2A]"
                >
                  <item.icon className="h-5 w-5 ml-2" />
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-[#2A2A2A]">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-xl bg-neon/10 text-neon flex items-center justify-center border border-neon/20">
                    {user?.email?.[0].toUpperCase()}
                  </div>
                </div>
                <div className="mr-3">
                  <div className="text-base font-medium text-gray-300">
                    {user?.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button
                  onClick={() => signOut()}
                  className="block w-full text-right px-4 py-2 text-base font-medium text-gray-300 hover:text-neon hover:bg-[#2A2A2A]"
                >
                  تسجيل الخروج
                </button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};