import React, { useEffect, useState } from 'react';
import recordEvent from 'platform/monitoring/record-event';

const I18_CONTENT = {
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
const LANGS_TO_LINK_SUFFIXES = {
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
      if (lang && lang !== 'en') {
        const onThisPageEl = document?.getElementById('on-this-page');
        onThisPageEl.innerText = I18_CONTENT[lang].onThisPage;
      }
    },
    [lang],
  );

  return (
    <div className="vads-u-display--inline-block vads-u-margin-top--4 vads-u-margin-bottom--3 vads-u-border--0 vads-u-border-bottom--1px vads-u-border-style--solid vads-u-border-color--gray">
      <span>
        {Object.entries(I18_CONTENT).map(
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
                {i !== Object.entries(I18_CONTENT).length - 1 && (
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
