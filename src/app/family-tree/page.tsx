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

  const handleSidebarStateChange = (isCollapsed: boolean) => {
    setSidebarCollapsed(isCollapsed);
  };

  const handleSearchSelect = (memberId: string) => {
    if (familyTreeRef.current) {
      familyTreeRef.current.scrollToMember(memberId);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <DynamicSidebar onSidebarStateChange={handleSidebarStateChange} />
      <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
      } pt-16 md:pt-0`}>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-0 md:mb-4 mt-4">
          <div className="flex justify-between items-center w-full sm:w-auto mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold mr-4 ml-4">{t("ahikariFamilyTree")}</h1>
            <FamilySearch onSelect={handleSearchSelect} />
          </div>
        </div>
        <div className="flex-1 overflow-auto p-0">
          <FamilyTree ref={familyTreeRef as React.RefObject<HTMLDivElement>} />
        </div>
      </main>
    </div>
  );
}