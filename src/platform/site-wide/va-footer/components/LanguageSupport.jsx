import React, { useEffect } from 'react';
import {
  setLangAttribute,
  adaptLinksWithLangCode,
} from 'applications/static-pages/i18Select/hooks';
import { FOOTER_EVENTS } from '../helpers';
import recordEvent from '../../../monitoring/record-event';

function LanguagesListTemplate({ langSelected }) {
  return (
    <ul>
      {[
        {
          onThisPage: 'En esta página',
          label: 'Español',
          suffix: '-esp/',
          lang: 'es',
          href: '/asistencia-y-recursos-en-espanol',
        },
        {
          suffix: '-tag/',
          label: 'Tagalog',
          onThisPage: 'Sa pahinang ito',
          lang: 'tl',
          href: '/tagalog-wika-mapagkukunan-at-tulong',
        },
        {
          label: 'Other languages',
          suffix: '/',
          lang: 'en',
          href: '/resources/how-to-get-free-language-assistance-from-va/',
        },
      ].map((link, i) => (
        <li key={i}>
          <a
            href={link.href}
            hrefLang={link.lang}
            onClick={() => {
              langSelected(link.lang);
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
  showLangSupport,
  langSelected,
  languageCode,
}) {
  useEffect(
    () => {
      if (langSelected) {
        adaptLinksWithLangCode(langSelected);
      }
    },
    [langSelected],
  );

  useEffect(
    () => {
      setLangAttribute(languageCode);
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
