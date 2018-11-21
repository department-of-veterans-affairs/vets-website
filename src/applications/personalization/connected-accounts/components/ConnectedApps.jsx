import React from 'react';

import { ConnectedApp } from './ConnectedApp';
import recordEvent from '../../../../platform/monitoring/record-event';

export function ConnectedApps({ confirmDelete, propertyName, accounts }) {
  return (
    <div className="row va-connected-acct">
      <div className="usa-width-two-thirds medium-8 small-12 columns">
        <h1>Your Connected Accounts</h1>
        <p className="va-introtext">
          {/* eslint-disable prettier/prettier */}
          You gave these sites and applications read only access to some of
          your {propertyName} account data.
          {/* eslint-enable prettier/prettier */}
        </p>

        <table className="va-table-connected-acct usa-table-borderless">
          <tbody>
            {accounts.map((a, idx) => (
              <ConnectedApp
                key={idx}
                confirmDelete={confirmDelete}
                propertyName={propertyName}
                isLast={idx + 1 === accounts.length}
                {...a}
              />
            ))}
          </tbody>
        </table>

        <div className="feature">
          <h3>Have questions about signing in to {propertyName}?</h3>
          <p>
            Get answers to frequently asked questions about how to sign in,
            common issues with verifying your identity, and your privacy and
            security on {propertyName}.
          </p>

          <a
            href="/faq"
            onClick={() =>
              recordEvent({
                event: 'account-navigation',
                'account-action': 'view-link',
                'account-section': 'vets-faqs',
              })
            }
          >
            Go to {propertyName} FAQs
          </a>
        </div>
      </div>
    </div>
  );
}
