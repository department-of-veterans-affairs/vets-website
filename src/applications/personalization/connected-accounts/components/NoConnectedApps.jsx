import React from 'react';

import recordEvent from '../../../../platform/monitoring/record-event';

const recordAction = () => {
  recordEvent({
    event: 'account-navigation',
    'account-action': 'view-link',
    'account-section': 'vets-faqs',
  });
};

export function NoConnectedApps({ errors, propertyName }) {
  let title;
  if (errors.length > 0) {
    title = <h3>Sorry — we can’t seem to find any connected accounts.</h3>;
  } else {
    title = <h3>You do not have any connected accounts.</h3>;
  }

  return (
    <div className="row va-connected-acct-null">
      <div className="usa-width-two-thirds medium-8 small-12 columns">
        {title}
        <div className="feature">
          <h3>Have questions about signing in to {propertyName}?</h3>
          <p>
            Get answers to frequently asked questions about how to sign in,
            common issues with verifying your identity, and your privacy and
            security on {propertyName}.
          </p>

          <a href="/faq" onClick={recordAction}>
            Go to {propertyName} FAQs
          </a>
        </div>
      </div>
    </div>
  );
}
