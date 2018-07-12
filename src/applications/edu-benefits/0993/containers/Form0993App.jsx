import React from 'react';

import SinglePageFormApp from './SinglePageFormApp';
import formConfig from '../config/form';

export default function FormOptOutApp({ location, children }) {
  return (
    <SinglePageFormApp formConfig={formConfig} currentLocation={location}>
      {children}
    </SinglePageFormApp>
  );
}
