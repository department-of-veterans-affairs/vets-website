import React from 'react';
import { connect } from 'react-redux';

import { genderLabels } from 'platform/static-data/labels';
import { srSubstitute, forceTitleCase, formatDate } from '../utils';
import { editNote } from './common';

const unconnectedVetInfoView = profile => {
  // NOTE: ssn and vaFileNumber will be undefined for the foreseeable future; they're kept in here as a reminder.
  const { ssn, vaFileNumber, dob, gender } = profile;
  const { first, middle, last, suffix } = profile.userFullName;
  const mask = srSubstitute('●●●–●●–', 'ending with');
  // All caps isn't good for a11y
  const fullName = forceTitleCase(`${first} ${middle || ''} ${last}`);
  return (
    <div>
      <p>This is the personal information we have on file for you.</p>
      <div className="blue-bar-block">
        <strong>
          {fullName}
          {suffix && `, ${suffix}`}
        </strong>
        {ssn && (
          <p>
            Social Security number: {mask}
            {ssn.slice(5)}
          </p>
        )}
        {vaFileNumber && (
          <p>
            VA file number: {mask}
            {vaFileNumber.slice(5)}
          </p>
        )}
        <p>Date of birth: {dob ? formatDate(dob) : ''}</p>
        <p>Gender: {genderLabels[gender]}</p>
      </div>
      {editNote('personal information')}
    </div>
  );
};

export const veteranInfoDescription = connect(state => state.user.profile)(
  unconnectedVetInfoView,
);
