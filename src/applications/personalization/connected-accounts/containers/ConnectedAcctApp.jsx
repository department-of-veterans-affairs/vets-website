import React from 'react';
import { connect } from 'react-redux';
import backendServices from '../../../../platform/user/profile/constants/backendServices';
import { selectUser } from '../../../../platform/user/selectors';

import RequiredLoginView from '../../../../platform/user/authorization/components/RequiredLoginView';
import isBrandConsolidationEnabled from '../../../../platform/brand-consolidation/feature-flag';

import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';

import { loadConnectedAccounts, deleteConnectedAccount } from '../actions';
import { NoConnectedApps, ConnectedApps } from '../components';

import '../sass/connected-acct.scss';

const propertyName = isBrandConsolidationEnabled() ? 'VA.gov' : 'Vets.gov';

class ConnectedAcctApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  componentDidMount = () => {
    this.props.loadConnectedAccounts();
  };

  confirmDelete = accountId => {
    this.props.deleteConnectedAccount(accountId);
  };

  render() {
    let connectedAccountsView;
    if (this.props.accounts.length > 0) {
      connectedAccountsView = (
        <ConnectedApps
          confirmDelete={this.confirmDelete}
          accounts={this.props.accounts}
          propertyName={propertyName}
        />
      );
    } else if (this.props.loading) {
      connectedAccountsView = (
        <LoadingIndicator message="Loading your account information..." />
      );
    } else {
      connectedAccountsView = (
        <NoConnectedApps
          propertyName={propertyName}
          errors={this.props.errors}
        />
      );
    }

    return (
      <div>
        <RequiredLoginView
          authRequired={1}
          serviceRequired={backendServices.USER_PROFILE}
          user={this.props.user}
        >
          {connectedAccountsView}
        </RequiredLoginView>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const user = selectUser(state);
  return {
    ...state.connectedAccounts,
    user,
  };
};

const mapDispatchToProps = {
  loadConnectedAccounts,
  deleteConnectedAccount,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectedAcctApp);
export { ConnectedAcctApp };
