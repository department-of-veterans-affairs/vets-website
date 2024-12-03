import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectEnrollmentStatus } from '../../../utils/selectors';
import ServerErrorAlert from '../../FormAlerts/ServerErrorAlert';
import WarningHeadline from './Warning/WarningHeadline';
import WarningStatus from './Warning/WarningStatus';
import WarningExplanation from './Warning/WarningExplanation';
import ReapplyButton from './Warning/ReapplyButton';
import EnrollmentStatusFAQ from './FAQ';

const EnrollmentStatus = ({ route }) => {
  const { isEnrolledInESR, hasServerError } = useSelector(
    selectEnrollmentStatus,
  );
  const alertStatus = isEnrolledInESR ? 'continue' : 'warning';

  return !hasServerError ? (
    <>
      <va-alert status={alertStatus} data-testid="hca-enrollment-alert" uswds>
        <WarningHeadline />
        <WarningStatus />
        <WarningExplanation />
        <ReapplyButton route={route} />
      </va-alert>

      <EnrollmentStatusFAQ />
    </>
  ) : (
    <ServerErrorAlert />
  );
};

EnrollmentStatus.propTypes = {
  route: PropTypes.object,
};

export default EnrollmentStatus;
