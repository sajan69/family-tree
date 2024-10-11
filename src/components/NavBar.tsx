import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const NavBar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          {t('familyTree')}
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Link href="/family-tree" className="hover:text-gray-300">
                {t('viewTree')}
              </Link>
              <Link href="/update-data" className="hover:text-gray-300">
                {t('updateData')}
              </Link>
              <button onClick={logout} className="hover:text-gray-300">
                {t('logout')}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-gray-300">
                {t('login')}
              </Link>
              <Link href="/register" className="hover:text-gray-300">
                {t('register')}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;