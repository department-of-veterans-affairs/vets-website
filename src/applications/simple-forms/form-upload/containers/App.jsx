import React from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import { getFormContent } from '../helpers';

const formContent = getFormContent();
const config = formConfig(formContent);

const App = ({ location, children }) => {
  return (
    <RoutedSavableApp formConfig={config} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
};

export default App;
