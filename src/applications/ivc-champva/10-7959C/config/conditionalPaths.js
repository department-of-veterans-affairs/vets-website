/*
This file will hold `depends` functions that get reused
multiple times - this helps keep track of the various
conditional paths the user may take through the form
and also helps reduce copy/pasting the same `depends` a lot.
*/

import get from 'platform/utilities/data/get';

export function hasMedicareAB(formData, index) {
  if (index === undefined) return true;
  return (
    get('applicantMedicareStatus.enrollment', formData?.applicants?.[index]) ===
    'yes'
  );
}

export function hasMedicareD(formData, index) {
  if (index === undefined) return true;
  return (
    get(
      'applicantMedicareStatusD.enrollment',
      formData?.applicants?.[index],
    ) === 'yes'
  );
}

export function noMedicareAB(formData, index) {
  if (index === undefined) return true;
  return (
    get('applicantMedicareStatus.enrollment', formData?.applicants?.[index]) ===
    'no'
  );
}

export function hasPrimaryProvider(formData, index) {
  if (index === undefined) return true;
  return (
    get('applicantHasPrimary.hasPrimary', formData?.applicants?.[index]) ===
    'yes'
  );
}
