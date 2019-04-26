import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import {
  createAndUpgradeMHVAccount,
  fetchMHVAccount,
} from '../../../platform/user/profile/actions';

import { isLoggedIn, selectProfile } from '../../../platform/user/selectors';
import environment from '../../../platform/utilities/environment/index';
import { replaceWithStagingDomain } from '../../../platform/utilities/environment/stagingDomains';
import { ACCOUNT_STATES, MHV_ACCOUNT_LEVELS } from './../constants';

class ValidateMHVAccount extends React.Component {
  componentDidUpdate(prevProps) {
    const { profile, mhvAccount } = this.props;
    if (prevProps.profile.loading && !profile.loading) {
      if (this.props.isLoggedIn) {
        this.props.fetchMHVAccount();
      } else {
        window.location = '/';
      }
    }

    if (prevProps.mhvAccount.loading && !mhvAccount.loading) {
      this.redirect();
    }
  }

  redirect = () => {
    const { profile, mhvAccount, accountState, router } = this.props;

    // LOA Checks
    if (!profile.verified) {
      router.replace('verify');
    }

    // MVI/MHV Checks
    if (this.props.mviDown) {
      router.replace('error/mvi-down');
    } else if (mhvAccount.errors) {
      router.replace('error/mhv-error');
    }

    switch (accountState) {
      case ACCOUNT_STATES.NEEDS_VERIFICATION:
        router.replace('verify');
        return;
      case ACCOUNT_STATES.DEACTIVATED_MHV_IDS:
      case ACCOUNT_STATES.MULTIPLE_IDS:
      case ACCOUNT_STATES.NEEDS_SSN_RESOLUTION:
      case ACCOUNT_STATES.REGISTER_FAILED:
      case ACCOUNT_STATES.UPGRADE_FAILED:
      case ACCOUNT_STATES.NEEDS_VA_PATIENT:
        router.replace(`error/${accountState.replace(/_/g, '-')}`);
        return;
      default:
        break;
    }

    const { accountLevel } = this.props.mhvAccount;

    if (!accountLevel) {
      router.replace('create-account');
    } else if (
      accountLevel === MHV_ACCOUNT_LEVELS.PREMIUM ||
      accountLevel === MHV_ACCOUNT_LEVELS.ADVANCED
    ) {
      const mhvUrl = 'https://www.myhealth.va.gov/mhv-portal-web/home';
      router.replace(
        environment.isProduction() ? mhvUrl : replaceWithStagingDomain(mhvUrl),
      );
    } else if (accountLevel === MHV_ACCOUNT_LEVELS.BASIC) {
      router.replace('upgrade-account');
    } else {
      router.replace('error');
    }
  };

  render() {
    return (
      <div className="row">
        <div className="vads-u-padding-bottom--5">
          <LoadingIndicator
            setFocus
            messsage="Loading your health account information..."
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const profile = selectProfile(state);
  const { loading, mhvAccount, status, verified } = profile;
  return {
    isLoggedIn: isLoggedIn(state),
    profile: { loading, verified },
    mhvAccount,
    mviDown: status === 'SERVER_ERROR',
  };
};
const mapDispatchToProps = {
  createAndUpgradeMHVAccount,
  fetchMHVAccount,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ValidateMHVAccount),
);
