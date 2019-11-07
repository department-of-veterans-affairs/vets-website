import React from 'react';
import moment from 'moment';

import MaskedNumber from '../components/MaskedNumber';
import { genderLabels } from 'platform/static-data/labels';

const veteranDetailsDescription = data => {
  const {
    fullName,
    last4SSN,
    last4VAFile,
    gender,
    dateOfBirth,
  } = data?.formData;

  return (
    <>
      <p>This is the personal information we have on file for you.</p>
      <br />
      <div className="blue-bar-block">
        <p>
          <strong>{`${fullName?.first || ''} ${fullName?.last || ''}`}</strong>
        </p>
        <p>
          Social Security number: <MaskedNumber number={last4SSN} />
        </p>
        <p>
          VA file number: <MaskedNumber number={last4VAFile} />
        </p>
        <p>
          Date of birth:{' '}
          <span className="dob">
            {dateOfBirth ? moment(dateOfBirth).format('L') : ''}
          </span>
        </p>
        <p>
          Gender:{' '}
          <span className="gender">{gender ? genderLabels[gender] : ''}</span>
        </p>
      </div>
      <br />
      <p>
        <strong>Note:</strong> If you need to update your personal information,
        please call Veterans Benefits Assistance toll free at{' '}
        <a className="nowrap" href="tel:1-800-827-1000">
          800-827-1000
        </a>
        , Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </>
  );
};

export default veteranDetailsDescription;
