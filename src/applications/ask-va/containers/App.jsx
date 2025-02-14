import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import PropTypes from 'prop-types';
import React from 'react';
import BreadCrumbs from '../components/BreadCrumbs';
import ProgressBar from '../components/ProgressBar';
import formConfig from '../config/form';

export default function App({ location, children }) {
  return (
    <>
      <BreadCrumbs currentLocation={location.pathname} />
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        <ProgressBar pathname={location.pathname} />
        {children}
      </RoutedSavableApp>
    </>
  );
}

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};
