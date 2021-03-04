import React, { useEffect, useState } from 'react';
import recordEvent from 'platform/monitoring/record-event';

const i18Content = {
  en: {
    label: 'English',
    suffix: '/',
  },
  es: {
    // TODO
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
  // TODO: feature toggle
  const [lang, setLang] = useState('en');
  // TODO: move this into a reusable hook
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

  const handleLinkClick = keyValue => {
    recordEvent({
      event: 'nav-covid-link-click',
      faqText: undefined,
      faqSection: undefined,
    });

    document.location.pathname = baseUrls[keyValue];
  };

  return (
    <div className="vads-u-display--flex">
      <span>
        {Object.entries(i18Content)
          .filter(([k, _]) => {
            return k !== lang;
          })
          .map(([k, v], i) => {
            return (
              <a
                // For "on-state" use standard dark grey color
                // For "off-state" use standard blue and underline text
                className="vads-u-font-size--base vads-u-font-family--sans vads-u-padding-bottom-0p5 vads-u-border-bottom--2px"
                onClick={e => {
                  e.preventDefault();
                  // eslint-disable-next-line no-console
                  // setLang(k);
                  handleLinkClick(k);
                }}
                key={i}
              >
                {v.label}{' '}
                {i !== Object.entries(i18Content).length - 2 && (
                  <span className=" vads-u-margin-left--0p5 vads-u-margin-right--0p5">
                    |
                  </span>
                )}
              </a>
            );
          })}
      </span>
    </div>
  );
};

export default I18Select;
