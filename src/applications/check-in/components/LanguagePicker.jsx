import React from 'react';
import { useTranslation } from 'react-i18next';

import withTranslationEnabled from '../containers/withTranslationEnabled';

function LanguagePicker() {
  const { i18n } = useTranslation();

  function changeLanguage(e) {
    i18n.changeLanguage(e.target.value);
  }

  function buttonClass(language) {
    let configuredLanguage;
    if (i18n.language.startsWith('en-')) {
      configuredLanguage = 'en';
    } else if (i18n.language.startsWith('es-')) {
      configuredLanguage = 'es';
    } else {
      configuredLanguage = i18n.language;
    }

    return configuredLanguage === language
      ? 'usa-button'
      : 'usa-button-secondary';
  }

  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--5 vads-u-padding-top--2">
      {[
        {
          label: 'English',
          lang: 'en',
        },
        {
          label: 'Español',
          lang: 'es',
        },
      ].map((link, i) => (
        <button
          key={i}
          onClick={changeLanguage}
          className={buttonClass(link.lang)}
          data-testid={`translate-button-${link.lang}`}
          type="button"
          value={link.lang}
        >
          {link.label}
        </button>
      ))}
    </div>
  );
}

export default withTranslationEnabled(LanguagePicker);
