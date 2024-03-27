import React, { useEffect } from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import { fetchBranches } from '../utils/serviceBranches';

export default function App({ location, children }) {
  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}
