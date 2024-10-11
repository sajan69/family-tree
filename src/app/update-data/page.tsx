'use client'
import { useState } from 'react';
import UpdateForm from '../../components/UpdateForm';
import DynamicSidebar from '../../components/DynamicSidebar';
import { useTranslation } from 'react-i18next';

export default function UpdateDataPage() {
  const { t } = useTranslation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarStateChange = (isCollapsed: boolean) => {
    setSidebarCollapsed(isCollapsed);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <DynamicSidebar onSidebarStateChange={handleSidebarStateChange} />
      <main className={`flex-1 p-4 md:p-8 transition-all duration-300 ${
        sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
      } mt-16 md:mt-0`}>
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">{t('updateForm.title')}</h1>
        <UpdateForm />
      </main>
    </div>
  );
}