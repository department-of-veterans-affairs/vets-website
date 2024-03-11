import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';

import WarningHeadline from './WarningHeadline';
import WarningStatus from './WarningStatus';
import WarningExplanation from './WarningExplanation';
import { HCA_ENROLLMENT_STATUSES } from '../../../../utils/constants';
import { shouldShowReapplyContent } from '../../../../utils/selectors';
import { showReapplyContent as showReapplyContentAction } from '../../../../utils/actions';

const EnrollmentStatusWarning = props => {
  const {
    applicationDate,
    enrollmentDate,
    enrollmentStatus,
    preferredFacility,
    renderReapplyContent,
  } = props;
  const showReapplyContent = useSelector(shouldShowReapplyContent);

  // determine if we show the apply/reapply button based on enrollment status
  const applyAllowList = new Set([
    HCA_ENROLLMENT_STATUSES.activeDuty,
    HCA_ENROLLMENT_STATUSES.nonMilitary,
  ]);
  const reapplyAllowList = new Set([
    HCA_ENROLLMENT_STATUSES.rejectedIncWrongEntry,
    HCA_ENROLLMENT_STATUSES.rejectedRightEntry,
    HCA_ENROLLMENT_STATUSES.rejectedScWrongEntry,
    HCA_ENROLLMENT_STATUSES.canceledDeclined,
    HCA_ENROLLMENT_STATUSES.closed,
  ]);
  const hasApplyStatus = applyAllowList.has(enrollmentStatus);
  const hasReapplyStatus = reapplyAllowList.has(enrollmentStatus);
  const showButton =
    !showReapplyContent && (hasApplyStatus || hasReapplyStatus);

  // set reapply button attributes based on enrollment status
  const eventToRecord = hasApplyStatus ? 'hca-form-apply' : 'hca-form-reapply';
  const buttonLabel = hasApplyStatus
    ? 'Apply for VA health care'
    : 'Reapply for VA health care';
  const onButtonClick = () => {
    recordEvent({ event: eventToRecord });
    renderReapplyContent();
    focusElement('[data-testid="hca-timeline-heading"]');
  };

  return (
    <va-alert status="warning" uswds>
      <WarningHeadline enrollmentStatus={enrollmentStatus} />
      <WarningStatus
        enrollmentStatus={enrollmentStatus}
        applicationDate={applicationDate}
        enrollmentDate={enrollmentDate}
        preferredFacility={preferredFacility}
      />
      <WarningExplanation enrollmentStatus={enrollmentStatus} />
      {showButton ? (
        <va-button
          text={buttonLabel}
          onClick={onButtonClick}
          data-testid="hca-reapply-button"
          uswds
        />
      ) : null}
    </va-alert>
  );
};

EnrollmentStatusWarning.propTypes = {
  applicationDate: PropTypes.string,
  enrollmentDate: PropTypes.string,
  enrollmentStatus: PropTypes.string,
  preferredFacility: PropTypes.string,
  renderReapplyContent: PropTypes.func,
};

const mapDispatchToProps = {
  renderReapplyContent: showReapplyContentAction,
};

export default connect(
  null,
  mapDispatchToProps,
)(EnrollmentStatusWarning);
