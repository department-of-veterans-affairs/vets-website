import React from 'react';
import { useTranslation } from 'react-i18next';

import withTranslationEnabled from '../containers/withTranslationEnabled';

function LanguagePicker() {
  const { i18n } = useTranslation();

  function changeLanguage(e) {
    i18n.changeLanguage(e.target.value);
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
          className={
            i18n.language === link.lang ? 'usa-button' : 'usa-button-secondary'
          }
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
