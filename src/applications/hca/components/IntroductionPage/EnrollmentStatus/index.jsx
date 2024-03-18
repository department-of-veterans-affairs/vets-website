import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { getEnrollmentStatus as getEnrollmentStatusAction } from '../../../utils/actions';
import { HCA_ENROLLMENT_STATUSES } from '../../../utils/constants';
import { selectEnrollmentStatus } from '../../../utils/selectors';
import WarningHeadline from './Warning/WarningHeadline';
import WarningStatus from './Warning/WarningStatus';
import WarningExplanation from './Warning/WarningExplanation';
import ReapplyButton from './Warning/ReapplyButton';
import EnrollmentStatusFAQ from './FAQ';

const EnrollmentStatus = props => {
  const { enrollmentStatus } = useSelector(selectEnrollmentStatus);
  const { route, fetchEnrollmentStatus } = props;
  const alertStatus =
    enrollmentStatus === HCA_ENROLLMENT_STATUSES.enrolled
      ? 'continue'
      : 'warning';

  useEffect(() => {
    fetchEnrollmentStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return enrollmentStatus ? (
    <>
      <va-alert status={alertStatus} data-testid="hca-enrollment-alert" uswds>
        <WarningHeadline />
        <WarningStatus />
        <WarningExplanation />
        <ReapplyButton route={route} />
      </va-alert>

      <EnrollmentStatusFAQ />
    </>
  ) : null;
};

EnrollmentStatus.propTypes = {
  fetchEnrollmentStatus: PropTypes.func,
  route: PropTypes.object,
};

const mapDispatchToProps = {
  fetchEnrollmentStatus: getEnrollmentStatusAction,
};

export default connect(
  null,
  mapDispatchToProps,
)(EnrollmentStatus);
