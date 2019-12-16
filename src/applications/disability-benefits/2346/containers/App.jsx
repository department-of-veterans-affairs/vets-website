import React from 'react';

import RoutedSavableApp from '../../../../platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
// import { Provider } from 'react-redux';
// import store from '../store';

export default function App({ location, children }) {
  return (
    // <Provider store={store}>
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
    // </Provider>
  );
}
