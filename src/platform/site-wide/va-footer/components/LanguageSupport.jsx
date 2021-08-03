import React, { useEffect } from 'react';
import {
  setLangAttributes,
  parseLangCode,
} from 'applications/static-pages/i18Select/hooks';
import { FOOTER_EVENTS } from '../helpers';
import recordEvent from '../../../monitoring/record-event';

const langAssistanceLabel = 'Language assistance';

function LanguagesListTemplate({ dispatchLanguageSelection }) {
  return (
    <ul
      className={
        'vads-u-margin-top--0 vads-u-margin-bottom--0 vads-u-padding-bottom--0'
      }
    >
      {[
        {
          label: 'Español',
          lang: 'es',
          href: '/asistencia-y-recursos-en-espanol',
        },
        {
          label: 'Tagalog',
          lang: 'tl',
          href: '/tagalog-wika-mapagkukunan-at-tulong',
        },
        {
          label: 'Other languages',
          lang: 'en',
          href: '/resources/how-to-get-free-language-assistance-from-va/',
        },
      ].map((link, i) => (
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
  showLangSupport,
  dispatchLanguageSelection,
  languageCode,
}) {
  useEffect(
    () => {
      const langCode = parseLangCode(document?.location?.pathname);

      setLangAttributes(langCode);

      if (languageCode === langCode) return;

      dispatchLanguageSelection(langCode);
    },
    [dispatchLanguageSelection, languageCode],
  );

  if (showLangSupport !== true) return null;

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
