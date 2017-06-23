import React from 'react';
import { transformForSubmit } from '../common/schemaform/helpers';

export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form);
  return JSON.stringify({
    pensionClaim: {
      form: formData
    }
  });
}

export const employmentDescription = <p className="pension-employment-desc">Please tell us about all of your employment, including self-employment, <strong>from one year before you became disabled</strong> to the present.</p>;

const numberToWords = {
  0: 'First',
  1: 'Second',
  2: 'Third',
  3: 'Fourth',
  4: 'Fifth',
  5: 'Sixth',
  6: 'Seventh',
  7: 'Eighth',
  8: 'Ninth',
  9: 'Tenth'
};

export function getMarriageTitle(index) {
  const desc = numberToWords[index];

  return desc ? `${desc} marriage` : `Marriage ${index + 1}`;
}

export function getMarriageTitleWithCurrent(form, index) {
  if (form.maritalStatus === 'Married' && (form.marriages.length - 1) === index) {
    return 'Current marriage';
  }

  return getMarriageTitle(index);
}

export const spouseContribution = <span>How much do you <strong>contribute monthly</strong> to your spouse’s support?</span>;

export function fileHelp({ formContext }) {
  if (formContext.reviewMode) {
    return null;
  }

  return (
    <p>
      Files we accept: pdf, jpg, png<br/>
      Maximum file size: 2MB
    </p>
  );
}

