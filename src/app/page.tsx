'use client'
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import familyConfig from '../config/familyConfig.json';
import { translateFamilyConfig } from '../utils/translate';


export default function Home() {
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col items-center justify-center p-4">
      <main className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full text-center">
      <Image 
        src={familyConfig.logoPath} 
        alt={translateFamilyConfig('logoAlt')} 
        width={100} 
        height={100} 
        className="mb-6 mx-auto" 
      />
      <h1 className="text-2xl sm:text-3xl font-bold text-indigo-800 mb-4 sm:mb-6">
        {translateFamilyConfig('welcomeMessage')}
      </h1>
      <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
        {translateFamilyConfig('exploreMessage')}
      </p>
        <div className="space-y-4">
          <Link href="/family-tree" className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition duration-300">
            {t('viewFamilyTree')}
          </Link>
          {isLoggedIn ? (
            <Link href="/update-data" className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-300">
              {t('updateFamilyData')}
            </Link>
          ) : (
            <Link href="/login" className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-300">
              {t('sideBar.login')}
            </Link>
          )}
        </div>
      </main>
      <footer className="mt-8 text-gray-600 text-xs sm:text-sm">
      {translateFamilyConfig('copyrightMessage')}
    </footer>
    </div>
  );
}