import React from 'react';
import { connect } from 'react-redux';

import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import HCASubwayMap from '../components/HCASubwayMap';
import recordEvent from 'platform/monitoring/record-event';

import { getFAQContent } from '../enrollment-status-helpers';
import { HCA_ENROLLMENT_STATUSES } from '../constants';
import { showReapplyContent as showReapplyContentAction } from '../actions';
import { isShowingHCAReapplyContent } from '../selectors';

const ReapplyContent = ({ route }) => (
  <>
    <HCASubwayMap />
    <SaveInProgressIntro
      buttonOnly
      messages={route.formConfig.savedFormMessages}
      pageList={route.pageList}
      startText="Start the Health Care Application"
      downtime={route.formConfig.downtime}
    />
    <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
      <OMBInfo resBurden={30} ombNumber="2900-0091" expDate="12/31/2020" />
    </div>
  </>
);

const ReapplyTextLink = ({
  onClick,
  linkLabel = 'Reapply for VA health care',
}) => (
  <button className="va-button-link schemaform-start-button" onClick={onClick}>
    {linkLabel}
  </button>
);

const HCAEnrollmentStatusFAQ = ({
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

const mapStateToProps = state => ({
  showingReapplyForHealthCareContent: isShowingHCAReapplyContent(state),
});

const mapDispatchToProps = {
  showReapplyContent: showReapplyContentAction,
};

export { HCAEnrollmentStatusFAQ };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HCAEnrollmentStatusFAQ);
