import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import zhCommon from './locales/zh/common.json';
import enEditor from './locales/en/editor.json';
import zhEditor from './locales/zh/editor.json';
import enSettings from './locales/en/settings.json';
import zhSettings from './locales/zh/settings.json';
import enPublish from './locales/en/publish.json';
import zhPublish from './locales/zh/publish.json';
import enOutline from './locales/en/outline.json';
import zhOutline from './locales/zh/outline.json';
import enTemplates from './locales/en/templates.json';
import zhTemplates from './locales/zh/templates.json';

const resources = {
  en: {
    common: enCommon,
    editor: enEditor,
    settings: enSettings,
    publish: enPublish,
    outline: enOutline,
    templates: enTemplates,
  },
  zh: {
    common: zhCommon,
    editor: zhEditor,
    settings: zhSettings,
    publish: zhPublish,
    outline: zhOutline,
    templates: zhTemplates,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
