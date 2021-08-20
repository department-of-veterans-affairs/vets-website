import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import { isLoggedIn } from 'platform/user/selectors';
import { notLoggedInContent } from './introductionContent/notLoggedInContent.jsx';

function IntroductionPage(props) {
  let content;
  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  });

  if (!props.loggedIn) {
    content = notLoggedInContent(props);
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
