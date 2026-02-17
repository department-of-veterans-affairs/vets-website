import React, { useLayoutEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { shallowEqual, useSelector } from 'react-redux';
import { DowntimeNotification } from 'platform/monitoring/DowntimeNotification';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';

const App = ({ location, children }) => {
  const { isAppLoading, isAppEnabled } = useSelector(
    state => ({
      isAppLoading:
        state?.featureToggles?.loading || state.user?.profile?.loading,
      isAppEnabled: state.featureToggles?.form107959f2,
    }),
    shallowEqual,
  );

  const [routeChecked, setRouteChecked] = useState(false);

  useLayoutEffect(
    () => {
      if (isAppLoading) return;
      if (!isAppEnabled) {
        window.location.replace('/health-care/foreign-medical-program');
        return;
      }
      setRouteChecked(true);
    },
    [isAppLoading, isAppEnabled],
  );

  return isAppLoading || !routeChecked ? (
    <va-loading-indicator
      message="Loading application..."
      class="vads-u-margin-y--4"
      set-focus
    />
  ) : (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      <DowntimeNotification
        appTitle={formConfig.subTitle}
        dependencies={formConfig.downtime.dependencies}
      >
        {children}
      </DowntimeNotification>
    </RoutedSavableApp>
  );
};

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
    href: PropTypes.string,
  }),
};

export default App;
