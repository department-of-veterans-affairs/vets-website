import React, { useEffect } from 'react';
import { setLangAttribute } from 'applications/static-pages/i18Select/hooks';
import { BrowserRouter as Router, Link } from 'react-router-dom';

/* eslint-disable-next-line  react-hooks/rules-of-hooks */
// const history = useRouterHistory(hashHistory)();

function LanguagesListTemplate({ langSelected }) {
  return (
    <Router>
      <ul>
        {[
          {
            onThisPage: 'En esta página',
            label: 'Español',
            suffix: '-esp/',
            lang: 'es',
            href: '',
          },
          {
            suffix: '-tag/',
            label: 'Tagalog',
            onThisPage: 'Sa pahinang ito',
            lang: 'tl',
            href: '/coronavirus-veteran-frequently-asked-questions-esp/',
          },
          {
            label: 'Other languages',
            suffix: '/',
            lang: 'en',
            href: '',
          },
        ].map((link, i) => (
          <li key={i}>
            <Link
              to={link.href}
              onClick={() => {
                langSelected(link.lang);
              }}
            >
              {' '}
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </Router>
  );
}
export default function LanguageSupport({
  isDesktop,
  // showLangSupport,
  langSelected,
  languageCode,
}) {
  useEffect(
    () => {
      const mainUrlLang = document?.getElementById('content')?.lang;
      if (mainUrlLang !== 'en') {
        setLangAttribute(mainUrlLang);
      } else {
        setLangAttribute(languageCode);
      }
    },
    [languageCode],
  );
  // if (showLangSupport !== true) return null;

  if (isDesktop) {
    return (
      <div className="usa-grid usa-grid-full va-footer-links-bottom">
        <h2 className="va-footer-linkgroup-title"> Language support </h2>
        <LanguagesListTemplate langSelected={langSelected} />
      </div>
    );
  }

  return (
    <li>
      <button
        className="usa-button-unstyled usa-accordion-button va-footer-button"
        aria-controls="veteran-language-support"
        itemProp="name"
        aria-expanded="false"
      >
        Language Support
      </button>
      <div
        className="usa-accordion-content va-footer-accordion-content"
        id="veteran-language-support"
        aria-hidden="true"
      >
        <div className="usa-grid usa-grid-full va-footer-links-bottom">
          <LanguagesListTemplate langSelected={langSelected} />
        </div>
      </div>
    </li>
  );
}
