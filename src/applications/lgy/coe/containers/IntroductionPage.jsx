import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import { isLoggedIn } from 'platform/user/selectors';
import { notLoggedInContent } from './introductionContent/notLoggedInContent.jsx';
import { loggedInContent } from './introductionContent/loggedInContent.jsx';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

function IntroductionPage(props) {
  let content;

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  });

  if (props.status === 'idle') {
    content = <LoadingIndicator message="Loading your application..." />;
  } else if (
    props.status === 'success' ||
    props.status === 'failed' ||
    props.status === 'skip'
  ) {
    if (props.loggedIn === false) {
      content = notLoggedInContent(props);
    } else {
      content = loggedInContent();
    }
  }

  return <div>{content}</div>;
}

const mapStateToProps = state => ({
  status: state.certificateOfEligibility.generateAutoCoeStatus,
  loggedIn: isLoggedIn(state),
});

export default connect(
  mapStateToProps,
  {},
)(IntroductionPage);
