import React from 'react';

import { ConnectedApp } from './ConnectedApp';
import recordEvent from 'platform/monitoring/record-event';
import { AppDeletedAlert } from './AppDeletedAlert';

export function ConnectedApps({ confirmDelete, accounts, dismissAlert }) {
  const deletedAccounts = accounts.filter(account => account.deleted);
  const activeAccounts = accounts.filter(account => !account.deleted);
  return (
    <div className="row va-connected-acct">
      <div className="usa-width-two-thirds medium-9 small-12 columns">
        <h1>Connected Accounts</h1>
        <p className="va-introtext">
          {/* eslint-disable prettier/prettier */}
          You gave the sites and applications listed below permissions to access
          some of your VA.gov profile data. These sites and applications can
          only view your information. They can’t change anything.
          {/* eslint-enable prettier/prettier */}
        </p>
        {deletedAccounts.map(account => (
          <AppDeletedAlert
            account={account}
            key={account.id}
            dismissAlert={dismissAlert}
          />
        ))}

        <ul className="va-connected-acct-list">
          {activeAccounts.map((account, idx) => (
            <ConnectedApp
              key={account.id}
              confirmDelete={confirmDelete}
              isLast={idx + 1 === activeAccounts.length}
              {...account}
            />
          ))}
        </ul>

        <div className="feature">
          <h3>Have questions about connected accounts?</h3>
          <p>
            Get answers to frequently asked questions about connected accounts
            and how they work with your VA.gov account.
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
