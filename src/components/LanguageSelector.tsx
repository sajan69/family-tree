'use client'
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GB, NP } from 'country-flag-icons/react/3x2';

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="fixed bottom-4 right-4 z-20 flex space-x-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`p-2 rounded-full transition-all duration-300 ${
          i18n.language === 'en' ? 'bg-blue-100 shadow-md' : 'hover:bg-gray-100'
        }`}
        title={t('languageSelector.english')}
      >
        <GB className="w-6 h-6" />
      </button>
      <button
        onClick={() => changeLanguage('ne')}
        className={`p-2 rounded-full transition-all duration-300 ${
          i18n.language === 'ne' ? 'bg-blue-100 shadow-md' : 'hover:bg-gray-100'
        }`}
        title={t('languageSelector.nepali')}
      >
        <NP className="w-6 h-6" />
      </button>
    </div>
  );
};

export default LanguageSelector;