import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { APP_NAMES } from '../utils/appConstants';
import { makeSelectApp } from '../selectors';
import { makeSelectFeatureToggles } from '../utils/selectors/feature-toggles';

const withTranslationEnabled = WrappedComponent => props => {
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);

  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const {
    isTranslationDayOfEnabled,
    isTranslationPreCheckInEnabled,
    isTranslationDisclaimerSpanishEnabled,
  } = useSelector(selectFeatureToggles);

  if (
    (app === APP_NAMES.PRE_CHECK_IN && !isTranslationPreCheckInEnabled) ||
    !isTranslationDayOfEnabled
  ) {
    return <></>;
  }

  // Allowing for HOC
  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <WrappedComponent
      {...props}
      spanishDisclaimer={isTranslationDisclaimerSpanishEnabled}
    />
  );
};

export default withTranslationEnabled;
