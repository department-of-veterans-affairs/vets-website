import React, { useEffect, useState } from 'react';
import recordEvent from 'platform/monitoring/record-event';

const LANGS_TO_LINK_SUFFIXES = {
  es: '-esp/',
  tag: '-tag/',
};
const I18Select = ({ baseUrls, content }) => {
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
        document.documentElement.setAttribute('lang', langCode);
      }
    }
  }, []);

  useEffect(
    () => {
      if (lang && lang !== 'en') {
        const onThisPageEl = document?.getElementById('on-this-page');
        onThisPageEl.innerText = content[lang].onThisPage;
      }
    },
    [lang, content],
  );

  return (
    <div className="vads-u-display--inline-block vads-u-margin-top--4 vads-u-margin-bottom--3 vads-u-border--0 vads-u-border-bottom--1px vads-u-border-style--solid vads-u-border-color--gray">
      <span>
        {Object.entries(content).map(([languageCode, languageConfig], i) => {
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
                    event: 'nav-pipe-delimited-list-click',
                    pipeDelimitedListHeader: lang,
                  });
                }}
                href={baseUrls[languageCode]}
                hrefLang={languageConfig.lang}
                lang={languageConfig.lang}
              >
                {languageConfig.label}{' '}
              </a>
              {i !== Object.entries(content).length - 1 && (
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
