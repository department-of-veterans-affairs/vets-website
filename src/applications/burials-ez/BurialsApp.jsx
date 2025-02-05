import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from '@department-of-veterans-affairs/platform-forms/RoutedSavableApp';
import { useBrowserMonitoring } from './hooks/useBrowserMonitoring';
import formConfig from './config/form';
import { NoFormPage } from './components/NoFormPage';

export default function BurialsApp({ location, children }) {
  const {
    loading: isLoadingFeatures,
    burialFormEnabled,
    burialDocumentUploadUpdate,
    burialLocationOfDeathUpdate,
    burialModuleEnabled,
  } = useSelector(state => state?.featureToggles);

  // Conditional to use new Burial module path in vets-api if enabled
  formConfig.submitUrl = burialModuleEnabled
    ? '/burials/v0/claims'
    : '/v0/burial_claims';

  useBrowserMonitoring();

  useEffect(
    () => {
      if (!isLoadingFeatures) {
        window.sessionStorage.setItem(
          'showLocationOfDeath',
          !!burialLocationOfDeathUpdate,
        );
        window.sessionStorage.setItem(
          'showUploadDocuments',
          !!burialDocumentUploadUpdate,
        );
      }
    },
    [
      isLoadingFeatures,
      burialLocationOfDeathUpdate,
      burialDocumentUploadUpdate,
    ],
  );

  if (isLoadingFeatures) {
    return <va-loading-indicator message="Loading application..." />;
  }

  if (!burialFormEnabled) {
    if (location.pathname !== '/introduction') {
      window.location.href = '/burials-memorials/veterans-burial-allowance/';
      return <></>;
    }
    return <NoFormPage />;
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

BurialsApp.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};
