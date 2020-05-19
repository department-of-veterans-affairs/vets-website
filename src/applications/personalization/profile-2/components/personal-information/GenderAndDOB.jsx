import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

import ProfileInfoTable from '../ProfileInfoTable';

const formatGender = gender => {
  let content = 'This information is not available right now.';
  if (gender === 'M') content = 'Male';
  else if (gender === 'F') content = 'Female';
  return content;
};

const formatDOB = dob => {
  let content = 'This information is not available right now.';
  if (dob) {
    content = moment(dob).format('LL');
  }
  return content;
};

const GenderAndDOB = ({ gender, dob, className }) => (
  <div className={className}>
    {/* table for dob and gender */}
    <ProfileInfoTable
      data={[
        { title: 'Date of birth', value: formatDOB(dob) },
        { title: 'Gender', value: formatGender(gender) },
      ]}
      className="vads-u-margin-bottom--3"
    />

    {/* more info component for updating personal info  */}
    <AdditionalInfo triggerText="How do I update my personal information?">
      more info
    </AdditionalInfo>
  </div>
);

const mapStateToProps = state => ({
  gender: state.vaProfile?.personalInformation?.gender,
  dob: state.vaProfile?.personalInformation?.birthDate,
});

export default connect(mapStateToProps)(GenderAndDOB);
