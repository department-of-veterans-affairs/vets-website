import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from '@department-of-veterans-affairs/platform-forms/RoutedSavableApp';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { useBrowserMonitoring } from './hooks/useBrowserMonitoring';
import formConfig from './config/form';
import { NoFormPage } from './components/NoFormPage';

export default function BurialsEntry({ location, children }) {
  const { loading: isLoadingFeatures, burialFormEnabled } = useSelector(
    state => state?.featureToggles,
  );

  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const burialModuleEnabled = useToggleValue(TOGGLE_NAMES.burialModuleEnabled);

  useBrowserMonitoring();

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
    <RoutedSavableApp
      formConfig={formConfig}
      burialModuleEnabled={burialModuleEnabled}
      currentLocation={location}
    >
      {children}
    </RoutedSavableApp>
  );
}

BurialsEntry.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};
