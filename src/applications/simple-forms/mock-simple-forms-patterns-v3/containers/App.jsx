import React from 'react';
// import FormApp from 'platform/forms-system/src/js/containers/FormApp';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { Element } from 'platform/utilities/scroll';
import formConfig from '../config/form';

export default function App({ location, children }) {
  return (
    <div>
      <Element name="topScrollElement" />
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </div>
  );
}
