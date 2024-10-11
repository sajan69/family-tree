import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaTree, FaEdit, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  }
  
  const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
    const { t } = useTranslation();
    const toggleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        window.dispatchEvent(new CustomEvent('sidebarStateChange', { detail: { isCollapsed: newState } }));
      };
    const menuItems = [
      { href: '/family-tree', label: t("sideBar.familyTree"), icon: FaTree },
      { href: '/update-data', label: t("sideBar.updateForm"), icon: FaEdit },
    ];
  
    return (
      <aside 
        className={`sidebar bg-gray-900 text-white h-screen fixed left-0 top-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
        onClick={toggleCollapse}
      >
        <div className={`flex items-center p-6 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <Link href="/" className="flex items-center">
            <Image src="/adhikari.png" alt="Family Tree Logo" width={40} height={40} className={isCollapsed ? '' : 'mr-4 w-100'} />
            {!isCollapsed && <h1 className="text-2xl font-bold">{t("adhikariFamily")}</h1>}
          </Link>
          
          <button 
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            {isCollapsed ? <FaChevronRight size={20} /> : <FaChevronLeft size={20} />}
          </button>
        </div>
        <nav className={`mt-8 ${isCollapsed ? 'px-2' : 'px-6'}`} onClick={(e) => e.stopPropagation()}>
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                    usePathname() === item.href 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <item.icon size={24} className={isCollapsed ? '' : 'mr-4'} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    )
};

export default Sidebar;