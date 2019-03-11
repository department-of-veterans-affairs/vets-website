import React from 'react';

import environment from '../../../../platform/utilities/environment';
import recordEvent from '../../../../platform/monitoring/record-event';

function recordAnalyticEvent() {
  recordEvent({
    event: 'account-navigation',
    'account-action': 'view-link',
    'account-section': 'connected-accounts',
  });
}

export default function ConnectedAccountsSection() {
  if (environment.isProduction()) {
    return null;
  }

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
          .
        </p>
      </div>
    </div>
  );
}
