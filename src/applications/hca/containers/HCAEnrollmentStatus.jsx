import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import EnrollmentStatusWarning from '../components/FormAlerts/EnrollmentStatusWarning';
import EnrollmentStatusFAQ from '../components/EnrollmentStatus/EnrollmentStatusFAQ';
import { getEnrollmentStatus as getEnrollmentStatusAction } from '../actions';

const HCAEnrollmentStatus = props => {
  const { route, enrollmentStatus, getEnrollmentStatus } = props;

  useEffect(() => {
    getEnrollmentStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  getEnrollmentStatus: getEnrollmentStatusAction,
};

export { HCAEnrollmentStatus };
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HCAEnrollmentStatus);
