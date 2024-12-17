import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { HCA_ENROLLMENT_STATUSES } from '../../../../utils/constants';
import { selectEnrollmentStatus } from '../../../../utils/selectors';
import content from '../../../../locales/en/content.json';

const ReapplyButton = ({ route }) => {
  const { statusCode } = useSelector(selectEnrollmentStatus);
  const {
    formConfig: { savedFormMessages, downtime },
    pageList,
  } = route;

  // determine if we show the apply/reapply button based on enrollment status
  const hasApplyStatus = new Set([
    HCA_ENROLLMENT_STATUSES.activeDuty,
    HCA_ENROLLMENT_STATUSES.canceledDeclined,
    HCA_ENROLLMENT_STATUSES.closed,
    HCA_ENROLLMENT_STATUSES.nonMilitary,
    HCA_ENROLLMENT_STATUSES.rejectedIncWrongEntry,
    HCA_ENROLLMENT_STATUSES.rejectedRightEntry,
    HCA_ENROLLMENT_STATUSES.rejectedScWrongEntry,
  ]).has(statusCode);

  // set props for the Save In Progress button
  const sipProps = {
    startText: content['sip-start-form-text'],
    messages: savedFormMessages,
    buttonOnly: true,
    downtime,
    pageList,
  };

  // Render based on enrollment status
  return hasApplyStatus ? (
    <div className="vads-u-margin-top--3">
      <SaveInProgressIntro {...sipProps} />
    </div>
  ) : null;
};

ReapplyButton.propTypes = {
  route: PropTypes.object,
};

export default ReapplyButton;
