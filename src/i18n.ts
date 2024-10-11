import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/english.json';
import neTranslations from './locales/nepali.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      ne: { translation: neTranslations },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;