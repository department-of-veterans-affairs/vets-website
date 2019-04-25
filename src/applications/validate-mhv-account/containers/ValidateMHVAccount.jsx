import React from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import {
  createAndUpgradeMHVAccount,
  fetchMHVAccount,
} from '../../../platform/user/profile/actions';

import { isLoggedIn, selectProfile } from '../../../platform/user/selectors';

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
    const { profile, mhvAccount, accountState } = this.props;

    // LOA Checks
    if (!profile.verified) {
      window.location = 'verify';
    }

    // MVI/MHV Checks
    if (this.props.mviDown) {
      window.location = 'error/mvi-down';
    } else if (mhvAccount.errors) {
      window.location = 'error/mhv-error';
    }

    // const accountState = 'needs_va_patient';

    switch (accountState) {
      case 'needs_identity_verification':
        window.location = 'verify';
        break;
      case 'has_deactivated_mhv_ids':
      case 'has_multiple_active_mhv_ids':
      case 'needs_ssn_resolution':
      case 'register_failed':
      case 'upgrade_failed':
      case 'needs_va_patient':
        window.location = `error/${accountState.replace(/_/g, '-')}`;
        break;
      default:
        break;
    }

    const { accountLevel } = this.props.mhvAccount;

    if (!accountLevel) {
      window.location = 'create-account';
    }

    window.location = 'upgrade-account';
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ValidateMHVAccount);
