'use client'
import { useState, useEffect, useRef } from 'react';
import FamilyTree from '../../components/FamilyTree';
import DynamicSidebar from '../../components/DynamicSidebar';
import FamilySearch from '../../components/FamilySearch';
import { useTranslation } from 'react-i18next';

export default function FamilyTreePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { t } = useTranslation();
  const familyTreeRef = useRef<{ scrollToMember: (memberId: string) => void } | null>(null);

  useEffect(() => {
    const handleSidebarChange = (e: CustomEvent) => {
      setSidebarCollapsed(e.detail.isCollapsed);
    };

    window.addEventListener('sidebarStateChange', handleSidebarChange as EventListener);

    return () => {
      window.removeEventListener('sidebarStateChange', handleSidebarChange as EventListener);
    };
  }, []);

  const handleSearchSelect = (memberId: string) => {
    if (familyTreeRef.current) {
      familyTreeRef.current.scrollToMember(memberId);
    }
  };

  return (
    <div className="flex">
      <DynamicSidebar />
      <main className={`flex-1 p-6 bg-gray-100 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t("ahikariFamilyTree")}</h1>
          <FamilySearch onSelect={handleSearchSelect} />
        </div>
        <FamilyTree ref={familyTreeRef as React.RefObject<HTMLDivElement>} />
      </main>
    </div>
  );
}