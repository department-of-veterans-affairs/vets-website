import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import formConfig from './config/form';
import { NoFormPage } from './components/NoFormPage';
import {
  addMultiresponseStyles,
  removeMultiresponseStyles,
} from './multiresponseStyles';
import {
  removeSessionMultiresponseStyles,
  setSessionMultiresponseStyles,
} from './helpers';

export default function PensionEntry({ location, children }) {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const pensionFormEnabled = useToggleValue(TOGGLE_NAMES.pensionFormEnabled);
  const pensionMultiresponseStyles = useToggleValue(
    TOGGLE_NAMES.pensionMultiresponseStyles,
  );
  const isLoadingFeatures = useSelector(
    state => state?.featureToggles?.loading,
  );
  const redirectToHowToPage =
    pensionFormEnabled === false &&
    !location.pathname?.includes('/introduction');
  if (redirectToHowToPage === true) {
    window.location.href = '/pension/survivors-pension/';
  }

  useEffect(
    () => {
      if (isLoadingFeatures === false) {
        if (pensionMultiresponseStyles) {
          // TODO: Move styles to pensions.scss when we remove the flipper
          addMultiresponseStyles();
          // TODO: Remove sessionStorage calls when removing the flipper
          setSessionMultiresponseStyles();
        } else {
          removeMultiresponseStyles();
          removeSessionMultiresponseStyles();
        }
      }
    },
    [isLoadingFeatures, pensionMultiresponseStyles],
  );

  if (isLoadingFeatures !== false || redirectToHowToPage) {
    return <va-loading-indicator message="Loading application..." />;
  }

  if (!pensionFormEnabled) {
    return <NoFormPage />;
  }
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}
PensionEntry.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};
