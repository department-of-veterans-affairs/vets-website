import React from 'react';

import readableList from 'platform/forms-system/src/js/utilities/data/readableList';

export const facilityTypeTitle =
  'Select all the types of facilities or providers that treated you';

export const facilityTypeTextLabel = 'Specify any other facility or provider';

export const facilityTypeChoices = {
  vetCenter: 'A VA Vet center',
  ccp: 'A community care provider that VA paid for',
  vamc: 'A VA medical center (also called a VAMC)',
  cboc: 'A community-based outpatient clinic (also called a CBOC)',
  mtf:
    'A Department of Defense military treatment facility (also called an MTF)',
  nonVa: {
    title: 'A non-VA healthcare provider',
    description:
      'This includes providers who aren’t community care providers, and who don’t work at a military treatment facility. We’ll need to get your permission to get your medical records from this type of provider. Or you can upload these medical records yourself later in this application.',
  },
};

export const facilityTypeReviewField = ({ formData }) => {
  const selected = Object.entries(formData).filter(([_key, value]) => value);

  const list = readableList(
    selected.map(([key, value]) => {
      if (key in facilityTypeChoices) {
        return facilityTypeChoices[key]?.title || facilityTypeChoices[key];
      }
      // "Other" value is a string
      return key === 'other' ? value : 'Unknown facility type choice';
    }),
  );

  return (
    <div className="review-row">
      <dt>{facilityTypeTitle}</dt>
      <dd className="dd-privacy-hidden" data-dd-action-name="facility type">
        {list}
      </dd>
    </div>
  );
};
