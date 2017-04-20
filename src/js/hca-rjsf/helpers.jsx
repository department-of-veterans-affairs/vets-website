import React from 'react';
import { transformForSubmit } from '../common/schemaform/helpers';

export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form);
  return JSON.stringify({
    healthCareApplication: {
      form: formData
    }
  });
}

export function FacilityHelp() {
  return <div>OR <a href="/facilities" target="_blank">Find locations with the VA Facility Locator</a></div>;
}
