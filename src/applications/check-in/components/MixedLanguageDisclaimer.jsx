import React from 'react';
import { useTranslation } from 'react-i18next';

import withTranslationEnabled from '../containers/withTranslationEnabled';

const MixedLanguageDisclaimer = () => {
  const { t, i18n } = useTranslation();
  const { language } = i18n;

  return language !== 'en' ? (
    <va-alert
      background-only
      status="info"
      show-icon
      data-testid="mixed-language-disclaimer"
    >
      <div>{t('some-content-may-be-in-english')}</div>
    </va-alert>
  ) : (
    ''
  );
};

export default withTranslationEnabled(MixedLanguageDisclaimer);
