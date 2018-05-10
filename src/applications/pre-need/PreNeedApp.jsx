import React from 'react';

import FormApp from '../common/schemaform/containers/FormApp';
import formConfig from './config/form';

export default function PreNeedApp({ location, children }) {
  return (
    <FormApp formConfig={formConfig} currentLocation={location}>
      {children}
    </FormApp>
  );
}
