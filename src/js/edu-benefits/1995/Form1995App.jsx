import React from 'react';

import FormApp from '../../common/schemaform/FormApp';
import formConfig from './config/form';
import Perf from 'react-addons-perf';

window.Perf = Perf;

export default function Form1995Entry({ location, children }) {
  return (
    <FormApp formConfig={formConfig} currentLocation={location}>
      {children}
    </FormApp>
  );
}
