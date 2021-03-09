import React, { useEffect, useState } from 'react';
import recordEvent from 'platform/monitoring/record-event';

const i18Content = {
  en: {
    label: 'English',
    suffix: '/',
  },
  es: {
    onThisPage: 'En esta página',
    label: 'Español',
    suffix: '-esp/',
  },
  tag: {
    suffix: '-tag/',
    label: 'Tagalog',
    onThisPage: 'Tagalog On this page',
  },
};
const langsToLinkSuffixes = {
  es: '-esp/',
  tag: '-tag/',
};
const I18Select = ({ baseUrls }) => {
  const [lang, setLang] = useState('en');
  useEffect(() => {
    const contentDiv = document?.getElementById('content');

    setLang('en');
    if (contentDiv) {
      contentDiv.setAttribute('lang', 'en');
    }
    for (const [key, value] of Object.entries(langsToLinkSuffixes)) {
      if (document?.location.href.endsWith(value)) {
        setLang(key);
        if (contentDiv) {
          contentDiv.setAttribute('lang', key);
        }
      }
    }
  }, []);

  useEffect(
    () => {
      if (lang && lang !== 'en') {
        const onThisPageEl = document?.getElementById('on-this-page');
        onThisPageEl.innerText = i18Content[lang].onThisPage;
      }
    },
    [lang],
  );

  const handleLinkClick = keyValue => {
    recordEvent({
      event: 'nav-covid-link-click',
      faqText: undefined,
      faqSection: undefined,
    });
    const translatedPage = baseUrls[keyValue];
    if (translatedPage) {
      document.location.pathname = translatedPage;
    }
  };

  return (
    <div className="vads-u-display--inline-block vads-u-margin-top--4 vads-u-margin-bottom--3 vads-u-border-bottom--1px vads-u-border-style--solid vads-u-border-color--gray">
      <span>
        {Object.entries(i18Content).map(([languageCode, languageConfig], i) => {
          return (
            <span key={i}>
              <a
                className={`vads-u-font-size--base vads-u-font-family--sans vads-u-padding-bottom-0p5 ${
                  languageCode === lang
                    ? 'vads-u-font-weight--bold vads-u-color--base vads-u-text-decoration--none'
                    : ''
                }`}
                onClick={_ => {
                  handleLinkClick(languageCode);
                }}
                hrefLang={lang}
                lang={lang}
                style={{ cursor: 'pointer' }}
              >
                {languageConfig.label}{' '}
              </a>
              {i !== Object.entries(i18Content).length - 1 && (
                <span
                  className=" vads-u-margin-left--0p5 vads-u-margin-right--0p5 vads-u-color--gray
                  vads-u-height--20"
                >
                  |
                </span>
              )}
            </span>
          );
        })}
      </span>
    </div>
  );
};

export default I18Select;
