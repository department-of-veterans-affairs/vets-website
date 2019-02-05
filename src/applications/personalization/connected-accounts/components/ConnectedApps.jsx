import React from 'react';

import { ConnectedApp } from './ConnectedApp';
import recordEvent from '../../../../platform/monitoring/record-event';

export function ConnectedApps({ confirmDelete, propertyName, accounts }) {
  return (
    <div className="row va-connected-acct">
      <div className="usa-width-two-thirds medium-8 small-12 columns">
        <h1>Connected Accounts</h1>
        <p className="va-introtext">
          {/* eslint-disable prettier/prettier */}
          You gave the sites and applications listed below permissions to
          access some of your {propertyName} profile data. These sites and
          applications can only view your information. They can't change
          anything.
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
          <h3>Have questions about connected accounts?</h3>
          <p>
            Get answers to frequently asked questions about connected accounts
            and how they work with your {propertyName} account.
          </p>
          <a
            href="/sign-in-faq/"
            onClick={() =>
              recordEvent({
                event: 'account-navigation',
                'account-action': 'view-link',
                'account-section': 'vets-faqs',
              })
            }
          >
            Go to connected account FAQs
          </a>
          .
        </div>
      </div>
    </div>
  );
}
