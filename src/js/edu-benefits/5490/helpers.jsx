import React from 'react';
import { transformForSubmit } from '../../common/schemaform/helpers';

export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form);
  return JSON.stringify({
    educationBenefitsClaim: {
      form: formData
    }
  });
}

export const benefitsLabels = {
  chapter35: <p>Survivors’ and Dependents’ Assistance (DEA, Chapter 35)<br/><a href="/education/gi-bill/survivors-dependent-assistance/fry-scholarship/" target="_blank">Learn more</a></p>,
  chapter33: <p>The Fry Scholarship (Chapter 33)<br/><a href="/education/gi-bill/survivors-dependent-assistance/dependents-education/" target="_blank">Learn more</a></p>,
};

export const relationshipLabels = {
  child: 'Child, stepchild, adopted child',
  spouse: 'Spouse or surviving spouse',
};

export const highSchoolStatusLabels = {
  graduated: 'Graduated from high school',
  graduationExpected: 'Expect to graduate from high school',
  neverAttended: 'Never attended high school',
  discontinued: 'Discontinued or stopped high school',
  ged: 'Awarded GED'
};
