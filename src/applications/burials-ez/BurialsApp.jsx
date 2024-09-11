import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from '@department-of-veterans-affairs/platform-forms/RoutedSavableApp';
import { useBrowserMonitoring } from '~/platform/utilities/real-user-monitoring';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import formConfig from './config/form';
import { NoFormPage } from './components/NoFormPage';

export default function BurialsEntry({ location, children }) {
  const { loading: isLoadingFeatures, burialFormEnabled } = useSelector(
    state => state?.featureToggles,
  );

  const { TOGGLE_NAMES } = useFeatureToggle();
  useBrowserMonitoring({
    location,
    toggleName: TOGGLE_NAMES.disablityBenefitsBrowserMonitoringEnabled,
  });

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

BurialsEntry.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};
