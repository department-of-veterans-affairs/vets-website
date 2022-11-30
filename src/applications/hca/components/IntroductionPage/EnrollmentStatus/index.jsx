import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getEnrollmentStatus as getEnrollmentStatusAction } from '../../../utils/actions';
import EnrollmentStatusWarning from './Warning';
import EnrollmentStatusFAQ from './FAQ';

const EnrollmentStatus = props => {
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

EnrollmentStatus.propTypes = {
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

export { EnrollmentStatus };
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EnrollmentStatus);
