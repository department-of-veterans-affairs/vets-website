import React, { useEffect, useState } from 'react';
import recordEvent from 'platform/monitoring/record-event';
// TODO: feature toggle, styling
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

    document.location.pathname = baseUrls[keyValue];
  };

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      <span>
        {Object.entries(i18Content)
          .filter(([k, _]) => {
            return k !== lang;
          })
          .map(([k, v], i) => {
            return (
              <span
                // For "on-state" use standard dark grey color
                // For "off-state" use standard blue and underline text
                className="vads-u-font-size--base vads-u-font-family--sans vads-u-padding-bottom-0p5 "
                onClick={e => {
                  e.preventDefault();
                  handleLinkClick(k);
                }}
                key={i}
                style={{ cursor: 'pointer' }}
              >
                {v.label}{' '}
                {i !== Object.entries(i18Content).length - 2 && (
                  <span className=" vads-u-margin-left--0p5 vads-u-margin-right--0p5">
                    |
                  </span>
                )}
              </span>
            );
          })}
      </span>
      <hr
        style={{
          borderTop: '1px solid #bbb',
          width: '25%',
          marginBottom: '8px',
          marginTop: '4px',
        }}
      />
    </div>
  );
};

export default I18Select;
