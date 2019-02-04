import React from 'react';
import isBrandConsolidationEnabled from '../../../../platform/brand-consolidation/feature-flag';

const propertyName = isBrandConsolidationEnabled() ? 'VA.gov' : 'Vets.gov';

export default function ConnectedAccountsSection() {
  return (
    <div>
      <h3>Connected accounts</h3>
      <div>
        <p>
          Manage the settings for the sites and applications you've given
          permission to access your {propertyName} profile data.
        </p>
        <p>
          <a
            href="/account/connected-accounts"
            target="_blank"
            rel="noopener noreferrer"
          >
            Manage your connected accounts
          </a>
          .
        </p>
      </div>
    </div>
  );
}
