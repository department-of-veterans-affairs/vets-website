import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';

import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

import ProfileInfoTable from '../ProfileInfoTable';

const notSetText = 'This information is not available right now.';

const renderGender = gender => {
  let content = notSetText;
  if (gender === 'M') content = 'Male';
  else if (gender === 'F') content = 'Female';
  return content;
};

const renderDOB = dob => (dob ? moment(dob).format('LL') : notSetText);

const GenderAndDOBSection = ({ gender, dob, className }) => (
  <div className={className}>
    <ProfileInfoTable
      data={[
        { title: 'Date of birth', value: renderDOB(dob) },
        { title: 'Gender', value: renderGender(gender) },
      ]}
      className="vads-u-margin-bottom--3"
    />

    <AdditionalInfo triggerText="How do I update my personal information?">
      <h4 className="vads-u-font-size--h5 vads-u-margin--0">
        If you’re enrolled in the VA health care program
      </h4>
      <p className="vads-u-margin--0">
        Please contact your nearest VA medical center to update your personal
        information.
      </p>
      <a href="https://va.gov/find-locations/?facilityType=health">
        Find your nearest VA medical center{' '}
      </a>
      <h4 className="vads-u-font-size--h5 vads-u-margin-bottom--0">
        If you receive VA benefits, but aren’t enrolled in VA health care
      </h4>
      <p className="vads-u-margin--0">
        Please contact your nearest VA regional office to update your personal
        information
      </p>
      <a href="https://va.gov/find-locations/?facilityType=benefits">
        Find your nearest VA regional office
      </a>
    </AdditionalInfo>
  </div>
);

GenderAndDOBSection.propTypes = {
  className: PropTypes.string,
  gender: PropTypes.string.isRequired,
  dob: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  gender: state.vaProfile?.personalInformation?.gender,
  dob: state.vaProfile?.personalInformation?.birthDate,
});

export default connect(mapStateToProps)(GenderAndDOBSection);
