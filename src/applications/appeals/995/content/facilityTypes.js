import React from 'react';

import readableList from 'platform/forms-system/src/js/utilities/data/readableList';

export const facilityTypeTitle =
  'Select all the types of facilities or providers that treated you';

export const facilityTypeTextLabel =
  'Specify any other types of facility or provider';

export const facilityTypeChoices = {
  vamc: 'A VA medical center (also called a VAMC)',
  cboc: 'A community-based outpatient clinic (also called a CBOC)',
  mtf:
    'A Department of Defense military treatment facility (also called an MTF)',
  ccp: 'A community care provider that VA paid for',
  vetCenter: {
    title: 'A VA Vet center',
    description: 'Vet Centers are community-based counseling centers.',
  },
  nonVa: {
    title: 'A non-VA healthcare provider',
    description:
      'This includes providers who aren’t community care providers, and who don’t work at a military treatment facility.',
  },
};

// Submission data
export const facilityTypeSubmissionChoices = {
  nonVa: 'PRIVATE HEALTH CARE PROVIDER',
  vetCenter: 'VA VET CENTER',
  ccp: 'COMMUNITY CARE',
  vamcCobc:
    'VA MEDICAL CENTERS (VAMC) AND COMMUNITY-BASED OUTPATIENT CLINICS (CBOC)',
  mtf: 'DEPARTMENT OF DEFENSE (DOD) MILITARY TREATMENT FACILITY(IES) (MTF)',
  other: 'OTHER',
};

export const facilityTypeError =
  'You must select or specify at least one facility type';

export const facilityTypeList = formData => {
  const selected = Object.entries(formData || {}).filter(
    ([_key, value]) => value,
  );

  return readableList(
    selected.map(([key, value]) => {
      if (key in facilityTypeChoices) {
        return facilityTypeChoices[key]?.title || facilityTypeChoices[key];
      }
      // "Other" value is a string
      return key === 'other' ? value : 'Unknown facility type choice';
    }),
  );
};

export const facilityTypeReviewField = ({ formData }) => (
  <div className="review-row">
    <dt>{facilityTypeTitle}</dt>
    <dd className="dd-privacy-hidden" data-dd-action-name="facility type">
      {facilityTypeList(formData)}
    </dd>
  </div>
);
