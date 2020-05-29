import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { srSubstitute } from '../../all-claims/utils';
import { genderLabels } from 'platform/static-data/labels';
import { selectProfile } from 'platform/user/selectors';

import { makeTitle } from '../helpers';

const mask = srSubstitute('●●●–●●–', 'ending with');

export const veteranInfoView = ({ profile = {}, veteran = {} }) => {
  const { ssnLastFour, vaFileNumber } = veteran;
  const { dob, gender, userFullName } = profile;

  const { first, middle, last, suffix } = userFullName;
  // All caps isn't good for a11y
  const fullName = makeTitle(`${first} ${middle || ''} ${last}`);
  return (
    <>
      <p>This is the personal information we have on file for you.</p>
      <br />
      <div className="blue-bar-block">
        <strong className="name">
          {fullName}
          {suffix && `, ${suffix}`}
        </strong>
        {ssnLastFour && (
          <p className="ssn">
            Social Security number: {mask} {ssnLastFour.slice(-4)}
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
          <span className="gender">
            {(gender && genderLabels[gender]) || ''}
          </span>
        </p>
      </div>
      <br />
      <p>
        <strong>Note:</strong> If you need to update your personal information,
        please call Veterans Benefits Assistance toll free at{' '}
        <a
          href="tel:1-800-827-1000"
          aria-label="8 0 0. 8 2 7. 1 0 0 0."
          className="nowrap"
        >
          800-827-1000
        </a>
        , Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </>
  );
};

export default connect(state => {
  const profile = selectProfile(state);
  const veteran = state.form?.loadedData?.formData;
  return {
    profile,
    veteran,
  };
})(veteranInfoView);
