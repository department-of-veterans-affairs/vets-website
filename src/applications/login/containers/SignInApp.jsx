import React from 'react';
import { connect } from 'react-redux';
import appendQuery from 'append-query';
import 'url-search-params-polyfill';

import AutoSSO from 'platform/site-wide/user-nav/containers/AutoSSO';
import LoginContainer from 'platform/user/authentication/components/LoginContainer';

import { isAuthenticatedWithSSOe } from 'platform/user/authentication/selectors';
import { selectProfile } from 'platform/user/selectors';
import { EXTERNAL_APPS } from 'platform/user/authentication/constants';

export class SignInPage extends React.Component {
  componentDidUpdate() {
    const { router, location, authenticatedWithSSOe, profile } = this.props;
    const { query } = location;
    const { application } = query;
    if (
      authenticatedWithSSOe &&
      !profile.verified &&
      application === EXTERNAL_APPS.MY_VA_HEALTH
    ) {
      router.push(appendQuery('/verify', window.location.search.slice(1)));
    }
  }

  render() {
    const { location } = this.props;
    const { query } = location;
    const externalApplication = query.application;
    const loggedOut = query.auth === 'logged_out';

    return (
      <>
        <AutoSSO />
        <LoginContainer
          isUnifiedSignIn
          externalApplication={externalApplication}
          loggedOut={loggedOut}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  profile: selectProfile(state),
  authenticatedWithSSOe: isAuthenticatedWithSSOe(state),
});

export default connect(mapStateToProps)(SignInPage);
