import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import { fetchMHVAccount } from 'platform/user/profile/actions';

import recordEvent from 'platform/monitoring/record-event';
import { selectProfile } from 'platform/user/selectors';
import { isAuthenticatedWithSSOe } from 'platform/user/authentication/selectors';
import { mhvUrl } from 'platform/site-wide/mhv/utilities';
import { ACCOUNT_STATES } from './../constants';

import { MVI_ERROR_STATES } from 'platform/monitoring/RequiresMVI/constants';

class ValidateMHVAccount extends React.Component {
  componentDidMount() {
    this.props.fetchMHVAccount();
  }

  componentDidUpdate(prevProps) {
    const { mhvAccount, authenticatedWithSSOe } = this.props;

    if (prevProps.mhvAccount.loading && !mhvAccount.loading) {
      if (authenticatedWithSSOe) {
        this.redirectSSOe();
      } else {
        this.redirect();
      }
    }
  }

  redirectSSOe = () => {
    const { router, mhvAccountIdState, mviStatus } = this.props;
    const gaPrefix = 'register-mhv';

    // MVI Checks
    const mviErrorStatesSet = new Set(Object.values(MVI_ERROR_STATES));

    if (mviStatus && mviErrorStatesSet.has(mviStatus)) {
      const hyphenatedMviStatus = mviStatus.replace(/_/g, '-').toLowerCase();
      recordEvent({
        event: `${gaPrefix}-error-mvi-error-${hyphenatedMviStatus}`,
      });

      router.replace(`error/mvi-error-${hyphenatedMviStatus}`);
      return;
    }

    if (mhvAccountIdState === 'DEACTIVATED') {
      recordEvent({ event: `${gaPrefix}-error-has-deactivated-mhv-ids` });
      router.replace(`error/has-deactivated-mhv-ids`);
      return;
    }
    window.location = mhvUrl(true, 'home');
  };

  redirect = () => {
    const { mhvAccount, router, mviStatus } = this.props;
    const { accountState } = mhvAccount;
    const hyphenatedAccountState = accountState.replace(/_/g, '-');
    const gaPrefix = 'register-mhv';

    // MVI/MHV Checks
    const mviErrorStatesSet = new Set(Object.values(MVI_ERROR_STATES));

    if (mviStatus && mviErrorStatesSet.has(mviStatus)) {
      const hyphenatedMviStatus = mviStatus.replace(/_/g, '-').toLowerCase();
      recordEvent({
        event: `${gaPrefix}-error-mvi-error-${hyphenatedMviStatus}`,
      });

      router.replace(`error/mvi-error-${hyphenatedMviStatus}`);
      return;
    } else if (mhvAccount.errors) {
      recordEvent({ event: `${gaPrefix}-error-mhv-down` });
      router.replace('error/mhv-error');
      return;
    }

    switch (accountState) {
      case ACCOUNT_STATES.DEACTIVATED_MHV_IDS:
      case ACCOUNT_STATES.MULTIPLE_IDS:
      case ACCOUNT_STATES.NEEDS_SSN_RESOLUTION:
      case ACCOUNT_STATES.REGISTER_FAILED:
      case ACCOUNT_STATES.UPGRADE_FAILED:
        router.replace(`error/${hyphenatedAccountState}`);
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <div className="row">
        <div className="vads-u-padding-bottom--5">
          <LoadingIndicator
            message="Loading your health information"
            setFocus
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const profile = selectProfile(state);
  const { mhvAccount, status, mhvAccountState } = profile;
  return {
    mhvAccount,
    mviStatus: status,
    profile,
    mhvAccountIdState: mhvAccountState,
    authenticatedWithSSOe: isAuthenticatedWithSSOe(state),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    { fetchMHVAccount },
  )(ValidateMHVAccount),
);
