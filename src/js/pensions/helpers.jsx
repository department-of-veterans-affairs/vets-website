import React from 'react';
import { transformForSubmit } from '../common/schemaform/helpers';

export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form);
  return JSON.stringify({
    form: formData
  });
}

export const employmentDescription = <p>Please tell us about all of your employment, including self-employment, <strong>from one year before you became disabled</strong> to the present.</p>;
