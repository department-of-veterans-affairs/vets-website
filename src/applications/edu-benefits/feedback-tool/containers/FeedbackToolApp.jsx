import React from 'react';

import RoutedSavableApp from '@department-of-veterans-affairs/platform-forms/RoutedSavableApp';
import formConfig from '../config/form';

export default function FeedbackToolApp({ location, children }) {
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      <div className="tool-app-wrapper">{children}</div>
    </RoutedSavableApp>
  );
}
