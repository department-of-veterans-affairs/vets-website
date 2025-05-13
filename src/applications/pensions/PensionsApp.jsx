import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import IntentToFile from 'platform/shared/itf/IntentToFile';

import formConfig from './config/form';
import { NoFormPage } from './components/NoFormPage';
import { useBrowserMonitoring } from './hooks/useBrowserMonitoring';

export default function PensionEntry({ location, children }) {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const pensionFormEnabled = useToggleValue(TOGGLE_NAMES.pensionFormEnabled);
  const pensionMultiplePageResponse = useToggleValue(
    TOGGLE_NAMES.pensionMultiplePageResponse,
  );
  const pensionIncomeAndAssetsClarification = useToggleValue(
    TOGGLE_NAMES.pensionIncomeAndAssetsClarification,
  );
  const pensionMedicalEvidenceClarification = useToggleValue(
    TOGGLE_NAMES.pensionMedicalEvidenceClarification,
  );

  const pensionItfEnabled = useToggleValue(TOGGLE_NAMES.pensionItfEnabled);
  const pensionItfShowAlert = useToggleValue(TOGGLE_NAMES.pensionItfShowAlert);

  const isLoadingFeatures = useSelector(
    state => state?.featureToggles?.loading,
  );
  const redirectToHowToPage =
    pensionFormEnabled === false &&
    !location.pathname?.includes('/introduction');
  if (redirectToHowToPage === true) {
    window.location.href = '/pension/survivors-pension/';
  }

  // Add Datadog UX monitoring to the application
  useBrowserMonitoring();

  useEffect(
    () => {
      if (!isLoadingFeatures) {
        window.sessionStorage.setItem(
          'showMultiplePageResponse',
          pensionMultiplePageResponse,
        );
        window.sessionStorage.setItem(
          'showIncomeAndAssetsClarification',
          pensionIncomeAndAssetsClarification,
        );
        window.sessionStorage.setItem(
          'showPensionEvidenceClarification',
          !!pensionMedicalEvidenceClarification,
        );
      }
    },
    [
      isLoadingFeatures,
      pensionMultiplePageResponse,
      pensionIncomeAndAssetsClarification,
      pensionMedicalEvidenceClarification,
    ],
  );

  if (isLoadingFeatures !== false || redirectToHowToPage) {
    return <va-loading-indicator message="Loading application..." />;
  }

  if (!pensionFormEnabled) {
    return <NoFormPage />;
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {pensionItfEnabled &&
        pensionItfShowAlert && (
          <IntentToFile itfType="pension" location={location} />
        )}
      {children}
    </RoutedSavableApp>
  );
}
PensionEntry.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};
