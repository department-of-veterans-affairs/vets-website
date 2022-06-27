import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import { renderDOB } from '../../util/personal-information/personalInformationUtils';

import ProfileInfoTable from '../ProfileInfoTable';

const LegacyGenderAndDOBSection = ({ dob, className }) => (
  <div className={className}>
    <div className="vads-u-margin-bottom--2">
      <AdditionalInfo triggerText="How do I update my personal information?">
        <h2 className="vads-u-font-size--h5 vads-u-margin-top--3">
          If you’re enrolled in the VA health care program
        </h2>
        <p className="vads-u-margin-y--1">
          Please contact your nearest VA medical center to update your personal
          information.
        </p>
        <a href="/find-locations/?facilityType=health">
          Find your nearest VA medical center{' '}
        </a>
        <h2 className="vads-u-font-size--h5 vads-u-margin-top--3 vads-u-margin-bottom--1">
          If you receive VA benefits, but aren’t enrolled in VA health care
        </h2>
        <p className="vads-u-margin-y--1">
          Please contact your nearest VA regional office to update your personal
          information
        </p>
        <a href="/find-locations/?facilityType=benefits">
          Find your nearest VA regional office
        </a>
      </AdditionalInfo>
    </div>
    <ProfileInfoTable
      title="Personal information"
      data={[{ title: 'Date of birth', value: renderDOB(dob) }]}
      className="vads-u-margin-bottom--3"
      level={2}
    />
  </div>
);

LegacyGenderAndDOBSection.propTypes = {
  dob: PropTypes.string.isRequired,
  className: PropTypes.string,
};

const mapStateToProps = state => ({
  dob: state.vaProfile?.personalInformation?.birthDate,
});

export default connect(mapStateToProps)(LegacyGenderAndDOBSection);
