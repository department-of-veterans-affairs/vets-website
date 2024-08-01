import React from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';

const config = formConfig();

const App = ({ location, children }) => {
  return (
    <RoutedSavableApp formConfig={config} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
};

export default App;
