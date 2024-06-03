import React from 'react';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import NeedHelpFooter from '../components/NeedHelpFooter';
import formConfig from '../config/form';

const App = ({ location, children }) => {
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
      <NeedHelpFooter />
    </RoutedSavableApp>
  );
};

App.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};

export default App;
