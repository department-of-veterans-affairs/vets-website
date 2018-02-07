import React from 'react';

import EducationDowntime from '../components/EducationDowntime';
import FormApp from '../../common/schemaform/containers/FormApp';
import formConfig from './config/form';

export default function Form5490Entry({ location, children }) {
  return (
    <EducationDowntime>
      <FormApp formConfig={formConfig} currentLocation={location}>
        {children}
      </FormApp>
    </EducationDowntime>
  );
}
