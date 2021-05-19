import React from 'react';

function LanguagesListTemplate() {
  return (
    <ul>
      {[
        {
          onThisPage: 'En esta página',
          label: 'Español',
          suffix: '-esp/',
          lang: 'es',
        },
        {
          suffix: '-tag/',
          label: 'Tagalog',
          onThisPage: 'Sa pahinang ito',
          lang: 'tl',
        },
        {
          label: 'Other languages',
          suffix: '/',
          lang: 'en',
        },
      ].map((link, i) => (
        <li key={i}>
          <a
            href={link.href}
            // onClick={analyticsEvent}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
export default function LanguageSupport({ isDesktop, showLangSupport }) {
  if (showLangSupport !== true) return null;

  if (isDesktop) {
    return (
      <div className="usa-grid usa-grid-full va-footer-links-bottom">
        <h2 className="va-footer-linkgroup-title"> Language support </h2>
        <LanguagesListTemplate />
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
          <LanguagesListTemplate />
        </div>
      </div>
    </li>
  );
}
