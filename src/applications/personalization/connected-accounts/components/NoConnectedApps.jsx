import React from 'react';

import recordEvent from '../../../../platform/monitoring/record-event';

const recordAction = () => {
  recordEvent({
    event: 'account-navigation',
    'account-action': 'view-link',
    'account-section': 'vets-faqs',
  });
};

export class NoConnectedApps extends React.Component {
  componentDidMount() {
    this.header.focus();
  }

  noAccountsMessage() {
    return this.props.errors.length > 0
      ? 'Sorry — we can’t seem to find any connected accounts.'
      : 'You do not have any connected accounts.';
  }

  render() {
    return (
      <div className="row va-connected-acct-null">
        <div className="usa-width-two-thirds medium-8 small-12 columns">
          <h2
            tabIndex="-1"
            ref={header => {
              this.header = header;
            }}
          >
            {this.noAccountsMessage()}
          </h2>
          <div className="feature">
            <h3>
              Have questions about signing in to {this.props.propertyName}?
            </h3>
            <p>
              Get answers to frequently asked questions about how to sign in,
              common issues with verifying your identity, and your privacy and
              security on {this.props.propertyName}.
            </p>

            <a href="/sign-in-faq/" onClick={recordAction}>
              Go to {this.props.propertyName} FAQs
            </a>
          </div>
        </div>
      </div>
    );
  }
}
