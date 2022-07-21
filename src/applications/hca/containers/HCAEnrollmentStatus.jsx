import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import EnrollmentStatusWarning from '../components/FormAlerts/EnrollmentStatusWarning';
import EnrollmentStatusFAQ from '../components/EnrollmentStatus/EnrollmentStatusFAQ';
import { getEnrollmentStatus } from '../actions';

const HCAEnrollmentStatus = props => {
  const { enrollmentStatus, route } = props;

  useEffect(() => {
    props.getEnrollmentStatus();
  });

  return enrollmentStatus ? (
    <>
      <EnrollmentStatusWarning {...props} />
      <EnrollmentStatusFAQ enrollmentStatus={enrollmentStatus} route={route} />
    </>
  ) : null;
};

HCAEnrollmentStatus.propTypes = {
  enrollmentStatus: PropTypes.string,
  getEnrollmentStatus: PropTypes.func,
  route: PropTypes.object,
};

const mapStateToProps = state => {
  const {
    applicationDate,
    enrollmentDate,
    enrollmentStatus,
    preferredFacility,
  } = state.hcaEnrollmentStatus;
  return {
    applicationDate,
    enrollmentDate,
    enrollmentStatus,
    preferredFacility,
  };
};

const mapDispatchToProps = {
  getEnrollmentStatus,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HCAEnrollmentStatus);
