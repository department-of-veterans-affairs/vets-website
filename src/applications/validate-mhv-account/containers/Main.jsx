import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import { isLoggedIn, selectProfile } from '../../../platform/user/selectors';
import get from '../../../platform/utilities/data/get';
import environment from '../../../platform/utilities/environment/index';
import { replaceWithStagingDomain } from '../../../platform/utilities/environment/stagingDomains';
import { ACCOUNT_STATES, MHV_ACCOUNT_LEVELS, MHV_URL } from './../constants';

class Main extends React.Component {
  componentDidUpdate(prevProps) {
    const {
      loadingProfile,
      loggedIn,
      mhvAccount,
      router,
      location,
    } = this.props;
    const prevMhvAccount = prevProps.mhvAccount;

    if (prevProps.loadingProfile && !loadingProfile && !loggedIn) {
      window.location = '/';
    }

    // If accountState or accountLevel has changed, check if the user's
    // state is valid for MHV, otherwise redirect to index route to recheck
    if (
      location.pathname !== '/' &&
      prevMhvAccount.loading &&
      !mhvAccount.loading
    ) {
      const { accountLevel, accountState } = mhvAccount;
      const accountLevelChanged = accountLevel !== prevMhvAccount.accountLevel;
      const accountStateChanged = accountState !== prevMhvAccount.accountState;

      if (accountLevelChanged || accountStateChanged) {
        if (this.hasMHVAccess()) {
          this.redirectToMHV();
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

  redirectToMHV = () => {
    window.location = environment.isProduction()
      ? MHV_URL
      : replaceWithStagingDomain(MHV_URL);
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
      content = <LoadingIndicator setFocus />;
    } else if (!loadingProfile && loggedIn) {
      content = children;
    } else {
      content = null;
    }

    return (
      <div className="row">
        <div className="vads-u-padding-bottom--5">{content}</div>
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
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    null,
  )(Main),
);
