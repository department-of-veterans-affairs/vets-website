import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import RoutedSavableApp from '@department-of-veterans-affairs/platform-forms/RoutedSavableApp';
import { useFeatureToggle } from '@department-of-veterans-affairs/platform-utilities/feature-toggles';
import formConfig from '../config/form';
import { NoFormPage } from '../components/NoFormPage';

export default function App({ location, children }) {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const incomeAndAssetsFormEnabled = useToggleValue(
    TOGGLE_NAMES.incomeAndAssetsFormEnabled,
  );

  const isLoadingFeatures = useSelector(
    state => state?.featureToggles?.loading ?? false,
  );

  if (isLoadingFeatures) {
    return <va-loading-indicator message="Loading application..." />;
  }

  if (!incomeAndAssetsFormEnabled) {
    return <NoFormPage />;
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

App.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};
