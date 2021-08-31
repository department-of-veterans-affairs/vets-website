import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import { isLoggedIn } from 'platform/user/selectors';
import { notLoggedInContent } from './introductionContent/notLoggedInContent.jsx';
import { loggedInContent } from './introductionContent/loggedInContent.jsx';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { CALLSTATUS } from '../constants';

function IntroductionPage(props) {
  let content;

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  });
  // Set the content to be the loading indicator
  content = <LoadingIndicator message="Loading your application..." />;

  // Once the coe call is done, render the rest of the content
  const coeCallEnded = [CALLSTATUS.failed, CALLSTATUS.success, CALLSTATUS.skip];

  if (!props.loggedIn && coeCallEnded.includes(props.status)) {
    content = notLoggedInContent(props);
  }
  if (props.loggedIn && coeCallEnded.includes(props.status)) {
    content = loggedInContent();
  }

  return <div>{content}</div>;
}

const mapStateToProps = state => ({
  status: state.certificateOfEligibility.generateAutoCoeStatus,
  loggedIn: isLoggedIn(state),
});

export default connect(mapStateToProps, {})(IntroductionPage);
