import React from 'react';
import { connect } from 'react-redux';

import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import HCASubwayMap from '../components/HCASubwayMap';
import recordEvent from 'platform/monitoring/record-event';

import {
  getFAQBlock1,
  getFAQBlock2,
  getFAQBlock3,
  getFAQBlock4,
} from '../enrollment-status-helpers';
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
      <OMBInfo resBurden={30} ombNumber="2900-0091" expDate="05/31/2018" />
    </div>
  </>
);

const ReapplyTextLink = ({ onClick }) => (
  <button className="va-button-link schemaform-start-button" onClick={onClick}>
    Reapply for VA health care
  </button>
);

const HCAEnrollmentStatusFAQ = ({
  enrollmentStatus,
  route,
  showingReapplyForHealthCareContent,
  showReapplyContent,
}) => {
  const reapplyAllowed =
    new Set([
      HCA_ENROLLMENT_STATUSES.deceased,
      HCA_ENROLLMENT_STATUSES.enrolled,
    ]).has(enrollmentStatus) === false;
  return (
    <>
      {getFAQBlock1(enrollmentStatus)}
      {getFAQBlock2(enrollmentStatus)}
      {getFAQBlock3(enrollmentStatus)}
      {getFAQBlock4(enrollmentStatus)}
      {reapplyAllowed &&
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
    </>
  );
};

const mapStateToProps = state => ({
  showingReapplyForHealthCareContent: isShowingHCAReapplyContent(state),
});

const mapDispatchToProps = {
  showReapplyContent: showReapplyContentAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HCAEnrollmentStatusFAQ);
