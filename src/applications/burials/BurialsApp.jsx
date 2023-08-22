// import React from 'react';

// import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
// import formConfig from './config/form';

// export default function BurialsEntry({ location, children }) {
//   return (
//     <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
//       {children}
//     </RoutedSavableApp>
//   );
// }

import React from 'react';
// import { Switch, Route, Link, useHistory, useLocation } from 'react-router-dom';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from './config/form';
import { NoFormPage } from './components/NoFormPage'; // Make sure the path to NoFormPage is correct

export default function BurialsEntry({ location, children }) {
  const showForm = false;
  return showForm ? (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  ) : (
    <NoFormPage />
  );
}
