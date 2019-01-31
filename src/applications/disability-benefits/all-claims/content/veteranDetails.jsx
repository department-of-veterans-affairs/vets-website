import React from 'react';
import { connect } from 'react-redux';
import { DateWidget } from 'us-forms-system/lib/js/review/widgets';
import { genderLabels } from '../../../../platform/static-data/labels';
import { srSubstitute } from '../utils';
import { editNote } from './common';

const unconnectedVetInfoView = profile => {
  // NOTE: ssn and vaFileNumber will be undefined for the foreseeable future; they're kept in here as a reminder.
  const { ssn, vaFileNumber, dob, gender } = profile;
  const { first, middle, last, suffix } = profile.userFullName;
  const mask = srSubstitute('●●●–●●–', 'ending with');
  return (
    <div>
      <p>This is the personal information we have on file for you.</p>
      <div className="blue-bar-block">
        <strong>
          {first} {middle} {last} {suffix}
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
        <p>
          Date of birth:{' '}
          <DateWidget value={dob} options={{ monthYear: false }} />
        </p>
        <p>Gender: {genderLabels[gender]}</p>
      </div>
      {editNote('personal information')}
    </div>
  );
};

export const veteranInfoDescription = connect(state => state.user.profile)(
  unconnectedVetInfoView,
);
