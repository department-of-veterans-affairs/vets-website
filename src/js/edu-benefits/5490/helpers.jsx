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
  chapter35: 'DEA (Chapter 35)',
  chapter33: 'Fry scholarship (Chapter 33)'
};

export const relationshipLabels = {
  child: 'Child, stepchild, adopted child',
  spouse: 'Spouse or Surviving Spouse',
};

export const highSchoolStatusLabels = {
  graduated: 'Graduated from high school',
  graduationExpected: 'Expect to graduate from high school',
  neverAttended: 'Never attended high school',
  discontinued: 'Discontinued high school',
  ged: 'Awarded GED'
};

