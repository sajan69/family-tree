'use client'
import { useState, useEffect } from 'react';
import UpdateForm from '../../components/UpdateForm';
import DynamicSidebar from '../../components/DynamicSidebar';
import { useTranslation } from 'react-i18next';

export default function UpdateDataPage() {
  const { t } = useTranslation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleSidebarChange = (e: CustomEvent) => {
      setSidebarCollapsed(e.detail.isCollapsed);
    };

    window.addEventListener('sidebarStateChange', handleSidebarChange as EventListener);

    return () => {
      window.removeEventListener('sidebarStateChange', handleSidebarChange as EventListener);
    };
  }, []);

  return (
    <div className="flex">
      <DynamicSidebar />
      <main className={`flex-1 p-8 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <h1 className="text-3xl font-bold mb-8">{t('updateForm.title')}</h1>
        <UpdateForm />
      </main>
    </div>
  );
}