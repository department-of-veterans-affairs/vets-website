import React from 'react';

export default function App({ children }) {
  return (
    <div className="vads-l-grid-container vads-u-padding-y--2">
      <h1 tabIndex="-1" data-testid="header">
        Beneficiary Travel Self Service
      </h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <p className="va-introtext">Lead text</p>
      <p>Body text</p>

      {/* Alert starts */}
      <va-alert
        close-btn-aria-label="Close notification"
        status="info"
        uswds
        visible
      >
        <h2 id="track-your-status-on-mobile" slot="headline">
          Track your claim or appeal on your mobile device
        </h2>
        <p className="vads-u-margin-y--0">
          Lorem ipsum dolor sit amet{' '}
          <a className="usa-link" href="/">
            consectetur adipiscing
          </a>{' '}
          elit sed do eiusmod.
        </p>
      </va-alert>
      {/* Alert ends */}
      <br />

      {/* Table starts */}
      <main>
        <va-table table-title="Travel claims">
          <va-table-row slot="headers">
            <span>Travel claim Number</span>
            <span>Status</span>
            <span>Details</span>
          </va-table-row>
          <va-table-row>
            <span>#1234567</span>
            <span>
              <span className="usa-label">In Process</span>
            </span>
            <span>Consequat cillum, voluptate labore.</span>
          </va-table-row>
          <va-table-row>
            <span>#09876543</span>
            <span>
              <span className="usa-label uswds-system-color-gold-20v">
                In Manual Review
              </span>
            </span>
            <span>---</span>
          </va-table-row>
        </va-table>
      </main>
      {/* Table ends */}
      {children}
    </div>
  );
}
