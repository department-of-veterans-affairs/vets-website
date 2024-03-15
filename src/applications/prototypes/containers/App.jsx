import React from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
// import '@department-of-veterans-affairs/formation/dist/formation.min.css';
//import '@department-of-veterans-affairs/formation/sass/full.scss';
// import 'uswds/dist/css/uswds.css';
// import 'va-design-system/dist/sass/design-system.scss';
//import '../components/va-design-system-codepen-base.scss';

export default function App({ location, children }) {
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}
