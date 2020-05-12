import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import { isLoggedIn, selectProfile } from 'platform/user/selectors';
import get from 'platform/utilities/data/get';
import { ssoe } from 'platform/user/authentication/selectors';
import { mhvUrl } from 'platform/site-wide/mhv/utilities';
import { ACCOUNT_STATES, MHV_ACCOUNT_LEVELS } from './../constants';

/**
 * This is the parent component for the MyHealtheVet Account validation app.
 * It handles redirects based on detected changes to accountState.  The indexRoute ('/')
 * mounts the ValidateMHVAccount component which handles refetching the MHV account
 * and redirecting in case of errors.
 */
class Main extends React.Component {
  componentDidUpdate(prevProps) {
    const {
      loadingProfile,
      location,
      loggedIn,
      mhvAccount,
      profile,
      router,
      useSSOe,
    } = this.props;

    const pathname = location.pathname;
    const prevMhvAccount = prevProps.mhvAccount;

    if (prevProps.loadingProfile && !loadingProfile) {
      if (!loggedIn) {
        window.location = '/';
      }

      // If a successful verification originated from this flow, the user will
      // be redirected back to '/health-care/my-health-account-validation/verify' after.
      // Instead of showing the verify message, redirect them to '/' to re-check their
      // MHV account status.
      if (pathname === '/verify' && profile.verified) {
        router.replace('/');
      }
    }

    // If accountState or accountLevel has changed, check if the user's
    // state is valid for MHV, otherwise redirect to index route to recheck
    if (pathname !== '/' && prevMhvAccount.loading && !mhvAccount.loading) {
      const { accountLevel, accountState } = mhvAccount;
      const accountLevelChanged = accountLevel !== prevMhvAccount.accountLevel;
      const accountStateChanged = accountState !== prevMhvAccount.accountState;

      if (accountLevelChanged || accountStateChanged) {
        if (this.hasMHVAccess()) {
          this.redirectToMHV(useSSOe);
        } else {
          router.replace('/');
        }
      }
    }
  }

  hasMHVAccess = () => {
    const { profile, mhvAccount } = this.props;
    const { accountLevel, accountState } = mhvAccount;

    return (
      profile.verified &&
      accountState !== ACCOUNT_STATES.NEEDS_TERMS_ACCEPTANCE &&
      (accountLevel === MHV_ACCOUNT_LEVELS.PREMIUM ||
        accountLevel === MHV_ACCOUNT_LEVELS.ADVANCED)
    );
  };

  redirectToMHV = useSSOe => {
    window.location = mhvUrl(useSSOe, 'home');
  };

  render() {
    const {
      children,
      loadingProfile,
      loggedIn,
      mhvAccount,
      location,
    } = this.props;

    const mhvAccountLoading = get('loading', mhvAccount, false);

    let content;

    if (location.pathname !== '/' && mhvAccountLoading) {
      content = <LoadingIndicator message="Loading..." setFocus />;
    } else if (!loadingProfile && loggedIn) {
      content = children;
    } else {
      content = null;
    }

    return (
      <div className="row">
        <div className="vads-u-padding--5">{content}</div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const profile = selectProfile(state);
  const { loading, mhvAccount } = profile;
  return {
    location: ownProps.location,
    loggedIn: isLoggedIn(state),
    loadingProfile: loading,
    mhvAccount,
    profile,
    useSSOe: ssoe(state),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    null,
  )(Main),
);
