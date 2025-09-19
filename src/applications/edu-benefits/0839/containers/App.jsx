import React from 'react';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import NeedHelp from '../components/NeedHelp';
import Breadcrumbs from '../components/Breadcrumbs';

export default function App({ location, children }) {
  return (
    <div className="form-22-0839-container row">
      <div className="layout-wrapper">
        <Breadcrumbs />
      </div>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
      <NeedHelp />
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};
