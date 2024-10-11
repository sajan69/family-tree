import i18n from 'i18next';
import familyConfig from '../config/familyConfig.json';

export function translateDatabaseField(field: string, value: string): string {
  const fieldParts = field.split('.');
  let translation: string | Record<string, unknown> = i18n.t(`databaseFields.${fieldParts[0]}`);
  
  // Handle nested fields
  for (let i = 1; i < fieldParts.length; i++) {
    if (typeof translation === 'object' && translation !== null) {
      translation = translation[fieldParts[i]];
    } else {
      break;
    }
  }

  // If the translation is an object (e.g., for 'relation'), use the value as a key
  if (typeof translation === 'object' && translation !== null && value in translation) {
    return translation[value];
  }

  // For date fields, you might want to format them according to the locale
  if (field === 'birthDate' || field === 'deathDate') {
    const date = new Date(value);
    return date.toLocaleDateString(i18n.language);
  }
  
  // If no specific translation found, return the original value
  return typeof translation === 'string' ? translation : value;
}

export function replacePlaceholders(text: string): string {
  return text
    .replace(/{{familyName}}/g, familyConfig.familyName)
    .replace(/{{familyNepaliName}}/g, familyConfig.familyNepaliName)
    .replace(/{{currentYear}}/g, new Date().getFullYear().toString());
}

export function translate(key: string, options?: object): string {
  let translation = i18n.t(key, options);
  return replacePlaceholders(translation);
}

export function translateFamilyConfig(key: string): string {
  const configKey = `${key}Key` as keyof typeof familyConfig;
  if (configKey in familyConfig) {
    return translate(familyConfig[configKey] as string);
  }
  return familyConfig[key as keyof typeof familyConfig] || key;
}