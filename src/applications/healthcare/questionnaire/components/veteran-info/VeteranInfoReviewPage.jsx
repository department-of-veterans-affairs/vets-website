import React from 'react';
import moment from 'moment';

import { genderLabels } from 'platform/static-data/labels';
import { formatPhoneNumber, addressToDisplay } from './utils';

const phonesToDisplay = phones => {
  return phones.filter(f => f.data).map(phone => {
    return {
      label: phone.label,
      value: formatPhoneNumber(phone.data.areaCode + phone.data.phoneNumber),
    };
  });
};

export default function VeteranInfoReviewPage({ formData }) {
  const veteran = formData?.veteranInfo;
  const display = [
    {
      label: 'Full Name',
      value: veteran.fullName,
    },
    {
      label: 'Date of Birth',
      value: moment(veteran.dateOfBirth).format('MMMM DD, YYYY'),
    },
    {
      label: 'Gender',
      value: genderLabels[veteran.gender]
        ? genderLabels[veteran.gender]
        : 'UNKNOWN',
    },
    ...addressToDisplay(veteran.addresses?.mailing),
    ...addressToDisplay(veteran.addresses?.residential),
    ...phonesToDisplay(veteran.phones),
  ];
  return (
    <>
      <dl className="review">
        {display.map((row, i) => {
          const { label, value } = row;
          return value ? (
            <div key={i} className="review-row">
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ) : null;
        })}
      </dl>
    </>
  );
}
