import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import { isLoggedIn, selectProfile } from '../../../platform/user/selectors';

class Main extends React.Component {
  componentDidUpdate(prevProps) {
    const { loadingProfile, loggedIn, mhvAccount, router } = this.props;
    const prevMhvAccount = prevProps.mhvAccount;

    if (prevProps.loadingProfile && !loadingProfile && !loggedIn) {
      window.location = '/';
    }

    // If accountState or accountLevel has changed, excluding initial
    // fetchMHVAccount(), return to index route to refresh mhvAccount
    if (loggedIn && this.loadedMhvAccount) {
      const prevAccountLevel = prevMhvAccount.accountLevel;
      const prevAccountState = prevMhvAccount.accountState;
      const { accountLevel, accountState } = mhvAccount;

      if (
        prevAccountLevel !== accountLevel ||
        prevAccountState !== accountState
      ) {
        router.replace('/');
      }
    }

    if (prevMhvAccount.loading && !mhvAccount.loading) {
      this.loadedMhvAccount = true;
    }
  }

  render() {
    const { loadingProfile, children, loggedIn } = this.props;
    return (
      <div className="row">
        <div className="vads-u-padding-bottom--5">
          {loadingProfile && (
            <LoadingIndicator
              setFocus
              messsage="Loading your health account information..."
            />
          )}
          {!loadingProfile && loggedIn && children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const profile = selectProfile(state);
  const { loading, mhvAccount } = profile;
  return {
    loggedIn: isLoggedIn(state),
    loadingProfile: loading,
    mhvAccount,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    null,
  )(Main),
);
