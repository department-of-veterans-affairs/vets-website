import React, { useContext } from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { PatternConfigContext } from '../context/PatternConfigContext';
// import formConfig from '../config/form';

export default function App({ location, children }) {
  const formConfig = useContext(PatternConfigContext);
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}
