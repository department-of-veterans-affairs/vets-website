import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import { isLoggedIn } from 'platform/user/selectors';
import { notLoggedInContent } from './introduction-content/notLoggedInContent.jsx';
import COEIntroPageBox from './introduction-content/COEIntroPageBox';
import LoggedInContent from './introduction-content/loggedInContent.jsx';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { CALLSTATUS, COE_ELIGIBILITY_STATUS } from '../constants';

const IntroductionPage = props => {
  let content;

  const [showSteps, setShowSteps] = useState(false);

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  });
  // Set the content to be the loading indicator
  content = <LoadingIndicator message="Loading your application..." />;

  const onContentClick = () => {
    setShowSteps(true);
  };

  // Once the coe call is done, render the rest of the content
  const coeCallEnded = [CALLSTATUS.failed, CALLSTATUS.success, CALLSTATUS.skip];

  // We don't want to show logged in content for these statuses
  const pendingStatuses = [
    COE_ELIGIBILITY_STATUS.pending,
    COE_ELIGIBILITY_STATUS.pendingUpload,
  ];

  const hideLoggedInStatuses = [
    COE_ELIGIBILITY_STATUS.denied,
    ...pendingStatuses,
  ];

  console.log(showSteps); // eslint-disable-line no-console

  if (!props.loggedIn && coeCallEnded.includes(props.status)) {
    content = notLoggedInContent(props);
  }
  if (props.loggedIn && coeCallEnded.includes(props.status)) {
    content = (
      <div>
        <COEIntroPageBox coe={props.coe} status={props.status} />
        {pendingStatuses.includes(props.coe.status) && (
          <a onClick={onContentClick}>Request a VA home loan COE again</a>
        )}
        {(!hideLoggedInStatuses.includes(props.coe.status) || showSteps) && (
          <LoggedInContent parentProps={props} />
        )}
      </div>
    );
  }

  return <div>{content}</div>;
};

const mapStateToProps = state => ({
  coe: state.certificateOfEligibility.coe,
  loggedIn: isLoggedIn(state),
  status: state.certificateOfEligibility.generateAutoCoeStatus,
});

export default connect(mapStateToProps)(IntroductionPage);
