import React from 'react';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import formConfig from '../config/form';

export default function App({ location, children }) {
  return (
    <>
      {/* <Breadcrumbs /> */}
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        <DowntimeNotification
          appTitle="Veteran Readiness"
          dependencies={[externalServices.vre]}
        >
          {children}
        </DowntimeNotification>
      </RoutedSavableApp>
    </>
  );
}

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};
