import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import recordEvent from 'platform/monitoring/record-event';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { showReapplyContent as showReapplyContentAction } from '../../../../utils/actions';
import { shouldShowReapplyContent } from '../../../../utils/selectors';
import { HCA_ENROLLMENT_STATUSES } from '../../../../utils/constants';

import ProcessTimeline from '../../GetStarted/ProcessTimeline';
import OMBInfo from '../../GetStarted/OMBInfo';
import FAQContent from './FAQContent';

const EnrollmentStatusFAQ = props => {
  const {
    enrollmentStatus,
    route,
    showReapplyContent,
    renderReapplyContent,
  } = props;
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
          <button
            type="button"
            className="va-button-link schemaform-start-button"
            onClick={() => {
              recordEvent({ event: 'hca-form-reapply' });
              renderReapplyContent();
            }}
          >
            Reapply for VA health care
          </button>
        )}

      {applyAllowed &&
        !showReapplyContent && (
          <button
            type="button"
            className="va-button-link schemaform-start-button"
            onClick={() => {
              recordEvent({ event: 'hca-form-apply' });
              renderReapplyContent();
            }}
          >
            Apply for VA health care
          </button>
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
  showReapplyContent: PropTypes.bool,
};

const mapStateToProps = state => ({
  showReapplyContent: shouldShowReapplyContent(state),
});

const mapDispatchToProps = {
  renderReapplyContent: showReapplyContentAction,
};

export { EnrollmentStatusFAQ };
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EnrollmentStatusFAQ);
