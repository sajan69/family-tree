'use client'
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';


const SidebarComponent = dynamic(() => import('./Sidebar'), {
  ssr: false,
});
interface DynamicSidebarProps {
  onSidebarStateChange: (isCollapsed: boolean) => void;
}

const DynamicSidebar: React.FC<DynamicSidebarProps> = ({ onSidebarStateChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState('16rem');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    setSidebarWidth(isCollapsed ? '4rem' : '16rem');
    onSidebarStateChange(isCollapsed);
  }, [isCollapsed, onSidebarStateChange]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <>
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-gray-900 p-4">
          <div className="flex items-center">
            <img src="/adhikari.png" alt="Adhikari Logo" className="h-8 w-8 mr-2" />
            <span className="text-white font-bold">Adhikari Family</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
          >
            <FaBars size={24} />
          </button>
        </div>
      )}
      <SidebarComponent 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
        isMobile={isMobile}
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />
    </>
  );
};

export default DynamicSidebar;