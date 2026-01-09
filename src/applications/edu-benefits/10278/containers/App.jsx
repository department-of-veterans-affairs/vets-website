import React from 'react';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import Breadcrumbs from '../components/Breadcrumbs';
import NeedHelp from '../components/NeedHelp';
import { useDefaultFormData } from '../hooks/useDefaultFormData';

export default function App({ location, children }) {
  // Ensure login state is always available in formData for hideIf functions
  // The prefill-transformer only runs when loading saved forms or fetching prefill,
  // so this hook ensures isLoggedIn is set even when starting a new form directly
  useDefaultFormData();

  return (
    <div className="form-22-10278-container row">
      <div className="vads-u-padding-left--0">
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
