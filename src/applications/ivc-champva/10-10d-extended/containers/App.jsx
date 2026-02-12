import React from 'react';
import PropTypes from 'prop-types';
import { shallowEqual, useSelector } from 'react-redux';
import { DowntimeNotification } from 'platform/monitoring/DowntimeNotification';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';

const App = ({ location, children }) => {
  const isAppLoading = useSelector(
    state => state.featureToggles?.loading || state.user?.profile?.loading,
    shallowEqual,
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
        dependencies={formConfig.downtime.dependencies}
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
