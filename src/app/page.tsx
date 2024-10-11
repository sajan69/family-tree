'use client'
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col items-center justify-center p-4">
      <main className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
        <Image src="/adhikari.png" alt="Adhikari Family Tree" width={100} height={100} className="mb-6 mx-auto justify-center items-center" />
        <h1 className="text-3xl font-bold text-indigo-800 mb-6">
          {t('welcome')}
        </h1>
        <p className="text-gray-600 mb-8">
          {t('explore')}
        </p>
        <div className="space-y-4">
          <Link href="/family-tree" className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition duration-300">
            {t('viewFamilyTree')}
          </Link>
          <Link href="/update-data" className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-300">
            {t('updateFamilyData')}
          </Link>
        </div>
      </main>
      <footer className="mt-8 text-gray-600 text-sm">
        {t('copyright')}
      </footer>
    </div>
  );
}