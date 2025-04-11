import React, { useEffect } from 'react';
import {
  setLangAttributes,
  adjustSidebarNav,
  getConfigFromUrl,
} from 'applications/static-pages/i18Select/utilities/helpers';
import { TRANSLATED_LANGUAGES } from 'applications/static-pages/i18Select/utilities/constants';
import { FOOTER_EVENTS } from '../helpers';
import recordEvent from '../../../monitoring/record-event';

const langAssistanceLabel = 'Language assistance';

export const languageLinks = [
  {
    label: 'Español',
    lang: 'es',
    href: 'https://www.va.gov/asistencia-y-recursos-en-espanol',
  },
  {
    label: 'Tagalog',
    lang: 'tl',
    href: 'https://www.va.gov/tagalog-wika-mapagkukunan-at-tulong',
  },
  {
    label: 'Other languages',
    lang: 'en',
    href:
      'https://www.va.gov/resources/how-to-get-free-language-assistance-from-va/',
  },
];

function LanguagesListTemplate({ dispatchLanguageSelection }) {
  return (
    <ul className="vads-u-margin-top--0 vads-u-margin-bottom--0 vads-u-padding-bottom--0">
      {languageLinks.map((link, i) => (
        <li key={i}>
          <a
            href={link.href}
            lang={link.lang}
            hrefLang={link.lang}
            onClick={() => {
              dispatchLanguageSelection(link.lang);
              recordEvent({
                event: FOOTER_EVENTS.LANGUAGE_SUPPORT,
                lang: link.lang,
              });
            }}
          >
            {' '}
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
export default function LanguageSupport({
  isDesktop,
  dispatchLanguageSelection,
  languageCode,
}) {
  useEffect(() => {
    const { code: parsedLanguageCode } = getConfigFromUrl(
      document?.location?.href,
      TRANSLATED_LANGUAGES,
    );

    setLangAttributes(parsedLanguageCode);
    adjustSidebarNav(parsedLanguageCode);

    if (languageCode === parsedLanguageCode) return;

    dispatchLanguageSelection(parsedLanguageCode);
  }, [dispatchLanguageSelection, languageCode]);

  if (isDesktop) {
    return (
      <div className="usa-grid usa-grid-full va-footer-links-bottom vads-u-border-color--white vads-u-border-bottom--1px vads-u-border-top--1px vads-u-padding-top--2 vads-u-padding-bottom--1p5 vads-u-padding-left--0">
        <h2 className="va-footer-linkgroup-title vads-u-padding-bottom--1">
          {langAssistanceLabel}
        </h2>
        <LanguagesListTemplate
          dispatchLanguageSelection={dispatchLanguageSelection}
        />
      </div>
    );
  }

  return (
    <li>
      <h2 className="va-footer-linkgroup-title">
        <button
          className="usa-button-unstyled usa-accordion-button va-footer-button"
          aria-controls="veteran-language-support"
          itemProp="name"
          aria-expanded="false"
        >
          {langAssistanceLabel}
        </button>
      </h2>
      <div
        className="usa-accordion-content va-footer-accordion-content vads-u-padding-bottom--0 vads-u-padding-left--0p5"
        id="veteran-language-support"
        aria-hidden="true"
      >
        <div className="usa-grid usa-grid-full va-footer-links-bottom">
          <LanguagesListTemplate
            dispatchLanguageSelection={dispatchLanguageSelection}
          />
        </div>
      </div>
    </li>
  );
}
