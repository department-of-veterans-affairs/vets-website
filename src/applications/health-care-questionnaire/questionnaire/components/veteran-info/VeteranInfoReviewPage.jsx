import React from 'react';
import moment from 'moment';

import { genderLabels } from 'platform/static-data/labels';
import { formatPhoneNumber, addressToDisplay } from './utils';

const phonesToDisplay = phones => {
  if (!phones) {
    return [];
  }
  return phones.filter(f => f.data).map(phone => {
    return {
      label: `${phone.label} phone`,
      value: formatPhoneNumber(phone.data.areaCode + phone.data.phoneNumber),
    };
  });
};

export default function VeteranInfoReviewPage({ formData }) {
  const veteran = formData?.veteranInfo;
  const display = [
    {
      label: 'Name',
      value: veteran.fullName,
    },
    {
      label: 'Date of birth',
      value: moment(veteran.dateOfBirth).format('MM/DD/YYYY'),
    },
    {
      label: 'Gender',
      value: genderLabels[veteran.gender]
        ? genderLabels[veteran.gender]
        : 'UNKNOWN',
    },
    addressToDisplay('Mailing address', veteran.addresses?.mailing),
    addressToDisplay('Home address', veteran.addresses?.residential),
    ...phonesToDisplay(veteran.phones),
  ];
  return (
    <>
      <dl
        className="review healthcare-questionnaire-review"
        data-testid="veteran-information"
      >
        {display.map((row, i) => {
          const { label, value } = row;
          return value ? (
            <div key={i} className={`review-row ${i === 0 ? 'top-row' : ''} `}>
              <dt data-testid={`${label}-label`}>{label}</dt>
              <dd data-testid={`${label}-value`}>{value}</dd>
            </div>
          ) : null;
        })}
      </dl>
    </>
  );
}
