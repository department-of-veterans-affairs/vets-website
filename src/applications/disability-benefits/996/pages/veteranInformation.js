import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { srSubstitute } from '../../all-claims/utils';
import { genderLabels } from 'platform/static-data/labels';

const mask = srSubstitute('●●●–●●–', 'ending with');

export const veteranInfoView = profile => {
  const { ssn, vaFileNumber, dob, gender } = profile;
  const {
    first = '',
    middle = '',
    last = '',
    suffix = '',
  } = profile.userFullName;
  return (
    <>
      <p>This is the personal information we have on file for you.</p>
      <br />
      <div className="blue-bar-block">
        <strong className="name">
          {first} {middle} {last} {suffix}
        </strong>
        {ssn && (
          <p className="ssn">
            Social Security number: {mask} {ssn.slice(-4)}
          </p>
        )}
        {vaFileNumber && (
          <p className="vafn">
            VA file number: {mask} {vaFileNumber.slice(-4)}
          </p>
        )}
        <p>
          Date of birth:{' '}
          <span className="dob">{dob ? moment(dob).format('LL') : ''}</span>
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

export const veteranInfoDescription = connect(state => state.user?.profile)(
  veteranInfoView,
);
