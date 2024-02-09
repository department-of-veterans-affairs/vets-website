import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { getEnrollmentStatus as getEnrollmentStatusAction } from '../../../utils/actions/enrollment-status';
import { selectEnrollmentStatus } from '../../../utils/selectors';
import EnrollmentStatusWarning from './Warning';
import EnrollmentStatusFAQ from './FAQ';

const EnrollmentStatus = props => {
  const {
    applicationDate,
    enrollmentDate,
    enrollmentStatus,
    preferredFacility,
  } = useSelector(selectEnrollmentStatus);
  const { route, getEnrollmentStatus } = props;

  const alertProps = {
    applicationDate,
    enrollmentDate,
    enrollmentStatus,
    preferredFacility,
  };

  const faqProps = { enrollmentStatus, route };

  useEffect(() => {
    getEnrollmentStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return enrollmentStatus ? (
    <>
      <EnrollmentStatusWarning {...alertProps} />
      <EnrollmentStatusFAQ {...faqProps} />
    </>
  ) : null;
};

EnrollmentStatus.propTypes = {
  getEnrollmentStatus: PropTypes.func,
  route: PropTypes.object,
};

const mapDispatchToProps = {
  getEnrollmentStatus: getEnrollmentStatusAction,
};

export default connect(
  null,
  mapDispatchToProps,
)(EnrollmentStatus);
