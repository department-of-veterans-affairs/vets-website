/* eslint-disable react/sort-prop-types */
import React from 'react';

import proptypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';

export default function App({ location, children }) {
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

App.propTypes = {
  location: proptypes.object,
  children: proptypes.element,
};
