/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { initReactI18next } from 'react-i18next';

const LANGS_TO_LINK_SUFFIXES = {
  es: '-esp/',
  tag: '-tag/',
};
const translationsContent = {
  en: {
    translation: {
      'Welcome to React': 'Welcome to React and react-i18next',
    },
    label: 'English',
  },
  es: {
    translation: {
      'Welcome to React': 'ESPANOL WELCOME TO REACT',
      onThisPage: 'En esta página',
    },
    label: 'Español',
  },
  tag: {
    translation: {
      'Welcome to React': 'TAGALOG WELCOME TO REACT',
      onThisPage: 'Sa pahinang ito',
    },
    label: 'Tagalog',
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: translationsContent,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
const I18Select = ({ baseUrls }) => {
  const [lang, setLang] = useState('en');
  useEffect(() => {
    const contentDiv = document?.getElementById('content');

    setLang('en');
    if (contentDiv) {
      contentDiv.setAttribute('lang', 'en');
    }
    for (const [langCode, suffix] of Object.entries(LANGS_TO_LINK_SUFFIXES)) {
      if (document?.location.href.endsWith(suffix)) {
        setLang(langCode);
        if (contentDiv) {
          contentDiv.setAttribute('lang', langCode);
        }
      }
    }
  }, []);

  useEffect(
    () => {
      if (lang) {
        i18n.changeLanguage(lang);
      }
      if (lang && lang !== 'en' && translationsContent) {
        const onThisPageEl = document?.getElementById('on-this-page');
        onThisPageEl.innerText =
          translationsContent[lang].translation.onThisPage;
      }
    },
    [lang],
  );

  return (
    <div className="vads-u-display--inline-block vads-u-margin-top--4 vads-u-margin-bottom--3 vads-u-border--0 vads-u-border-bottom--1px vads-u-border-style--solid vads-u-border-color--gray">
      <span>
        {Object.entries(translationsContent).map(
          ([languageCode, languageConfig], i) => {
            if (!baseUrls[languageCode]) {
              return null;
            }
            return (
              <span key={i}>
                <a
                  className={`vads-u-font-size--base vads-u-font-family--sans vads-u-padding-bottom-0p5 ${
                    languageCode === lang
                      ? 'vads-u-font-weight--bold vads-u-color--base vads-u-text-decoration--none'
                      : ''
                  }`}
                  onClick={_ => {
                    recordEvent({
                      event: 'nav-covid-link-click',
                      faqText: undefined,
                      faqSection: undefined,
                    });
                  }}
                  href={baseUrls[languageCode]}
                  hrefLang={lang}
                  lang={lang}
                >
                  {languageConfig.label}{' '}
                </a>
                {i !== Object.entries(translationsContent).length - 1 && (
                  <span
                    className=" vads-u-margin-left--0p5 vads-u-margin-right--0p5 vads-u-color--gray
                    vads-u-height--20"
                  >
                    |
                  </span>
                )}
              </span>
            );
          },
        )}
      </span>
    </div>
  );
};

export default I18Select;
