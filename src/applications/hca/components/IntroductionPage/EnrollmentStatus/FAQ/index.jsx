import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { showReapplyContent as showReapplyContentAction } from '../../../../utils/actions/enrollment-status';
import { shouldShowReapplyContent } from '../../../../utils/selectors';
import { HCA_ENROLLMENT_STATUSES } from '../../../../utils/constants';

import ProcessTimeline from '../../GetStarted/ProcessTimeline';
import OMBInfo from '../../GetStarted/OMBInfo';
import FAQContent from './FAQContent';
import ApplyButton from './ApplyButton';

const EnrollmentStatusFAQ = props => {
  const showReapplyContent = useSelector(shouldShowReapplyContent);
  const { enrollmentStatus, route, renderReapplyContent } = props;
  const { formConfig, pageList } = route;

  // Declare the enrollment statuses that are considered for apply/reapply opportunities
  const statusMap = {
    apply: new Set([
      HCA_ENROLLMENT_STATUSES.activeDuty,
      HCA_ENROLLMENT_STATUSES.nonMilitary,
    ]),
    reapply: new Set([
      HCA_ENROLLMENT_STATUSES.deceased,
      HCA_ENROLLMENT_STATUSES.enrolled,
    ]),
  };

  // Determine if user can apply/reapply based on enrollment status
  const applyAllowed = statusMap.apply.has(enrollmentStatus);
  const reapplyAllowed =
    !applyAllowed && statusMap.reapply.has(enrollmentStatus) === false;

  // Render FAQ / Reapply content
  return (
    <>
      <FAQContent enrollmentStatus={enrollmentStatus} />

      {reapplyAllowed &&
        !showReapplyContent && (
          <ApplyButton
            event="hca-form-reapply"
            label="Reapply for VA health care"
            clickEvent={renderReapplyContent}
          />
        )}

      {applyAllowed &&
        !showReapplyContent && (
          <ApplyButton
            event="hca-form-apply"
            label="Apply for VA health care"
            clickEvent={renderReapplyContent}
          />
        )}

      {(reapplyAllowed || applyAllowed) && showReapplyContent ? (
        <>
          <ProcessTimeline />

          <div className="hca-sip-intro vads-u-margin-y--3">
            <SaveInProgressIntro
              messages={formConfig.savedFormMessages}
              downtime={formConfig.downtime}
              pageList={pageList}
              startText="Start the health care application"
              buttonOnly
            />
          </div>

          <OMBInfo />
        </>
      ) : null}
    </>
  );
};

EnrollmentStatusFAQ.propTypes = {
  enrollmentStatus: PropTypes.string,
  renderReapplyContent: PropTypes.func,
  route: PropTypes.object,
};

const mapDispatchToProps = {
  renderReapplyContent: showReapplyContentAction,
};

export default connect(
  null,
  mapDispatchToProps,
)(EnrollmentStatusFAQ);
