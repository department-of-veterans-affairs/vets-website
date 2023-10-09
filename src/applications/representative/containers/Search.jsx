import React from 'react';

import FormFooter from 'platform/forms/components/FormFooter';
import formConfig from '../config/form';

export default function Search() {
  return (
    <>
      <h1>Search</h1>
      <FormFooter formConfig={formConfig} />
    </>
  );
}
