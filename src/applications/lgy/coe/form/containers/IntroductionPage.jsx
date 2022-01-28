import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { focusElement } from 'platform/utilities/ui';
import { isLoggedIn } from 'platform/user/selectors';

import { CALLSTATUS, COE_ELIGIBILITY_STATUS } from '../../shared/constants';
import AuthenticatedContent from '../components/introduction/AuthenticatedContent';
import UnauthenticatedContent from '../components/introduction/UnauthenticatedContent';
import IntroPageBox from '../components/introduction/IntroPageBox';

const shouldShowSubwayMap = status => {
  const { denied, pending, pendingUpload } = COE_ELIGIBILITY_STATUS;
  const hideSubwayMap = [denied, pending, pendingUpload];

  return !hideSubwayMap.includes(status);
};

const IntroductionPage = props => {
  let content;

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  });
  // Set the content to be the loading indicator
  content = <va-loading-indicator message="Loading your request..." />;

  // Once the coe call is done, render the rest of the content
  const coeCallEnded = [CALLSTATUS.failed, CALLSTATUS.success, CALLSTATUS.skip];

  if (!props.loggedIn && coeCallEnded.includes(props.status)) {
    content = <UnauthenticatedContent {...props} />;
  }
  if (props.loggedIn && coeCallEnded.includes(props.status)) {
    content = (
      <>
        <IntroPageBox
          coe={props.coe}
          status={props.status}
          downloadUrl={props.downloadUrl}
        />
        {shouldShowSubwayMap(props.coe.status) && (
          <AuthenticatedContent parentProps={props} />
        )}
      </>
    );
  }

  return (
    <div>
      <FormTitle title="Request a VA home loan Certificate of Eligibility (COE)" />
      <p className="vads-u-padding-bottom--3">
        Request for a Certificate of Eligibility (VA Form 26-1880)
      </p>
      {content}
    </div>
  );
};

const mapStateToProps = state => ({
  status: state.certificateOfEligibility.generateAutoCoeStatus,
  coe: state.certificateOfEligibility.coe,
  downloadUrl: state.certificateOfEligibility.downloadUrl,
  loggedIn: isLoggedIn(state),
});

export default connect(mapStateToProps)(IntroductionPage);
