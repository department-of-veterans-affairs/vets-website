import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import formConfig from './config/form';
import { NoFormPage } from './components/NoFormPage';
import { useBrowserMonitoring } from './hooks/useBrowserMonitoring';
import { submit } from './config/submit';

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
  const pensionDocumentUploadUpdate = useToggleValue(
    TOGGLE_NAMES.pensionDocumentUploadUpdate,
  );
  const pensionModuleEnabled = useToggleValue(
    TOGGLE_NAMES.pensionModuleEnabled,
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
        window.sessionStorage.setItem(
          'showUploadDocuments',
          !!pensionDocumentUploadUpdate,
        );
      }
    },
    [
      isLoadingFeatures,
      pensionMultiplePageResponse,
      pensionIncomeAndAssetsClarification,
      pensionMedicalEvidenceClarification,
      pensionDocumentUploadUpdate,
    ],
  );

  useEffect(
    () => {
      if (pensionModuleEnabled) {
        formConfig.submit = (f, fc) => submit(f, fc, '/pensions/v0/claims');
      }
    },
    [pensionModuleEnabled],
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
