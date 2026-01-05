import React, { useEffect } from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import { getFormContent } from '../helpers';

const config = formConfig();

const App = ({ location, children }) => {
  const { formNumber } = getFormContent();

  useEffect(
    () => {
      document.title = `Upload form ${formNumber} | Veterans Affairs`;
    },
    [formNumber],
  );

  return (
    <RoutedSavableApp formConfig={config} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
};

export default App;
