import React from 'react';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import formConfig from '../config/form';
// import Breadcrumbs from '../components/Breadcrumbs';

export default function App({ location, children }) {
  return (
    <>
      {/* <Breadcrumbs /> */}
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        <DowntimeNotification
          appTitle="28-1900"
          dependencies={[externalServices.chapter31]}
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
