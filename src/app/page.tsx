'use client'
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import familyConfig from '../config/familyConfig.json';
import { translateFamilyConfig } from '../utils/translate';
import { FaTree, FaSearch, FaUsers, FaLanguage, FaGithub } from 'react-icons/fa';

export default function Home() {
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-animated dark:bg-gradient-animated-dark flex flex-col items-center justify-between p-8 text-gray-800 dark:text-white">
        <header className="w-full max-w-4xl text-center">
        <Image 
          src={familyConfig.logoPath} 
          alt={translateFamilyConfig('logoAlt')} 
          width={150} 
          height={150} 
          className="mb-6 mx-auto" 
        />
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          {translateFamilyConfig('welcomeMessage')}
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          {translateFamilyConfig('exploreMessage')}
        </p>
      </header>

      <main className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="group">
        <FeatureCard 
            icon={<FaTree className="text-4xl text-green-400" />}
            title={t('features.interactiveTree')}
            description={t('features.interactiveTreeDesc')}
          />
        </div>
        <div className="group">
          <FeatureCard 
            icon={<FaSearch className="text-4xl text-blue-400" />}
            title={t('features.search')}
            description={t('features.searchDesc')}
          />
          </div>
          <div className="group">
          <FeatureCard 
            icon={<FaUsers className="text-4xl text-purple-400" />}
            title={t('features.collaboration')}
            description={t('features.collaborationDesc')}
          />
          </div>
          <div className="group">
          <FeatureCard 
            icon={<FaLanguage className="text-4xl text-red-400" />}
            title={t('features.multilingual')}
            description={t('features.multilingualDesc')}
          />
        </div>
        </div>
        

        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link href="/family-tree" className="w-full sm:w-auto bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 text-center backdrop-filter backdrop-blur-sm">
            {t('viewFamilyTree')}
          </Link>
          {isLoggedIn ? (
            <Link href="/update-data" className="w-full sm:w-auto bg-green-500 bg-opacity-80 hover:bg-opacity-100 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 text-center backdrop-filter backdrop-blur-sm">
              {t('updateFamilyData')}
            </Link>
          ) : (
            <Link href="/login" className="w-full sm:w-auto bg-green-500 bg-opacity-80 hover:bg-opacity-100 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 text-center backdrop-filter backdrop-blur-sm">
              {t('sideBar.login')}
            </Link>
          )}
        </div>

      </main>
        <div className="text-center mt-8 mb-4">
        <p className="text-sm text-gray-400">
          {t('interestedInCreatingYourOwn')}{' '}
          <a 
            href="https://github.com/sajan69/family-tree" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-400 hover:text-blue-300 transition duration-300"
          >
            <FaGithub className="inline mr-1" />
            {t('checkOutRepo')}
          </a>
        </p>
      </div>

      <footer className="mt-12 text-gray-400 text-sm">
        {translateFamilyConfig('copyrightMessage')}
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-800 bg-opacity-50 rounded-lg shadow-lg p-6 flex flex-col items-center text-center transform transition duration-300 ease-in-out hover:scale-105 hover:bg-gray-700 hover:bg-opacity-70 hover:shadow-2xl">
      <div className="text-4xl mb-4 transition-transform duration-300 ease-in-out transform group-hover:scale-110 group-hover:rotate-3">
        {icon}
      </div>
      <h2 className="text-xl font-semibold mt-2 mb-3 text-white group-hover:text-indigo-300 transition-colors duration-300">{title}</h2>
      <p className="text-gray-300 group-hover:text-gray-100 transition-colors duration-300">{description}</p>
    </div>
  );
}