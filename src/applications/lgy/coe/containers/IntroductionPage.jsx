import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import { isLoggedIn } from 'platform/user/selectors';
import { notLoggedInContent } from './introductionContent/notLoggedInContent.jsx';
import { loggedInContent } from './introductionContent/loggedInContent.jsx';

function IntroductionPage(props) {
  let content;

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  });

  if (props.loggedIn === undefined) {
    content = <p>loading...</p>;
  } else if (props.loggedIn === false) {
    content = notLoggedInContent(props);
  } else {
    content = loggedInContent();
  }

  return <div>{content}</div>;
}

const mapStateToProps = state => ({
  loggedIn: isLoggedIn(state),
});

export default connect(
  mapStateToProps,
  {},
)(IntroductionPage);
