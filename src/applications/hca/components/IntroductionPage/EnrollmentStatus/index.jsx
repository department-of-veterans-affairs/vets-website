import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { HCA_ENROLLMENT_STATUSES } from '../../../utils/constants';
import { selectEnrollmentStatus } from '../../../utils/selectors';
import ServerErrorAlert from '../../FormAlerts/ServerErrorAlert';
import EnrollmentStatusFAQ from './FAQ';
import ReapplyButton from './Warning/ReapplyButton';
import WarningExplanation from './Warning/WarningExplanation';
import WarningHeadline from './Warning/WarningHeadline';
import WarningStatus from './Warning/WarningStatus';

const INFO_ALERT_STATUS_CODES = new Set([
  HCA_ENROLLMENT_STATUSES.pendingOther,
  HCA_ENROLLMENT_STATUSES.pendingUnverified,
]);

export const getEnrollmentAlertStatus = statusCode => {
  if (statusCode === HCA_ENROLLMENT_STATUSES.enrolled) return 'continue';
  if (INFO_ALERT_STATUS_CODES.has(statusCode)) return 'info';
  return 'warning';
};

const EnrollmentStatus = ({ route }) => {
  const { statusCode, hasServerError } = useSelector(selectEnrollmentStatus);
  const alertStatus = getEnrollmentAlertStatus(statusCode);

  if (hasServerError) return <ServerErrorAlert />;

  return (
    <>
      <va-alert status={alertStatus} data-testid="hca-enrollment-alert">
        <WarningHeadline />
        <WarningStatus />
        <WarningExplanation />
        <ReapplyButton route={route} />
      </va-alert>

      <EnrollmentStatusFAQ />
    </>
  );
};

EnrollmentStatus.propTypes = {
  route: PropTypes.object,
};

export default EnrollmentStatus;
