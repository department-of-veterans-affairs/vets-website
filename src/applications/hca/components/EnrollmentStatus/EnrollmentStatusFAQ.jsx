import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import recordEvent from 'platform/monitoring/record-event';
import { showReapplyContent as showReapplyContentAction } from '../../actions';
import { isShowingHCAReapplyContent } from '../../selectors';
import { HCA_ENROLLMENT_STATUSES } from '../../constants';
import { getFAQContent } from '../../enrollment-status-helpers';

import ReapplyContent from './ReapplyContent';
import ReapplyTextLink from './ReapplyTextLink';

const EnrollmentStatusFAQ = ({
  enrollmentStatus,
  route,
  showingReapplyForHealthCareContent,
  showReapplyContent,
}) => {
  const applyAllowed = new Set([
    HCA_ENROLLMENT_STATUSES.activeDuty,
    HCA_ENROLLMENT_STATUSES.nonMilitary,
  ]).has(enrollmentStatus);
  const reapplyAllowed =
    !applyAllowed &&
    new Set([
      HCA_ENROLLMENT_STATUSES.deceased,
      HCA_ENROLLMENT_STATUSES.enrolled,
    ]).has(enrollmentStatus) === false;

  return (
    <>
      {getFAQContent(enrollmentStatus)}
      {(reapplyAllowed || applyAllowed) &&
        showingReapplyForHealthCareContent && <ReapplyContent route={route} />}
      {reapplyAllowed &&
        !showingReapplyForHealthCareContent && (
          <ReapplyTextLink
            onClick={() => {
              recordEvent({ event: 'hca-form-reapply' });
              showReapplyContent();
            }}
          />
        )}
      {applyAllowed &&
        !showingReapplyForHealthCareContent && (
          <ReapplyTextLink
            linkLabel="Apply for VA health care"
            onClick={() => {
              recordEvent({ event: 'hca-form-apply' });
              showReapplyContent();
            }}
          />
        )}
    </>
  );
};

EnrollmentStatusFAQ.propTypes = {
  enrollmentStatus: PropTypes.string,
  route: PropTypes.object,
  showReapplyContent: PropTypes.func,
  showingReapplyForHealthCareContent: PropTypes.bool,
};

const mapStateToProps = state => ({
  showingReapplyForHealthCareContent: isShowingHCAReapplyContent(state),
});

const mapDispatchToProps = {
  showReapplyContent: showReapplyContentAction,
};

export { EnrollmentStatusFAQ };
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EnrollmentStatusFAQ);
