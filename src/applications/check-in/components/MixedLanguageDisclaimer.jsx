import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import withTranslationEnabled from '../containers/withTranslationEnabled';

const MixedLanguageDisclaimer = props => {
  const { spanishDisclaimer } = props; // from feature flag in withTranslationEnabled hook

  const { t, i18n } = useTranslation();
  const { language } = i18n;

  const displaySpanish = language === 'es' && spanishDisclaimer;
  // const displayTagalog = (language === 'tz' || tagalogDisclaimer)

  return displaySpanish ? (
    <div className="vads-u-margin-bottom--2">
      <va-alert status="info" show-icon data-testid="mixed-language-disclaimer">
        <div className="vads-u-margin-top--0">
          {t('some-content-may-be-in-english')}
        </div>
      </va-alert>
    </div>
  ) : (
    ''
  );
};

MixedLanguageDisclaimer.propTypes = {
  spanishDisclaimer: PropTypes.bool,
};

export default withTranslationEnabled(MixedLanguageDisclaimer);
