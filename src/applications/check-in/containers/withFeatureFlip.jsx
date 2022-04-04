import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { APP_NAMES } from '../utils/appConstants';
import { makeSelectApp } from '../selectors';
import { makeSelectFeatureToggles } from '../utils/selectors/feature-toggles';

import i18n from '../utils/i18n/i18n';
import es from '../locales/es/translation.json';

const withFeatureFlip = (Component, options) => {
  const { isPreCheckIn } = options;
  return props => {
    const selectApp = useMemo(makeSelectApp, []);
    const { app } = useSelector(selectApp);
    const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
    const featureToggles = useSelector(selectFeatureToggles);
    const {
      isCheckInEnabled,
      isLoadingFeatureFlags,
      isPreCheckInEnabled,
      isTranslationDayOfEnabled,
      isTranslationPreCheckInEnabled,
    } = featureToggles;
    const appEnabled = isPreCheckIn ? isPreCheckInEnabled : isCheckInEnabled;
    const { t } = useTranslation();
    if (isLoadingFeatureFlags) {
      return (
        <>
          <va-loading-indicator
            message={t('loading-your-check-in-experience')}
          />
        </>
      );
    }
    if (!appEnabled) {
      window.location.replace('/');
      return <></>;
    }

    // TODO: this is only needed until translations are enabled in prod and the main
    // i18n.js file is updated to load all available translations.
    if (
      ((app === APP_NAMES.PRE_CHECK_IN && isTranslationPreCheckInEnabled) ||
        isTranslationDayOfEnabled) &&
      !i18n.getResource('es')
    ) {
      i18n.addResourceBundle('es', 'translation', es);
      i18n.reloadResources();
    }

    return (
      <>
        <meta name="robots" content="noindex" />
        {/* Allowing for HOC */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...props} {...featureToggles} />
      </>
    );
  };
};

export default withFeatureFlip;
