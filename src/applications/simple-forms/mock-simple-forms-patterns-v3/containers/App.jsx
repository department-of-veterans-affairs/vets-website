import React from 'react';
import FormApp from 'platform/forms-system/src/js/containers/FormApp';
import { Element } from 'platform/utilities/scroll';

import formConfig from '../config/form';

export default function App({ location, children }) {
  return (
    <div>
      <Element name="topScrollElement" />
      <FormApp formConfig={formConfig} currentLocation={location}>
        {children}
      </FormApp>
    </div>
  );
}
