import React from 'react';
import { transformForSubmit } from '../common/schemaform/helpers';

export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form);
  return JSON.stringify({
    form: formData
  });
}

export const employmentDescription = <p>Please tell us about all of your employment, including self-employment, <strong>from one year before you became disabled</strong> to the present.</p>;

const numberToWords = {
  0: 'First',
  1: 'Second',
  2: 'Third',
  4: 'Fourth',
  5: 'Fifth',
  6: 'Sixth',
  7: 'Seventh',
  8: 'Eighth',
  9: 'Ninth',
  10: 'Tenth'
};

export function getMarriageTitle(index) {
  const desc = numberToWords[index];

  return desc ? `${desc} marriage` : `Marriage ${index + 1}`;
}
