import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { loadConnectedAccounts as loadConnectedAccountsAction } from 'applications/personalization/connected-accounts/actions';

import recordEvent from 'platform/monitoring/record-event';

function recordAnalyticEvent() {
  recordEvent({
    event: 'account-navigation',
    'account-action': 'view-link',
    'account-section': 'connected-accounts',
  });
}

function ConnectedAccountsSection({
  accounts,
  loadConnectedAccounts,
  loading,
}) {
  // TODO: for some reason this hook is called twice on load. maybe
  // AccountMain's render is to blame because it renders an instance of this
  // component and then re-renders, replacing it?
  useEffect(
    () => {
      loadConnectedAccounts();
    },
    [loadConnectedAccounts],
  );

  const hasConnectedAccounts = () =>
    accounts && accounts.filter(account => !account.deleted).length;

  if (!loading && hasConnectedAccounts()) {
    return (
      <div>
        <h3>Connected accounts</h3>
        <div>
          <p>
            Manage the settings for the sites and applications you’ve given
            permission to access your VA.gov profile data.
          </p>
          <p>
            <a
              href="/account/connected-accounts"
              rel="noopener noreferrer"
              onClick={recordAnalyticEvent}
            >
              Manage your connected accounts
            </a>
          </p>
        </div>
      </div>
    );
  }
  return null;
}

const mapStateToProps = state => ({
  ...state.connectedAccounts,
});

const mapDispatchToProps = {
  loadConnectedAccounts: loadConnectedAccountsAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectedAccountsSection);

export { ConnectedAccountsSection };
