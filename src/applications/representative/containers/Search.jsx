import React from 'react';

import FormFooter from '@department-of-veterans-affairs/platform-forms/FormFooter';
import formConfig from '../config/form';

export default function Search() {
  return (
    <>
      <h1>Search</h1>
      <FormFooter formConfig={formConfig} />
    </>
  );
}
