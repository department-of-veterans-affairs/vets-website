import React from 'react';
import { connect } from 'react-redux';
import { DateWidget } from 'us-forms-system/lib/js/review/widgets';

import { genderLabels } from '../../../../../platform/static-data/labels';
import srSubstitute from '../../utils';

const unconnectedVetInfoView = (profile) => {
  // NOTE: ssn and vaFileNumber will be undefined for the foreseeable future; they're kept in here as a reminder.
  const { ssn, vaFileNumber, dob, gender } = profile;
  const { first, middle, last, suffix } = profile.userFullName;
  const mask = srSubstitute('●●●–●●–', 'ending with');
  return (
    <div>
      <p>
        This is the personal information we have on file for you.
      </p>
      <div className="blue-bar-block">
        <strong>{first} {middle} {last} {suffix}</strong>
        {ssn && <p>Social Security number: {mask}{ssn.slice(5)}</p>}
        {vaFileNumber && <p>VA file number: {mask}{vaFileNumber.slice(5)}</p>}
        <p>Date of birth: <DateWidget value={dob} options={{ monthYear: false }}/></p>
        <p>Gender: {genderLabels[gender]}</p>
      </div>
      <p>
        <strong>Note:</strong> If you need to update your {name}, please call Veterans
        Benefits Assistance at <a href="tel:1-800-827-1000">1-800-827-1000</a>,
        Monday through Friday, 8:00 a.m. to 9:00 p.m. (ET).
      </p>
    </div>
  );
};

export default connect((state) => state.user.profile)(unconnectedVetInfoView);
