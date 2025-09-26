import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { getAppUrl } from 'platform/utilities/registry-helpers';
import formConfig from '../config/form';

const App = ({ location, children }) => {
  const {
    isLoadingFeatureFlags,
    isLoadingProfile,
    isMergedFormEnabled,
  } = useSelector(state => ({
    isLoadingFeatureFlags: state?.featureToggles?.loading,
    isMergedFormEnabled: state.featureToggles.form1010dExtended,
    isLoadingProfile: state.user?.profile?.loading,
  }));
  const isAppLoading = useMemo(
    () => isLoadingFeatureFlags || isLoadingProfile,
    [isLoadingFeatureFlags, isLoadingProfile],
  );

  // redirect to standalone form if feature is disabled
  useEffect(
    () => {
      if (isAppLoading) return;
      if (!isMergedFormEnabled) {
        window.location(getAppUrl('10-10D'));
      }
    },
    [isAppLoading, isMergedFormEnabled],
  );

  return isAppLoading ? (
    <va-loading-indicator
      message="Loading application..."
      class="vads-u-margin-y--4"
      set-focus
    />
  ) : (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      <DowntimeNotification
        appTitle={`CHAMPVA Form ${formConfig.formId}`}
        dependencies={[externalServices.pega]}
      >
        {children}
      </DowntimeNotification>
    </RoutedSavableApp>
  );
};

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};

export default App;
