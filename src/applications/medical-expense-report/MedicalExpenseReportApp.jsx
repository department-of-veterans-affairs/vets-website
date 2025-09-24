import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import IntentToFile from 'platform/shared/itf/IntentToFile';

import formConfig from './config/form';
import { NoFormPage } from './components/NoFormPage';
import { useBrowserMonitoring } from './hooks/useBrowserMonitoring';

export default function MedicalExpenseReportEntry({ location, children }) {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const medicalExpenseReportFormEnabled = useToggleValue(
    TOGGLE_NAMES.medicalExpenseReportFormEnabled,
  );
  const pensionMultiplePageResponse = useToggleValue(
    TOGGLE_NAMES.pensionMultiplePageResponse,
  );

  const isLoadingFeatures = useSelector(
    state => state?.featureToggles?.loading,
  );
  const redirectToHowToPage =
    medicalExpenseReportFormEnabled === false &&
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
      }
    },
    [isLoadingFeatures, pensionMultiplePageResponse],
  );

  if (isLoadingFeatures !== false || redirectToHowToPage) {
    return <va-loading-indicator message="Loading application..." />;
  }

  if (!medicalExpenseReportFormEnabled) {
    return <NoFormPage />;
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      <IntentToFile itfType="pension" location={location} disableAutoFocus />
      {children}
    </RoutedSavableApp>
  );
}
MedicalExpenseReportEntry.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};
