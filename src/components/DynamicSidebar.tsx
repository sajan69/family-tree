'use client'
import dynamic from 'next/dynamic';
import { useState } from 'react';

const SidebarComponent = dynamic(() => import('./Sidebar'), {
  ssr: false,
});

const DynamicSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SidebarComponent 
      isCollapsed={isCollapsed} 
      setIsCollapsed={setIsCollapsed} 
    />
  );
};

export default DynamicSidebar;