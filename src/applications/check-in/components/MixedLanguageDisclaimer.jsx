import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeSelectFeatureToggles } from '../utils/selectors/feature-toggles';

const MixedLanguageDisclaimer = () => {
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const {
    isTranslationDisclaimerSpanishEnabled,
    isTranslationDisclaimerTagalogEnabled,
  } = useSelector(selectFeatureToggles);

  const { t, i18n } = useTranslation();
  const { language } = i18n;

  const displaySpanish =
    language === 'es' && isTranslationDisclaimerSpanishEnabled;
  const displayTagalog =
    language === 'tl' && isTranslationDisclaimerTagalogEnabled;

  return displaySpanish || displayTagalog ? (
    <div className="vads-u-margin-bottom--2">
      <va-alert
        uswds
        slim
        status="info"
        show-icon
        data-testid="mixed-language-disclaimer"
      >
        <div className="vads-u-margin-top--0">
          {t('some-content-may-be-in-english')}
        </div>
      </va-alert>
    </div>
  ) : (
    ''
  );
};

export default MixedLanguageDisclaimer;
