import React, { useState } from 'react';
import recordEvent from 'platform/monitoring/record-event';

const i18Content = {
  en: {
    label: 'English',
    suffix: null,
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

const I18Select = () => {
  // TODO: feature toggle
  const [lang, setLang] = useState('en');

  for (const [key, value] of Object.entries(i18Content)) {
    if (document?.location.href.endsWith(value.suffix)) {
      setLang(key);
    }
  }

  const contentDiv = document?.getElementById('content');
  if (contentDiv) {
    contentDiv.setAttribute('lang', lang);
  }

  return (
    <div className="vads-u-display--flex">
      <span>
        {Object.entries(i18Content)
          .filter(([k, _]) => {
            return k !== lang;
          })
          .map(([_, v], i) => {
            return (
              <a
                // For "on-state" use standard dark grey color
                // For "off-state" use standard blue and underline text
                className="vads-u-font-size--base vads-u-font-family--sans vads-u-padding-bottom-0p5 vads-u-border-bottom--2px"
                onClick={e => {
                  e.preventDefault();
                  // eslint-disable-next-line no-console
                  console.log(lang, 'the current lang');
                  // eslint-disable-next-line no-console
                  console.log(v, 'THE AVANLUE');
                  recordEvent({
                    event: 'nav-covid-link-click',
                    faqText: undefined,
                    faqSection: undefined,
                  });
                  if (v.suffix) {
                    const currentUrl = window.location.href;
                    const indexToReplace = window.location.href.lastIndexOf(
                      '/',
                    );
                    const newUrl =
                      currentUrl.substring(0, indexToReplace) + v.suffix;
                    // eslint-disable-next-line no-debugger
                    // debugger;
                    window.location.href = newUrl;
                  }
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
