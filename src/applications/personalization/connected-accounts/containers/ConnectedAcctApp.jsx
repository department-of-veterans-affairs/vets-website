import React from 'react';
import { connect } from 'react-redux';
import backendServices from '../../../../platform/user/profile/constants/backendServices';
import { selectUser } from '../../../../platform/user/selectors';
import { focusElement } from '../../../../platform/utilities/ui';

import RequiredLoginView from '../../../../platform/user/authorization/components/RequiredLoginView';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import {
  loadConnectedAccounts,
  deleteConnectedAccount,
  dismissDeletedAccountAlert,
} from '../actions';
import { NoConnectedApps, ConnectedApps } from '../components';

class ConnectedAcctApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  componentDidMount = () => {
    focusElement('.va-nav-breadcrumbs-list');
    this.props.loadConnectedAccounts();
  };

  confirmDelete = accountId => {
    this.props.deleteConnectedAccount(accountId);
  };

  dismissAlert = accountId => {
    this.props.dismissDeletedAccountAlert(accountId);
  };

  numActiveAccounts = () =>
    this.props.accounts.filter(account => !account.deleted).length;

  render() {
    let connectedAccountsView;
    if (this.props.loading) {
      connectedAccountsView = (
        <LoadingIndicator message="Loading your connected accounts..." />
      );
    } else if (this.numActiveAccounts() > 0) {
      connectedAccountsView = (
        <ConnectedApps
          confirmDelete={this.confirmDelete}
          accounts={this.props.accounts}
          dismissAlert={this.dismissAlert}
        />
      );
    } else {
      connectedAccountsView = <NoConnectedApps errors={this.props.errors} />;
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
  dismissDeletedAccountAlert,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectedAcctApp);
export { ConnectedAcctApp };
