'use client'
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { FaChevronLeft, FaChevronRight, FaTree, FaEdit, FaTimes, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import familyConfig from '../config/familyConfig.json';
import { translateFamilyConfig } from '@/utils/translate';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  isMobile: boolean;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, isMobile, isOpen, toggleSidebar }) => {
  const { t } = useTranslation();
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const menuItems = [
    { href: '/family-tree', label: t("sideBar.familyTree"), icon: FaTree },
    ...(isLoggedIn ? [{ href: '/update-data', label: t("sideBar.updateForm"), icon: FaEdit }] : []),
  ];
  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const sidebarClass = isMobile
    ? `fixed inset-x-0 top-0 z-50 w-full bg-gray-900 text-white transform ${
        isOpen ? 'translate-y-0' : '-translate-y-full'
      } transition-transform duration-300 ease-in-out`
    : `sidebar bg-gray-900 text-white h-screen fixed left-0 top-0 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`;

  return (
    <aside className={sidebarClass}>
      <div className={`flex items-center p-4 ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between'}`}>
        <Link href="/" className="flex items-center">
          <Image src={familyConfig.logoPath} alt={`${familyConfig.familyName} Logo`} width={40} height={40} className={isCollapsed && !isMobile ? '' : 'mr-4 w-100'} />
          {(!isCollapsed || isMobile) && <h1 className="text-xl font-bold">{translateFamilyConfig('familyName')} {t("sideBar.family")}</h1>}
        </Link>
        
        {isMobile ? (
          <button 
            className="text-gray-400 hover:text-white transition-colors duration-200"
            onClick={toggleSidebar}
          >
            <FaTimes size={24} />
          </button>
        ) : (
          <button 
            className="text-gray-400 hover:text-white transition-colors duration-200"
            onClick={toggleSidebar}
          >
            {isCollapsed ? <FaChevronRight size={20} /> : <FaChevronLeft size={20} />}
          </button>
        )}
      </div>
      <nav className={`mt-8 ${isCollapsed && !isMobile ? 'px-2' : 'px-4'}`}>
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href}
                className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                  usePathname() === item.href 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                } ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <item.icon size={24} className={isCollapsed && !isMobile ? '' : 'mr-4'} />
                {(!isCollapsed || isMobile) && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
          <li>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className={`flex items-center p-2 rounded-lg transition-colors duration-200 text-gray-400 hover:bg-gray-800 hover:text-white ${isCollapsed && !isMobile ? 'justify-center' : ''} w-full`}
              >
                <FaSignOutAlt size={24} className={isCollapsed && !isMobile ? '' : 'mr-4'} />
                {(!isCollapsed || isMobile) && <span>{t("sideBar.logout")}</span>}
              </button>
            ) : (
              <Link
                href="/login"
                className={`flex items-center p-2 rounded-lg transition-colors duration-200 text-gray-400 hover:bg-gray-800 hover:text-white ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <FaSignInAlt size={24} className={isCollapsed && !isMobile ? '' : 'mr-4'} />
                {(!isCollapsed || isMobile) && <span>{t("sideBar.login")}</span>}
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;